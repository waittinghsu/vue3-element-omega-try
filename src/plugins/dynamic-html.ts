import { Plugin } from "vite";

export default function dynamicHtmlPlugin(platform: string): Plugin | null {
  if (!platform) return { name: "vite-plugin-dynamic-html" };
  return {
    name: "vite-plugin-dynamic-html",
    transformIndexHtml: {
      order: "pre", // 在所有HTML转换之前应用
      handler(html) {
        const scriptSrc = `/src/platforms/${platform}System/main.ts`;
        console.log(`Building for platform[transformIndexHtml]: ${platform}`);
        return {
          html: html.replace(
            `<script type="module" src="/src/main.ts"></script>`,
            `<script type="module" src="${scriptSrc}"></script>`
          ),
          tags: [
            {
              tag: "script",
              attrs: { type: "module", src: scriptSrc },
              injectTo: "body",
            },
          ],
        };
      },
    },
  };
}
