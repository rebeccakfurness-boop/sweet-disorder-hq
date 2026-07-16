// Renders a training section's `content` string. See the comment atop
// src/lib/training/mock.ts for the authoring convention this implements:
// blank-line-separated blocks that resolve to an ordered list, a bullet
// list, a reference table ("Label: value" lines), or plain paragraphs.
function classifyBlock(block: string) {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 0 && lines.every((line) => /^\d+\.\s/.test(line))) {
    return { type: "ordered" as const, items: lines.map((line) => line.replace(/^\d+\.\s/, "")) };
  }
  if (lines.length > 0 && lines.every((line) => /^[-•]\s/.test(line))) {
    return { type: "unordered" as const, items: lines.map((line) => line.replace(/^[-•]\s/, "")) };
  }
  if (lines.length >= 2 && lines.every((line) => /^.+?:\s.+$/.test(line))) {
    return {
      type: "definition" as const,
      items: lines.map((line) => {
        const separatorIndex = line.indexOf(": ");
        return { label: line.slice(0, separatorIndex), value: line.slice(separatorIndex + 2) };
      }),
    };
  }
  return { type: "paragraph" as const, items: lines };
}

export function SectionContent({ content }: { content: string }) {
  const blocks = content.split("\n\n").map(classifyBlock);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === "ordered") {
          return (
            <ol key={index} className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ol>
          );
        }
        if (block.type === "unordered") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "definition") {
          return (
            <dl key={index} className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
              {block.items.map((item, itemIndex) => (
                <div key={itemIndex} className="space-y-0.5">
                  <dt className="text-sm font-medium text-foreground">{item.label}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          );
        }
        return (
          <div key={index} className="space-y-2">
            {block.items.map((line, lineIndex) => (
              <p key={lineIndex} className="text-sm leading-relaxed text-foreground">
                {line}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
