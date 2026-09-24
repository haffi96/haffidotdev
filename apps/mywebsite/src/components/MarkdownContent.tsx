import { prepareMarkdown } from "../lib/content";

export function MarkdownContent({ body, className = "" }: Readonly<{ body: string; className?: string }>) {
  return (
    <div
      className={`prose prose-cine max-w-none break-words md:prose-lg prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-h4:text-xl prose-h4:text-white prose-a:decoration-neon/40 prose-a:underline-offset-4 hover:prose-a:decoration-neon prose-strong:font-semibold prose-code:rounded-md prose-code:border prose-code:border-line prose-code:bg-ink prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:border prose-pre:border-line prose-pre:font-mono prose-pre:text-sm [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 prose-img:mx-auto prose-img:max-w-full prose-img:rounded-xl prose-img:bg-white prose-img:p-3 prose-hr:my-10 [&>hr:first-child]:hidden prose-li:marker:text-neon ${className}`}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(prepareMarkdown(body)) }}
    />
  );
}

function markdownToHtml(markdown: string) {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let codeBlock: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      flushParagraph();
      closeList();
      if (codeBlock) {
        html.push(`<pre><code>${escapeHtml(codeBlock.join("\n"))}</code></pre>`);
        codeBlock = null;
      } else {
        codeBlock = [];
      }
      continue;
    }

    if (codeBlock) {
      codeBlock.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    if (trimmed === "---") {
      flushParagraph();
      closeList();
      html.push("<hr />");
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1]?.length ?? 2;
      html.push(`<h${level}>${inline(heading[2] ?? "")}</h${level}>`);
      continue;
    }

    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flushParagraph();
      closeList();
      html.push(`<img src="${escapeHtml(image[2] ?? "")}" alt="${escapeHtml(image[1] ?? "")}" />`);
      continue;
    }

    const unordered = trimmed.match(/^-\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${inline(unordered[1] ?? "")}</li>`);
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${inline(ordered[1] ?? "")}</li>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();

  if (codeBlock) {
    html.push(`<pre><code>${escapeHtml(codeBlock.join("\n"))}</code></pre>`);
  }

  return html.join("\n");
}

function inline(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
