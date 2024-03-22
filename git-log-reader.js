/*
Grab and parse the output of git log --pretty=format:'%h - %an, %ar : %s'
Use GPT to summarize the commit messages 

Access PR information from Github API
*/

const { exec } = require('child_process');
const { Octokit } = require("@octokit/rest");
const { GPT } = require('gpt-3.5-turbo');

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
    });
const gpt = new GPT({
    apiKey: process.env.OPENAI_API_KEY,
    gptVersion: 'text-davinci-003',
    temperature: 0.5,
    maxTokens: 100
});

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
            gpt.summarize(message).then(console.log);
        });
    });
}

const getPRs = async () => {
    const { data } = await octokit.rest.pulls.list({
        owner: 'octokit',
        repo: 'rest.js',
        state: 'all'
    });
    data.forEach(pr => {
        console.log(`PR: ${pr.title} by ${pr.user.login} on ${pr.created_at}`);
        gpt.summarize(pr.title).then(console.log);
    });
}

getCommits();
getPRs();
