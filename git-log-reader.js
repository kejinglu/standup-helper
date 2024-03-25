/*
Grab and parse the output of git log --pretty=format:'%h - %an, %ar : %s'
Use GPT to summarize the commit messages 

Access PR information from Github API
*/

const { exec } = require('child_process');
const { Octokit, App } = require('octokit');
const { GPT } = require('easygpt');
var JiraApi = require('jira-client');

const palm_toolkit = require('palm_toolkit');
const GPT3 = require('openai').GPT;
const gpt3 = new GPT3({
    apiKey: process.env.OPENAI_API_KEY,
    gptVersion: 'text-davinci-003',
});
//Use Github API
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
    });
    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  console.log("Hello, %s", login);

const gpt = new GPT({
});
// Initialize JIRA
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


//rewrite getting pts
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

// Fetch the authenticated user's JIRA stories
const getJiraStories = async () => {
    const jiraData = await jira.searchJira();
    console.log(jiraData);
}


getJiraStories();
getCommits();
getPRs();


