# codedeploy-poller

Polls for a AWS CodeDeploy deployment id until it succeeds or fails

#Installation

```
npm install codedeploy-poller --save-dev
```

#Dependencies
You must have [awscli](https://aws.amazon.com/cli/) installed.

#Usage

```
Options:
  --profile                 awscli profile name
  --application-name        The CodeDeploy application's name         [required]
  --deployment-group-name   The CodeDeploy deployment group's name    [required]
  --s3-bucket               The bucket in which the bundle is stored  [required]
  --s3-bundle-type          The type of bundle (tar, tgz, zip)        [required]
  --s3-key                  The location in the bucket of the bundle (a path)
  --deployment-config-name  A documented predefined values
                                       [default: "CodeDeployDefault.OneAtATime"]
                                                                      [required]
  --description             A textual description to give the deployment
                                   [default: "Deployment via codedeploy-poller"]
  --poll-interval           how often to poll (secs)    [required] [default: 10]
```
