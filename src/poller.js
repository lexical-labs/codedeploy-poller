import "babel-polyfill";
import {execSync} from "child_process";

const endStates = {
  Failed: -1,
  Succeeded: 1
};


function createDeployment (
  profile,
  applicationName,
  deploymentGroupName,
  s3Bucket,
  s3BundleType,
  s3Key,
  ignoreApplicationStopFailures,
  deploymentConfigName = "CodeDeployDefault.OneAtATime",
  description = "Deployment via codedeploy-poller"
) {

  const createDeploymentCommand = [
    `aws deploy create-deployment`,
    `--application-name ${applicationName}`,
    `--deployment-config-name ${deploymentConfigName}`,
    `--deployment-group-name ${deploymentGroupName}`,
    `--description "${description}"`,
    `--s3-location bucket=${s3Bucket},bundleType=${s3BundleType},key=${s3Key}`,
    ignoreApplicationStopFailures ? "--ignore-application-stop-failures" : "",
    profile ? `--profile ${profile}` : ""
  ].join(" ");

  try {
    const output = execSync(createDeploymentCommand);
    return Promise.resolve(JSON.parse(output.toString()).deploymentId);
  } catch (error) {
    return Promise.reject(
      `Error while running command: ${createDeploymentCommand}`
    );
  }
}

function pollForStatus (profile, pollInterval, deploymentId, resolve, reject) {
  const getDeploymentStateCommand = [
    `aws deploy get-deployment`,
    `--deployment-id ${deploymentId}`,
    profile ? `--profile ${profile}` : ""
  ].join(" ");
  try {
    const output = execSync(getDeploymentStateCommand);
    const response = JSON.parse(output.toString()).deploymentInfo;
    const status = response.status;
    if (!endStates[status]) {
      setTimeout(
        () => pollForStatus(profile, pollInterval,
          deploymentId, resolve, reject),
        pollInterval
      );
    } else if (endStates[status] > 0) {
      resolve();
    } else {
      reject(response.errorInformation);
    }
  } catch (error) {
    reject(`Error while running command: ${getDeploymentStateCommand}`);
  }
}

function testStatus (profile, pollInterval, deploymentId) {
  return new Promise((resolve, reject) => {
    pollForStatus(profile, pollInterval, deploymentId, resolve, reject);
  });
}

export default function pollForDeployment (profile, pollInterval, ...args) {
  return createDeployment(profile, ...args)
    .then(deploymentId => testStatus(profile, pollInterval, deploymentId));
}
