#!usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { exec } from 'child_process';
import { get } from 'http';
import { Octokit, App } from 'octokit';


let username;
let password;

const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));
async function welcome(){
    const welcomeTitle = chalkAnimation.neon('Welcome to Standup Helper \n',2);

await sleep();
welcomeTitle.stop();

console.log(`${chalk.green('enable JIRA Git Log Reader: \nPlease login your JIRA account to get started.')}
`);
}

const questions = [
    {
        type: 'input',
        name: 'username',
        message: 'Enter your JIRA username: '
    },
    {
        type: 'password',
        name: 'password',
        message: 'Enter your JIRA password: '
    }
];



async function getJiraLogin() {
    const answers = await inquirer.prompt(questions);
    username = answers.username;
    password = answers.password;
};

//Use Github API
let git_authed = false;
async function initGitClient() {
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
    });
    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
    const {
        data: { login },
      } = await octokit.rest.users.getAuthenticated()
        .then(({ data }) => {
            console.log(`Hello, ${data.login}`)
            git_authed = true;
            console.log(`Github Login Success!`);
        }).catch((error) => {
    console.error('Error:', error);
  });
}
   
async function gitLogin(){
console.log(chalk.green('Thank you! Next, login to Github: (dependent on Github token)'));
initGitClient()
}


async function getCommits() {
    const spinner = createSpinner('Fetching commits');
    spinner.start();
    await sleep(3000);
    spinner.succeed('Commits fetched');
}

async function getPRs() {
    const spinner = createSpinner('Fetching pull requests');
    spinner.start();
    await sleep(3000);
    spinner.succeed('Pull requests fetched');
}

async function getJiraStories() {
    const spinner = createSpinner('Fetching JIRA stories');
    spinner.start();
    await sleep(3000);
    spinner.succeed('JIRA stories fetched');
}

await welcome();
await getJiraLogin();
await gitLogin();


