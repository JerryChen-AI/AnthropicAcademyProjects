from markitdown import MarkItDown, StreamInfo
from io import BytesIO
from pathlib import Path
from pydantic import Field


def binary_document_to_markdown(binary_data: bytes, file_type: str) -> str:
    """Converts binary document data to markdown-formatted text."""
    md = MarkItDown()
    file_obj = BytesIO(binary_data)
    stream_info = StreamInfo(extension=file_type)
    result = md.convert(file_obj, stream_info=stream_info)
    return result.text_content


def document_path_to_markdown(
    file_path: str = Field(description="Absolute or relative path to the document file to convert (e.g. /reports/q4.pdf, ./notes.docx)"),
) -> str:
    """Convert a document file at the given path to markdown-formatted text.

    Reads the file from disk, infers the format from the file extension, and
    returns the document content as a markdown string. Delegates conversion to
    MarkItDown via binary_document_to_markdown.

    When to use:
    - When you have a local file path and want its content as markdown
    - Not for use when you already have the file bytes in memory; use
      binary_document_to_markdown instead

    Examples:
    >>> document_path_to_markdown("/reports/q4.pdf")
    "# Q4 Report\\n\\n..."
    >>> document_path_to_markdown("./notes.docx")
    "## Meeting Notes\\n\\n..."
    """
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"No file found at: {file_path}")
    binary_data = path.read_bytes()
    return binary_document_to_markdown(binary_data, path.suffix)
