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
