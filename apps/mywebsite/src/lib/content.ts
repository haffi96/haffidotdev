type RawModuleMap = Record<string, string>;

export type BlogMeta = {
  title: string;
  rank: number;
  category: string;
  name: string;
  ignore?: boolean;
};

export type ProjectMeta = {
  title: string;
  rank: number;
  preview: string;
  techstack: string;
  site?: string;
  githublink1: string;
  githublink2?: string;
};

export type ContentEntry<TMeta> = {
  slug: string;
  data: TMeta;
  body: string;
};

const blogModules = import.meta.glob<string>("../content/blogs/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default"
}) as RawModuleMap;

const projectModules = import.meta.glob<string>("../content/projects/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default"
}) as RawModuleMap;

const mediaModules = import.meta.glob<string>("../media/*", {
  eager: true,
  query: "?url",
  import: "default"
}) as RawModuleMap;

const mediaByFileName = Object.fromEntries(
  Object.entries(mediaModules).map(([path, url]) => [path.split("/").pop(), url])
);

export function getMediaUrl(fileNameOrPath: string) {
  const fileName = fileNameOrPath.split("/").pop();
  return fileName ? mediaByFileName[fileName] : undefined;
}

export const blogs = Object.entries(blogModules)
  .map(([path, raw]) => parseEntry<BlogMeta>(path, raw))
  .sort((a, b) => b.data.rank - a.data.rank);

export const visibleBlogs = blogs.filter((blog) => !blog.data.ignore);

export const projects = Object.entries(projectModules)
  .map(([path, raw]) => parseEntry<ProjectMeta>(path, raw))
  .sort((a, b) => a.data.rank - b.data.rank);

export function findBlog(slug: string) {
  return blogs.find((blog) => blog.slug === slug);
}

export function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function prepareMarkdown(body: string) {
  const importedImages = new Map<string, string>();

  const withoutImports = body
    .replace(/^import\s+\{\s*Image\s*\}\s+from\s+["']astro:assets["'];?\s*$/gm, "")
    .replace(/^import\s+(\w+)\s+from\s+["']([^"']+)["'];?\s*$/gm, (_match, variable: string, path: string) => {
      const url = getMediaUrl(path);
      if (url) {
        importedImages.set(variable, url);
      }
      return "";
    });

  return withoutImports.replace(/<Image\s+([\s\S]*?)\/>/g, (_match, attributes: string) => {
    const srcVariable = attributes.match(/src=\{(\w+)\}/)?.[1];
    const src = srcVariable ? importedImages.get(srcVariable) : undefined;
    const alt = attributes.match(/alt=["']([^"']*)["']/)?.[1] ?? "";

    return src ? `![${alt}](${src})` : "";
  });
}

function parseEntry<TMeta>(path: string, raw: string): ContentEntry<TMeta> {
  const parsed = parseFrontmatter(raw);
  return {
    slug: path.split("/").pop()?.replace(/\.mdx$/, "") ?? "",
    data: parsed.data as TMeta,
    body: parsed.content.trim()
  };
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { data: {}, content: raw };
  }

  const frontmatter = match[1] ?? "";
  const data = Object.fromEntries(
    frontmatter
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");
        const key = line.slice(0, separatorIndex).trim();
        const rawValue = line.slice(separatorIndex + 1).trim();
        return [key, parseFrontmatterValue(rawValue)];
      })
  );

  return { data, content: raw.slice(match[0].length) };
}

function parseFrontmatterValue(value: string) {
  const unquoted = value.replace(/^['"]|['"]$/g, "");

  if (unquoted === "true") {
    return true;
  }
  if (unquoted === "false") {
    return false;
  }
  if (unquoted !== "" && !Number.isNaN(Number(unquoted))) {
    return Number(unquoted);
  }
  return unquoted;
}
