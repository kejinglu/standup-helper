

The js script uses the `exec` function from the `child_process` module to run the `git log` command and fetch the commit messages. It then uses the GPT model to summarize each commit message. It also fetches pull request information from the GitHub API using the `@octokit/rest` library and summarizes the PR titles using the GPT model.

To run this script, you need to have the necessary environment variables set for the GitHub token and OpenAI API key. You can set these environment variables in your terminal before running the script.

```
export GITHUB_TOKEN=your_github_token
export OPENAI_API_KEY=your_openai_api_key
node git-log-reader.js
```

This script demonstrates how you can combine Git log parsing, GitHub API access, and text summarization using GPT to analyze and summarize commit messages and pull request titles. You can further customize and extend this script to suit your specific use case and requirements.

## Conclusion

In this guide, we explored how to use Node.js to interact with Git repositories, parse Git logs, and access GitHub API data. We also demonstrated how to use the GPT model for text summarization to analyze and summarize commit messages and pull request titles. By combining these tools and techniques, you can build powerful automation scripts and tools for analyzing and processing Git repository data.

If you have any questions or feedback, please feel free to reach out to us. We'd love to hear from you!

Happy coding! 
    
🚀

## References
- [Node.js Child Processes](https://nodejs.org/api/child_process.html)
- [Octokit REST API Client for GitHub](https://octokit.github.io/rest.js/v18)
- [OpenAI GPT-3.5 API](https://beta.openai.com/docs/api-reference/introduction)
- [GitHub REST API v3](https://docs.github.com/en/rest)
- [Git Log Documentation](https://git-scm.com/docs/git-log)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [OpenAI API Documentation](https://beta.openai.com/docs/api-reference/introduction)
- [Node.js Documentation](https://nodejs.org/en/docs/)

