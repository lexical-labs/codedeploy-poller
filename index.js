import yargs from "yargs";

import pollForDeployment from "./src/poller";

function getCommandLineOptions () {
  return yargs
    .demand([
      "poll-interval", "application-name", "deployment-group-name",
      "s3-bucket", "s3-bundle-type", "s3-key"
    ])

    .describe("profile", "awscli profile name")
    .describe("application-name", "The CodeDeploy application's name")
    .describe("deployment-group-name", "The CodeDeploy deployment group's name")
    .describe("s3-bucket", "The bucket in which the bundle is stored")
    .describe("s3-bundle-type", "The type of bundle (tar, tgz, zip)")
    .describe("s3-key", "The location in the bucket of the bundle (a path)")
    .describe("deployment-config-name", "A documented predefined values")
    .describe("description", "A textual description to give the deployment")
    .describe("poll-interval", "how often to poll (secs)")
    .describe("ignore-application-stop-failures", "ignores stop failures")

    .default("poll-interval", 10)
    .default("ignore-application-stop-failures", false)
    .default("deployment-config-name", "CodeDeployDefault.OneAtATime")
    .default("description", "Deployment via codedeploy-poller")

    .argv;

}

function run () {

  const argv = getCommandLineOptions();

  pollForDeployment(
    argv.profile,
    argv.pollInterval * 1000,
    argv.applicationName,
    argv.deploymentGroupName,
    argv.s3Bucket,
    argv.s3BundleType,
    argv.s3Key,
    argv.ignoreApplicationStopFailures,
    argv.deploymentConfigName,
    argv.description
  ).then(
    /* eslint-disable no-console */
    () => console.log("Deploy Succeeded"),
    error => console.log(error) || process.exit(1)
    /* eslint-enable no-console */
  );
}

run();
