# Learning AI

## AI Models

Anthropic:

- Opus 5.5 (1M Context) - Best for everyday, complex tasks
- Fable 5.1 - Most capable for your hardest and longest-running tasks · Requires usage credits

## MCP Example with Python and Claude Code

```sh
# Install uv first if you don't have it
# curl -LsSf https://astral.sh/uv/install.sh | sh

# Create a python project if you don't have one
uv init
# Using CPython 3.13.7 interpreter at: /Library/Frameworks/Python.framework/Versions/3.13/bin/python3.13
# Creating virtual environment at: .venv

# Install the mcp library
uv add "mcp[cli]"
```

```py
from mcp.server.mcpserver import MCPServer

mcp = MCPServer("demo")

@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers."""  # the docstring becomes the tool description the model sees
    return a + b

@mcp.resource("greeting://{name}")
def greeting(name: str) -> str:
    """A read-only piece of data the client can fetch."""
    return f"Hello, {name}!"

@mcp.prompt()
def review(code: str) -> str:
    return f"Please review this code:\n\n{code}"

if __name__ == "__main__":
    mcp.run()  # stdio transport by default
```

```sh
# Web UI
uv run mcp dev src/mcp_server.py

# Just run the server
uv run src/mcp_server.py

# registers your server with Claude Code under the name demo, so Claude can call its add tool, the review prompt and the greeting://{name} resource.
claude mcp add demo -- uv run src/mcp_server.py

claude mcp list
```

The above command registers your server with Claude Code under the name demo, so Claude can call its add tool, the review prompt and the greeting://{name} resource.

- claude mcp add demo adds an MCP server called demo.
- When a Claude Code session starts, it runs the mcp server as a child process and talks to it over stdin/stdout. That's the stdio transport, which is the default and matches mcp.run() in your file.

Some details:

- Scope: by default it's local. That means it's stored in ~/.claude.json for this project folder only and is private to you. Add -s project to write a .mcp.json you can commit, or -s user to make it available in every project.
- Relative path: src/mcp_server.py is resolved against the folder where Claude Code is started. It only works when you launch claude from the repo root. For a version that works from anywhere, use uv run --directory /Users/petermarklund/src/learning-ai src/mcp_server.py.
- Check it: run claude mcp list or /mcp inside a session to see whether it connected. Remove it with claude mcp remove demo.

It doesn't start anything right away. The server is launched each time a Claude Code session starts, and stops when the session ends.

Usage from Claude:

Tool (add). Ask in plain language, for example "use the demo add tool to add 2 and 3". Claude calls mcp**demo**add, and the first time it will ask you to approve the call. You can approve it for good by adding mcp**demo**add to your allowed tools.

Prompt (review). Prompts become slash commands:
/mcp**demo**review def f(x): return x+1
The text after the command fills the code argument. Claude then gets back your "Please review this code: …" text as the message.

Resource (greeting://{name}). Reference it with @:
@demo:greeting://Peter
The contents ("Hello, Peter!") are added to your message. Typing @ shows autocomplete for resources. Because greeting is a template with a {name} placeholder, it may not appear in that list, so type the full form yourself.

## Resources

Agentic Software Development Tools

- [Claude Code by Anthropic](https://claude.com/product/claude-code)
- [Codex by OpenAI](https://openai.com/codex/)

Learning Claude Code:

- [Claude Code Cheatsheet](https://support.claude.com/en/articles/14553413-claude-code-cheatsheet)

Claude plugins, skills and tools:

- [Ponytail (ponytail-audit, ponytail-review etc.)](https://github.com/dietrichgebert/ponytail)
- [Matt Pocock skills (grill-me etc.)](https://github.com/mattpocock/skills)
- [Karpathy Claude.md file](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)
- [Superpowers Agent Workflow](https://github.com/obra/superpowers)
- [browse.sh - A browser CLI for your AI Agents](https://browse.sh/)
- [FastMCP - Python Framework for building MCP servers](https://gofastmcp.com/getting-started/welcome)

Articles:

- [How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/)
- [The Collapse Of Software Engineering And The Beginning Of Something New](https://levelup.gitconnected.com/the-collapse-of-software-engineer-9796a96b8022)

Courses:

- [Datacamp - Associate AI Engineer for Developers](https://app.datacamp.com/learn/career-tracks/associate-ai-engineer-for-developers)
