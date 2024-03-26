

The js script as CLI module is still in progress, it uses the GPT model to summarize daily work.
 It fetches pull request information from the GitHub API using the `@octokit` library and summarizes the PR titles using the GPT model.
 It fetches JIRA sprint tickets related to a user's activity yesterday.

To run this script, you need to have the necessary environment variables set for the GitHub token 
`https://github.com/settings/tokens` and OpenAI API key. You can set these environment variables in your terminal before running the script.

```
export GITHUB_TOKEN=your_github_token
export OPENAI_API_KEY=your_openai_api_key
```


## Current progress
<img width="745" alt="Screenshot 2024-03-26 at 3 21 52 PM" src="https://github.com/kejinglu/standup-helper/assets/32747843/08e38d97-37ef-4747-a310-f22091b8bebd">



If you have any questions or feedback, please feel free to reach out to me. 

## References
- [Node.js Child Processes](https://nodejs.org/api/child_process.html)
- [Octokit REST API Client for GitHub](https://octokit.github.io/rest.js/v18)
- [OpenAI GPT-3.5 API](https://beta.openai.com/docs/api-reference/introduction)
- [GitHub REST API v3](https://docs.github.com/en/rest)
- [Git Log Documentation](https://git-scm.com/docs/git-log)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [OpenAI API Documentation](https://beta.openai.com/docs/api-reference/introduction)
- [Node.js Documentation](https://nodejs.org/en/docs/)

