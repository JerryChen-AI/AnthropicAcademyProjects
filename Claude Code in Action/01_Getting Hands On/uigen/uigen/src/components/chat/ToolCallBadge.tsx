"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolCallBadgeProps {
  toolInvocation: ToolInvocation;
}

function basename(path: string): string {
  return path.split("/").filter(Boolean).pop() || path;
}

type ActionLabels = { active: string; done: string };

function getLabels(toolName: string, args: Record<string, unknown>): ActionLabels {
  const path = args.path as string | undefined;
  const file = path ? basename(path) : "";

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return { active: `Creating ${file}`, done: `Created ${file}` };
      case "str_replace":
      case "insert":
        return { active: `Editing ${file}`, done: `Edited ${file}` };
      case "view":
        return { active: `Reading ${file}`, done: `Read ${file}` };
    }
  }

  if (toolName === "file_manager") {
    const newPath = args.new_path as string | undefined;
    switch (args.command) {
      case "rename":
        return {
          active: `Renaming ${file}`,
          done: `Renamed ${file}${newPath ? ` → ${basename(newPath)}` : ""}`,
        };
      case "delete":
        return { active: `Deleting ${file}`, done: `Deleted ${file}` };
    }
  }

  return { active: toolName, done: toolName };
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const isDone = toolInvocation.state === "result";
  const { active, done } = getLabels(toolInvocation.toolName, toolInvocation.args ?? {});

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-700">{isDone ? done : active}</span>
    </div>
  );
}
