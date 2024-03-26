/*
Grab and parse the output of git log --pretty=format:'%h - %an, %ar : %s'
Use GPT to summarize the commit messages 

Access PR information from Github API
*/

const { exec } = require('child_process');
// const { Octokit, App } = require('octokit');
const { GPT } = require('easygpt');
var JiraApi = require('jira-client');
const fetch = require('node-fetch');

const palm_toolkit = require('palm_toolkit');

//Use Github API
// let git_authed = false;
// async function initGitClient() {
// const octokit = new Octokit({
//     auth: process.env.GITHUB_TOKEN,
//     });
//     // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
// const {
//     data: { login },
//   } = await octokit.rest.users.getAuthenticated()
//   .then(({ data }) => {
//     console.log(`Hello, ${data.login}`)
//     git_authed = true;
//   }).catch((error) => {
//     console.error('Error:', error);
//   });
// }
   
const gpt = new GPT({
});
// Initialize JIRA -> with oauth2 
var jira = new JiraApi({
    protocol: 'https',
    host: 'jira.'+jirahost+'.com',
    username: username,
    password: password,
    apiVersion: '2',
    strictSSL: true
  });

  // GPT prompts
gpt.setApiKey(process.env.OPENAI_API_KEY)
.addMessage(`Hello, I'm a developer and I'm looking for a way to automate my workflow.
I want to be able to summarize commit messages and PR titles,descriptions so I can quickly help others understand what have I done yesterday for a morning standup .
Can you help me to summarize info by story from JIRA and PRs cteated on Github mapping into JIRA stories?
this will help me to quickly report my progress in the sprint or epic. I'll give info in the format of git log and PRs from Github API. and you summarize it for me.`)
const response = await gpt.ask();
const summary = await palm_toolkit.summarizeText(response.content, 5);

console.log(response.content);
console.log(summary);

gpt.addMessage("Here's the github info"+JSON.stringify(pr_data)+"with commits summarized: "+JSON.stringify(commit_summary));
const res_git = await gpt.ask();
console.log(res_git.content);

gpt.addMessage("Also here's the JIRA info"+JSON.stringify(jiraData));
const res_jira = await gpt.ask();
console.log(res_jira.content);
const jira_summary = await palm_toolkit.summarizeText(res_jira, 4);
console.log("JIRA summary: "+jira_summary);



const getCommits = () => {
    exec('git log --pretty=format:"%h - %an, %ar : %s"', (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
        const commits = stdout.split('\n');
        commits.forEach(commit => {
            const [hash, author, date, message] = commit.split(' - ');
            console.log(`Commit: ${hash} by ${author} on ${date} with message: ${message}`);
        });
        commit_summary =  palm_toolkit.summarizeText(response.content, 5);
    });
}


//rewrite getting prs
// Fetch the authenticated user's pull requests updated since the start of the last weekday
const lastWeekdayStart = new Date();
lastWeekdayStart.setDate(lastWeekdayStart.getDate() - (lastWeekdayStart.getDay() + 1) % 7);

const getPRs = async () => {
const { data: pullRequests } = await octokit.rest.pulls.list({
    state: 'all',  // Include both open and closed pull requests
    sort: 'updated',  // Sort by last updated
    direction: 'desc',  // Sort in descending order (most recent first)
    since:lastWeekdayStart.toISOString()  // Fetch pull requests updated since the start of the last weekday
  });
  pr_data = palm_toolkit.summarizeText( JSON.stringify(pullRequests), 5);
  console.log("PRs"+pullRequests);
    console.log("PRs summary"+pr_data);
}


let jirahost = prompt("Enter JIRA host name (ususlly company name): ");
let username = prompt("Enter JIRA username: ");
let password = prompt("Enter JIRA password: ");
let projectkey = prompt("Enter JIRA project key: (e.g. FAB in ticket FAB-123) ");
const jiraBaseUrl = 'https://jira.'+jirahost+'.com';
// Fetch the authenticated user's JIRA stories
const getJiraStories = async () => {
    const jiraData = await jira.searchJira();
    console.log(jiraData);
}
//JIRA (1)Get board id
let boardId = '';
fetch(jiraBaseUrl+'/rest/agile/1.0/board?projectKeyOrId=' + projectkey+"maxResults=6", {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <access_token>',//TODO: replace with your access token
    'Accept': 'application/json'
  }
})
  .then(response => {
    console.log(
      `Response: ${response.status} ${response.statusText}`
    );
    values = response.json().values;
    boardId = values[0].id;
    return response.text();
  })
  .then(text => console.log("fetch all boards in project: "+text))
  .catch(err => console.error(err));

  //JIRA (2)Get board issues
    let issues = [];
    let sprintId = 0;
    fetch(jiraBaseUrl+'/rest/agile/1.0/board/' + boardId + '/issue', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer <access_token>',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        console.log(
            `Response: ${response.status} ${response.statusText}`
        );
        issues = response.json().issues;
        sprintId = issues[0].fields.sprint.id;
        //only keep issues in current sprint
        issues = issues.filter(issue => issue.fields.sprint.id === sprintId);
        return issues;
    })
    .then(issues => filter(issues, issue => issue.fields.assignee === 'me'))//TODO: replace with username
    .then(issues => filter(issues, issue => issue.fields.updated > yesterday))
    .then(issues => console.log("fetch all issues in sprint I worked on yesterday: "+issues))
  

getJiraStories();
getCommits();
getPRs();


