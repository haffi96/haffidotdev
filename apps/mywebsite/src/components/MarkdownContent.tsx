import { prepareMarkdown } from "../lib/content";

export function MarkdownContent({ body }: Readonly<{ body: string }>) {
  return (
    <div
      className="prose max-w-none leading-7 text-black dark:prose-invert dark:text-zinc-300 prose-headings:mt-8 prose-headings:mb-4 prose-headings:font-bold prose-headings:text-black dark:prose-headings:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:my-4 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1 prose-a:text-black prose-a:underline dark:prose-a:text-white prose-code:rounded prose-code:bg-zinc-300 prose-code:px-1 prose-code:py-0.5 prose-code:text-slate-700 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-zinc-800 dark:prose-code:text-zinc-200 prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-zinc-950 prose-pre:p-4 prose-pre:text-zinc-100 prose-img:my-6 prose-img:max-w-full prose-img:rounded-lg prose-img:bg-white prose-table:my-4 prose-table:w-full prose-table:border-collapse prose-table:overflow-hidden prose-table:rounded-lg prose-table:text-left prose-th:border prose-th:border-zinc-400 prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-zinc-400 prose-td:px-3 prose-td:py-2 dark:prose-th:border-zinc-700 dark:prose-td:border-zinc-700"
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
