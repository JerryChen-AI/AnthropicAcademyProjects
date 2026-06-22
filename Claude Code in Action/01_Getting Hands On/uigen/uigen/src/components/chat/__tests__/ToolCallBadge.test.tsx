import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: "call" | "result" = "call"
): ToolInvocation {
  if (state === "result") {
    return { toolCallId: "1", toolName, args, state, result: {} };
  }
  return { toolCallId: "1", toolName, args, state };
}

test("shows 'Creating' label while str_replace_editor create is in progress", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" })}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows 'Created' label after str_replace_editor create completes", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "result")}
    />
  );
  expect(screen.getByText("Created App.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace command", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/src/Button.tsx" })}
    />
  );
  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
});

test("shows 'Edited' label after str_replace completes", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/src/Button.tsx" }, "result")}
    />
  );
  expect(screen.getByText("Edited Button.tsx")).toBeDefined();
});

test("shows 'Editing' label for insert command", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "insert", path: "/index.ts" })}
    />
  );
  expect(screen.getByText("Editing index.ts")).toBeDefined();
});

test("shows 'Reading' label for view command", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "view", path: "/README.md" })}
    />
  );
  expect(screen.getByText("Reading README.md")).toBeDefined();
});

test("shows 'Deleting' label for file_manager delete in progress", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/old.jsx" })}
    />
  );
  expect(screen.getByText("Deleting old.jsx")).toBeDefined();
});

test("shows 'Deleted' label after file_manager delete completes", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/old.jsx" }, "result")}
    />
  );
  expect(screen.getByText("Deleted old.jsx")).toBeDefined();
});

test("shows rename with new filename after file_manager rename completes", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation(
        "file_manager",
        { command: "rename", path: "/Button.jsx", new_path: "/Button.tsx" },
        "result"
      )}
    />
  );
  expect(screen.getByText("Renamed Button.jsx → Button.tsx")).toBeDefined();
});
