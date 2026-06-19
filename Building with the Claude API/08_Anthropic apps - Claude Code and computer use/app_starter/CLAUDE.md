# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Create and activate virtual environment
uv venv
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows

# Install package in development mode
uv pip install -e .

# Start the MCP server
uv run main.py

# Run all tests
uv run pytest

# Run a single test file
uv run pytest tests/test_document.py

# Run a single test by name
uv run pytest tests/test_document.py::TestBinaryDocumentToMarkdown::test_binary_document_to_markdown_with_docx
```

## Architecture

This project exposes Python functions as MCP tools via `FastMCP`. The pattern is:

1. **Define tool functions in `tools/`** — plain Python functions with Pydantic `Field` annotations on parameters and a structured docstring.
2. **Register them in `main.py`** — call `mcp.tool()(my_function)` for each function to expose it.
3. **Server entry point** — `main.py` creates a `FastMCP("docs")` instance, registers tools, and calls `mcp.run()`.

Currently registered tools: `add` (from `tools/math.py`) and `document_path_to_markdown` (from `tools/document.py`).

## Defining MCP Tools

Tools are plain functions — no decorator on the function itself. Registration happens in `main.py`:

```python
mcp.tool()(my_function)
```

Use `Field` from pydantic for parameter descriptions:

```python
from pydantic import Field

def my_tool(
    param1: str = Field(description="Detailed description of this parameter"),
    param2: int = Field(description="Explain what this parameter does"),
) -> ReturnType:
    """One-line summary.

    Detailed explanation of functionality.

    When to use:
    - Use case A
    - Not for use case B

    Examples:
    >>> my_tool("foo", 1)
    "expected output"
    """
    # implementation
```

Docstring sections to include: one-line summary, detailed explanation, when to use (and not use), and examples with expected input/output.

## Tool Priority

Always prefer MCP tools over direct Python/shell execution. When a task can be accomplished by an MCP tool provided by this project's server, use `ToolSearch` to load the tool schema first, then call the MCP tool directly. Only fall back to `uv run python` or shell commands when no suitable MCP tool exists.

## Code Style

Always apply appropriate type annotations to all function arguments and return values.

## Testing

Tests live in `tests/` and use pytest. Fixture files (`.docx`, `.pdf`) are in `tests/fixtures/`. Tests import directly from `tools/` — no mocking of the MCP layer.
