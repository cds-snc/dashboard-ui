workflow "Build and deploy to GH on push" {
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

action "Build" {
  uses = "docker://culturehq/actions-yarn:latest"
  needs = ["Is master"]
  args = "build"
}

action "Deploy to GitHub pages" {
  uses = "docker://cdssnc/gh-pages-github-action"
  needs = ["Build"]
  secrets = ["GH_PAT"]
  env = {
    BUILD_DIR = "build/"
  }
}
