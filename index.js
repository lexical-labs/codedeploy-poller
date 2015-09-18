import "babel/polyfill";
import {execSync} from "child_process";
import optimist from "optimist";

const argv = optimist
    .demand(["deploymentId"])
    .describe("deploymentId", "deployment id to wait upon final state")
    .describe("profile", "awscli profile name")
    .argv;

const deploymentId = argv.deploymentId;
const profile = argv.profile || "";

const endStates = {
  Failed: -1,
  Succeeded: 1
};

function testStatus () {
  return new Promise((resolve, reject) => {
    const command = `aws deploy get-deployment ` +
      `--deployment-id ${deploymentId}` +
      ` ${profile ? "--profile" : ""} ${profile}`;
    try {
      const output = execSync(command);
      const response = JSON.parse(output.toString()).deploymentInfo;
      const status = response.status;
      if (!endStates[status]) {
        setTimeout(testStatus, 10);
      } else if (endStates[status] > 0) {
        resolve();
      } else {
        reject(response.errorInformation);
      }
    } catch (error) {
      reject(`Error while running command: ${command}`);
    }
  });
}

/* eslint-disable no-console */
testStatus().then(
  () => console.log("Deploy Succeeded"),
  error => console.log(error) || process.exit(1)
);
/* eslint-enable no-console */
