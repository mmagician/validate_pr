'use strict'

const core = require('@actions/core')
var github = require('octonode')

const main = async () => {
  const author = core.getInput('author')
  const prLink = core.getInput('prLink')
  const targetRepo = core.getInput('targetRepo')
  const targetRepoOwner = core.getInput('targetRepoOwner')

  const prNumberPattern = /(?<=pulls\/)\d*/g

  const prNumber = prLink.match(prNumberPattern)[0]

  var client = github.client();

  var ghpr = client.pr(`${targetRepoOwner}/${targetRepo}`, prNumber)

  if (ghpr.state !== 'merged') {
    // Making sure that the PR was merged
    core.setOutput('isValid', false)
  } else {
    const originalPrAuthor = ghpr.userName
    // Making sure it's the same user
    if (originalPrAuthor !== author) {
      core.setOutput('isValid', false)
    } else {
      core.setOutput('isValid', true)
    }
  }
}

main().catch(err => core.setFailed(err.message))
