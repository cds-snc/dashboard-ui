workflow "Build and deploy on push" {
  on = "push"
  resolves = ["Deploy to GitHub pages"]
}

action "Install" {
  uses = "docker://culturehq/actions-yarn:latest"
  args = "install"
}

action "test" {
  uses = "docker://culturehq/actions-yarn:latest"
  needs = ["Install"]
  args = "test"
}

action "Is master" {
  uses = "actions/bin/filter@d820d56839906464fb7a57d1b4e1741cf5183efa"
  needs = ["test"]
  args = "branch master"
}

action "Deploy to GitHub pages" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Is master"]
  args = "run deploy"
}
