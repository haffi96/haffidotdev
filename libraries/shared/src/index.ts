export type StarterApp = {
  name: string;
  url: string;
  framework: string;
};

export function formatAppTitle(app: StarterApp): string {
  return `${app.name} | ${app.framework} on Cloudflare`;
}

export const haffiDomain = "haffi.dev";
