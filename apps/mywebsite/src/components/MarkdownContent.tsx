import { prepareMarkdown } from "../lib/content";

export function MarkdownContent({ body }: Readonly<{ body: string }>) {
  return (
    <div
      className={[
        "prose prose-zinc max-w-none break-words dark:prose-invert sm:prose-lg",
        "prose-p:leading-[1.8] prose-li:my-1 prose-li:marker:text-zinc-400",
        "prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h1:mt-12 prose-h1:mb-4 prose-h1:text-2xl prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg",
        "prose-a:font-medium prose-a:underline prose-a:decoration-amber-500/60 prose-a:underline-offset-4 hover:prose-a:decoration-amber-500",
        "prose-strong:font-semibold",
        "prose-code:rounded-md prose-code:border prose-code:border-zinc-300 prose-code:bg-white prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
        "dark:prose-code:border-zinc-800 dark:prose-code:bg-zinc-900",
        "prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-zinc-950 prose-pre:font-mono prose-pre:text-sm prose-pre:leading-relaxed prose-pre:text-zinc-100",
        "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
        "prose-img:mx-auto prose-img:rounded-xl prose-img:border prose-img:border-zinc-300 prose-img:bg-white prose-img:p-2 dark:prose-img:border-zinc-800",
        "prose-hr:border-zinc-300 dark:prose-hr:border-zinc-800",
        "[&_.table-scroll]:my-6 [&_.table-scroll]:overflow-x-auto prose-table:my-0 prose-table:text-sm prose-th:font-mono prose-th:text-xs prose-th:font-medium prose-td:font-mono prose-td:text-xs"
      ].join(" ")}
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
  let table: string[] = [];

  const flushTable = () => {
    if (table.length === 0) {
      return;
    }
    const rows = table
      .filter((row) => !/^\|?[\s:|-]+\|?$/.test(row))
      .map((row) =>
        row
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((cell) => inline(cell.trim()))
      );
    const [head, ...body] = rows;
    html.push(
      `<div class="table-scroll"><table><thead><tr>${(head ?? []).map((cell) => `<th>${cell}</th>`).join("")}</tr></thead><tbody>${body
        .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
        .join("")}</tbody></table></div>`
    );
    table = [];
  };

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
      flushTable();
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

    if (trimmed.startsWith("|")) {
      flushParagraph();
      closeList();
      table.push(trimmed);
      continue;
    }
    flushTable();

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
  flushTable();

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
