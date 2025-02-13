// vite.config.js
import { defineConfig } from "file:///workspaces/anything-llm/frontend/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "url";

// postcss.config.js
import tailwind from "file:///workspaces/anything-llm/frontend/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///workspaces/anything-llm/frontend/node_modules/autoprefixer/lib/autoprefixer.js";

// tailwind.config.js
var tailwind_config_default = {
  darkMode: "class",
  content: {
    relative: true,
    files: [
      "./src/components/**/*.{js,jsx}",
      "./src/hooks/**/*.js",
      "./src/models/**/*.js",
      "./src/pages/**/*.{js,jsx}",
      "./src/utils/**/*.js",
      "./src/*.jsx",
      "./index.html",
      "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}"
    ]
  },
  theme: {
    extend: {
      rotate: {
        "270": "270deg",
        "360": "360deg"
      },
      colors: {
        "black-900": "#141414",
        accent: "#3D4147",
        "sidebar-button": "#31353A",
        sidebar: "#25272C",
        "historical-msg-system": "rgba(255, 255, 255, 0.05);",
        "historical-msg-user": "#2C2F35",
        outline: "#4E5153",
        "primary-button": "var(--theme-button-primary)",
        secondary: "#2C2F36",
        "dark-input": "#18181B",
        "mobile-onboarding": "#2C2F35",
        "dark-highlight": "#1C1E21",
        "dark-text": "#222628",
        description: "#D2D5DB",
        "x-button": "#9CA3AF",
        royalblue: "#065986",
        purple: "#4A1FB8",
        magenta: "#9E165F",
        danger: "#F04438",
        error: "#B42318",
        warn: "#854708",
        success: "#05603A",
        darker: "#F4F4F4",
        // Generic theme colors
        theme: {
          bg: {
            primary: "var(--theme-bg-primary)",
            secondary: "var(--theme-bg-secondary)",
            sidebar: "var(--theme-bg-sidebar)",
            container: "var(--theme-bg-container)",
            chat: "var(--theme-bg-chat)",
            "chat-input": "var(--theme-bg-chat-input)"
          },
          text: {
            primary: "var(--theme-text-primary)",
            secondary: "var(--theme-text-secondary)"
          },
          sidebar: {
            item: {
              default: "var(--theme-sidebar-item-default)",
              selected: "var(--theme-sidebar-item-selected)",
              hover: "var(--theme-sidebar-item-hover)"
            },
            subitem: {
              default: "var(--theme-sidebar-subitem-default)",
              selected: "var(--theme-sidebar-subitem-selected)",
              hover: "var(--theme-sidebar-subitem-hover)"
            },
            footer: {
              icon: "var(--theme-sidebar-footer-icon)",
              "icon-hover": "var(--theme-sidebar-footer-icon-hover)"
            },
            border: "var(--theme-sidebar-border)"
          },
          "chat-input": {
            border: "var(--theme-chat-input-border)"
          },
          "action-menu": {
            bg: "var(--theme-action-menu-bg)",
            "item-hover": "var(--theme-action-menu-item-hover)"
          },
          settings: {
            input: {
              bg: "var(--theme-settings-input-bg)",
              active: "var(--theme-settings-input-active)",
              placeholder: "var(--theme-settings-input-placeholder)",
              text: "var(--theme-settings-input-text)"
            }
          },
          modal: {
            border: "var(--theme-modal-border)"
          },
          "file-picker": {
            hover: "var(--theme-file-picker-hover)"
          }
        }
      },
      backgroundImage: {
        "preference-gradient": "linear-gradient(180deg, #5A5C63 0%, rgba(90, 92, 99, 0.28) 100%);",
        "chat-msg-user-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%);",
        "selected-preference-gradient": "linear-gradient(180deg, #313236 0%, rgba(63.40, 64.90, 70.13, 0) 100%);",
        "main-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)",
        "modal-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)",
        "sidebar-gradient": "linear-gradient(90deg, #5B616A 0%, #3F434B 100%)",
        "login-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)",
        "menu-item-gradient": "linear-gradient(90deg, #3D4147 0%, #2C2F35 100%)",
        "menu-item-selected-gradient": "linear-gradient(90deg, #5B616A 0%, #3F434B 100%)",
        "workspace-item-gradient": "linear-gradient(90deg, #3D4147 0%, #2C2F35 100%)",
        "workspace-item-selected-gradient": "linear-gradient(90deg, #5B616A 0%, #3F434B 100%)",
        "switch-selected": "linear-gradient(146deg, #5B616A 0%, #3F434B 100%)"
      },
      fontFamily: {
        sans: [
          "plus-jakarta-sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ]
      },
      animation: {
        sweep: "sweep 0.5s ease-in-out",
        "pulse-glow": "pulse-glow 1.5s infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out forwards",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite"
      },
      keyframes: {
        sweep: {
          "0%": { transform: "scaleX(0)", transformOrigin: "bottom left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "bottom left" }
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 }
        },
        "pulse-glow": {
          "0%": {
            opacity: 1,
            transform: "scale(1)",
            boxShadow: "0 0 0 rgba(255, 255, 255, 0.0)",
            backgroundColor: "rgba(255, 255, 255, 0.0)"
          },
          "50%": {
            opacity: 1,
            transform: "scale(1.1)",
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.1)"
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
            boxShadow: "0 0 0 rgba(255, 255, 255, 0.0)",
            backgroundColor: "rgba(255, 255, 255, 0.0)"
          }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" }
        }
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ["light"],
      textColor: ["light"]
    }
  },
  // Required for rechart styles to show since they can be rendered dynamically and will be tree-shaken if not safe-listed.
  safelist: [
    {
      pattern: /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"]
    },
    {
      pattern: /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"]
    },
    {
      pattern: /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"]
    },
    {
      pattern: /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
    },
    {
      pattern: /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
    },
    {
      pattern: /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
    }
  ],
  plugins: [
    function({ addVariant }) {
      addVariant("light", ".light &");
    }
  ]
};

// postcss.config.js
var postcss_config_default = {
  plugins: [tailwind(tailwind_config_default), autoprefixer]
};

// vite.config.js
import react from "file:///workspaces/anything-llm/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dns from "dns";
import { visualizer } from "file:///workspaces/anything-llm/frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_import_meta_url = "file:///workspaces/anything-llm/frontend/vite.config.js";
dns.setDefaultResultOrder("verbatim");
var vite_config_default = defineConfig({
  assetsInclude: [
    "./public/piper/ort-wasm-simd-threaded.wasm",
    "./public/piper/piper_phonemize.wasm",
    "./public/piper/piper_phonemize.data"
  ],
  worker: {
    format: "es"
  },
  server: {
    port: 3e3,
    host: "localhost"
  },
  define: {
    "process.env": process.env
  },
  css: {
    postcss: postcss_config_default
  },
  plugins: [
    react(),
    visualizer({
      template: "treemap",
      // or sunburst
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: "bundleinspector.html"
      // will be saved in project's root
    })
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      },
      {
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: "util",
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        }
      }
    ]
  },
  build: {
    rollupOptions: {
      output: {
        // These settings ensure the primary JS and CSS file references are always index.{js,css}
        // so we can SSR the index.html as text response from server/index.js without breaking references each build.
        entryFileNames: "index.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "index.css")
            return `index.css`;
          return assetInfo.name;
        }
      },
      external: [
        // Reduces transformation time by 50% and we don't even use this variant, so we can ignore.
        /@phosphor-icons\/react\/dist\/ssr/
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: ["@mintplex-labs/piper-tts-web"],
    esbuildOptions: {
      define: {
        global: "globalThis"
      },
      plugins: []
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicG9zdGNzcy5jb25maWcuanMiLCAidGFpbHdpbmQuY29uZmlnLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZXMvYW55dGhpbmctbGxtL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlcy9hbnl0aGluZy1sbG0vZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtzcGFjZXMvYW55dGhpbmctbGxtL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcInVybFwiXG5pbXBvcnQgcG9zdGNzcyBmcm9tIFwiLi9wb3N0Y3NzLmNvbmZpZy5qc1wiXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCJcbmltcG9ydCBkbnMgZnJvbSBcImRuc1wiXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiXG5cbmRucy5zZXREZWZhdWx0UmVzdWx0T3JkZXIoXCJ2ZXJiYXRpbVwiKVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYXNzZXRzSW5jbHVkZTogW1xuICAgICcuL3B1YmxpYy9waXBlci9vcnQtd2FzbS1zaW1kLXRocmVhZGVkLndhc20nLFxuICAgICcuL3B1YmxpYy9waXBlci9waXBlcl9waG9uZW1pemUud2FzbScsXG4gICAgJy4vcHVibGljL3BpcGVyL3BpcGVyX3Bob25lbWl6ZS5kYXRhJyxcbiAgXSxcbiAgd29ya2VyOiB7XG4gICAgZm9ybWF0OiAnZXMnXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgaG9zdDogXCJsb2NhbGhvc3RcIlxuICB9LFxuICBkZWZpbmU6IHtcbiAgICBcInByb2Nlc3MuZW52XCI6IHByb2Nlc3MuZW52XG4gIH0sXG4gIGNzczoge1xuICAgIHBvc3Rjc3NcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdmlzdWFsaXplcih7XG4gICAgICB0ZW1wbGF0ZTogXCJ0cmVlbWFwXCIsIC8vIG9yIHN1bmJ1cnN0XG4gICAgICBvcGVuOiBmYWxzZSxcbiAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICAgIGZpbGVuYW1lOiBcImJ1bmRsZWluc3BlY3Rvci5odG1sXCIgLy8gd2lsbCBiZSBzYXZlZCBpbiBwcm9qZWN0J3Mgcm9vdFxuICAgIH0pXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiBcIkBcIixcbiAgICAgICAgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwcm9jZXNzOiBcInByb2Nlc3MvYnJvd3NlclwiLFxuICAgICAgICBzdHJlYW06IFwic3RyZWFtLWJyb3dzZXJpZnlcIixcbiAgICAgICAgemxpYjogXCJicm93c2VyaWZ5LXpsaWJcIixcbiAgICAgICAgdXRpbDogXCJ1dGlsXCIsXG4gICAgICAgIGZpbmQ6IC9efi4rLyxcbiAgICAgICAgcmVwbGFjZW1lbnQ6ICh2YWwpID0+IHtcbiAgICAgICAgICByZXR1cm4gdmFsLnJlcGxhY2UoL15+LywgXCJcIilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gVGhlc2Ugc2V0dGluZ3MgZW5zdXJlIHRoZSBwcmltYXJ5IEpTIGFuZCBDU1MgZmlsZSByZWZlcmVuY2VzIGFyZSBhbHdheXMgaW5kZXgue2pzLGNzc31cbiAgICAgICAgLy8gc28gd2UgY2FuIFNTUiB0aGUgaW5kZXguaHRtbCBhcyB0ZXh0IHJlc3BvbnNlIGZyb20gc2VydmVyL2luZGV4LmpzIHdpdGhvdXQgYnJlYWtpbmcgcmVmZXJlbmNlcyBlYWNoIGJ1aWxkLlxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2luZGV4LmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUgPT09ICdpbmRleC5jc3MnKSByZXR1cm4gYGluZGV4LmNzc2A7XG4gICAgICAgICAgcmV0dXJuIGFzc2V0SW5mby5uYW1lO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgIC8vIFJlZHVjZXMgdHJhbnNmb3JtYXRpb24gdGltZSBieSA1MCUgYW5kIHdlIGRvbid0IGV2ZW4gdXNlIHRoaXMgdmFyaWFudCwgc28gd2UgY2FuIGlnbm9yZS5cbiAgICAgICAgL0BwaG9zcGhvci1pY29uc1xcL3JlYWN0XFwvZGlzdFxcL3Nzci8sXG4gICAgICBdXG4gICAgfSxcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlXG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXCJAbWludHBsZXgtbGFicy9waXBlci10dHMtd2ViXCJdLFxuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICBkZWZpbmU6IHtcbiAgICAgICAgZ2xvYmFsOiBcImdsb2JhbFRoaXNcIlxuICAgICAgfSxcbiAgICAgIHBsdWdpbnM6IFtdXG4gICAgfVxuICB9XG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy9hbnl0aGluZy1sbG0vZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93b3Jrc3BhY2VzL2FueXRoaW5nLWxsbS9mcm9udGVuZC9wb3N0Y3NzLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya3NwYWNlcy9hbnl0aGluZy1sbG0vZnJvbnRlbmQvcG9zdGNzcy5jb25maWcuanNcIjtpbXBvcnQgdGFpbHdpbmQgZnJvbSAndGFpbHdpbmRjc3MnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcbmltcG9ydCB0YWlsd2luZENvbmZpZyBmcm9tICcuL3RhaWx3aW5kLmNvbmZpZy5qcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBwbHVnaW5zOiBbdGFpbHdpbmQodGFpbHdpbmRDb25maWcpLCBhdXRvcHJlZml4ZXJdLFxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZXMvYW55dGhpbmctbGxtL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlcy9hbnl0aGluZy1sbG0vZnJvbnRlbmQvdGFpbHdpbmQuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2VzL2FueXRoaW5nLWxsbS9mcm9udGVuZC90YWlsd2luZC5jb25maWcuanNcIjsvKiogQHR5cGUge2ltcG9ydCgndGFpbHdpbmRjc3MnKS5Db25maWd9ICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhcmtNb2RlOiBcImNsYXNzXCIsXG4gIGNvbnRlbnQ6IHtcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICBmaWxlczogW1xuICAgICAgXCIuL3NyYy9jb21wb25lbnRzLyoqLyoue2pzLGpzeH1cIixcbiAgICAgIFwiLi9zcmMvaG9va3MvKiovKi5qc1wiLFxuICAgICAgXCIuL3NyYy9tb2RlbHMvKiovKi5qc1wiLFxuICAgICAgXCIuL3NyYy9wYWdlcy8qKi8qLntqcyxqc3h9XCIsXG4gICAgICBcIi4vc3JjL3V0aWxzLyoqLyouanNcIixcbiAgICAgIFwiLi9zcmMvKi5qc3hcIixcbiAgICAgIFwiLi9pbmRleC5odG1sXCIsXG4gICAgICBcIi4vbm9kZV9tb2R1bGVzL0B0cmVtb3IvKiovKi57anMsdHMsanN4LHRzeH1cIlxuICAgIF1cbiAgfSxcbiAgdGhlbWU6IHtcbiAgICBleHRlbmQ6IHtcbiAgICAgIHJvdGF0ZToge1xuICAgICAgICBcIjI3MFwiOiBcIjI3MGRlZ1wiLFxuICAgICAgICBcIjM2MFwiOiBcIjM2MGRlZ1wiXG4gICAgICB9LFxuICAgICAgY29sb3JzOiB7XG4gICAgICAgIFwiYmxhY2stOTAwXCI6IFwiIzE0MTQxNFwiLFxuICAgICAgICBhY2NlbnQ6IFwiIzNENDE0N1wiLFxuICAgICAgICBcInNpZGViYXItYnV0dG9uXCI6IFwiIzMxMzUzQVwiLFxuICAgICAgICBzaWRlYmFyOiBcIiMyNTI3MkNcIixcbiAgICAgICAgXCJoaXN0b3JpY2FsLW1zZy1zeXN0ZW1cIjogXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpO1wiLFxuICAgICAgICBcImhpc3RvcmljYWwtbXNnLXVzZXJcIjogXCIjMkMyRjM1XCIsXG4gICAgICAgIG91dGxpbmU6IFwiIzRFNTE1M1wiLFxuICAgICAgICBcInByaW1hcnktYnV0dG9uXCI6IFwidmFyKC0tdGhlbWUtYnV0dG9uLXByaW1hcnkpXCIsXG4gICAgICAgIHNlY29uZGFyeTogXCIjMkMyRjM2XCIsXG4gICAgICAgIFwiZGFyay1pbnB1dFwiOiBcIiMxODE4MUJcIixcbiAgICAgICAgXCJtb2JpbGUtb25ib2FyZGluZ1wiOiBcIiMyQzJGMzVcIixcbiAgICAgICAgXCJkYXJrLWhpZ2hsaWdodFwiOiBcIiMxQzFFMjFcIixcbiAgICAgICAgXCJkYXJrLXRleHRcIjogXCIjMjIyNjI4XCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIiNEMkQ1REJcIixcbiAgICAgICAgXCJ4LWJ1dHRvblwiOiBcIiM5Q0EzQUZcIixcbiAgICAgICAgcm95YWxibHVlOiBcIiMwNjU5ODZcIixcbiAgICAgICAgcHVycGxlOiBcIiM0QTFGQjhcIixcbiAgICAgICAgbWFnZW50YTogXCIjOUUxNjVGXCIsXG4gICAgICAgIGRhbmdlcjogXCIjRjA0NDM4XCIsXG4gICAgICAgIGVycm9yOiBcIiNCNDIzMThcIixcbiAgICAgICAgd2FybjogXCIjODU0NzA4XCIsXG4gICAgICAgIHN1Y2Nlc3M6IFwiIzA1NjAzQVwiLFxuICAgICAgICBkYXJrZXI6IFwiI0Y0RjRGNFwiLFxuXG4gICAgICAgIC8vIEdlbmVyaWMgdGhlbWUgY29sb3JzXG4gICAgICAgIHRoZW1lOiB7XG4gICAgICAgICAgYmc6IHtcbiAgICAgICAgICAgIHByaW1hcnk6ICd2YXIoLS10aGVtZS1iZy1wcmltYXJ5KScsXG4gICAgICAgICAgICBzZWNvbmRhcnk6ICd2YXIoLS10aGVtZS1iZy1zZWNvbmRhcnkpJyxcbiAgICAgICAgICAgIHNpZGViYXI6ICd2YXIoLS10aGVtZS1iZy1zaWRlYmFyKScsXG4gICAgICAgICAgICBjb250YWluZXI6ICd2YXIoLS10aGVtZS1iZy1jb250YWluZXIpJyxcbiAgICAgICAgICAgIGNoYXQ6ICd2YXIoLS10aGVtZS1iZy1jaGF0KScsXG4gICAgICAgICAgICBcImNoYXQtaW5wdXRcIjogJ3ZhcigtLXRoZW1lLWJnLWNoYXQtaW5wdXQpJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgIHByaW1hcnk6ICd2YXIoLS10aGVtZS10ZXh0LXByaW1hcnkpJyxcbiAgICAgICAgICAgIHNlY29uZGFyeTogJ3ZhcigtLXRoZW1lLXRleHQtc2Vjb25kYXJ5KScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaWRlYmFyOiB7XG4gICAgICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6ICd2YXIoLS10aGVtZS1zaWRlYmFyLWl0ZW0tZGVmYXVsdCknLFxuICAgICAgICAgICAgICBzZWxlY3RlZDogJ3ZhcigtLXRoZW1lLXNpZGViYXItaXRlbS1zZWxlY3RlZCknLFxuICAgICAgICAgICAgICBob3ZlcjogJ3ZhcigtLXRoZW1lLXNpZGViYXItaXRlbS1ob3ZlciknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Yml0ZW06IHtcbiAgICAgICAgICAgICAgZGVmYXVsdDogJ3ZhcigtLXRoZW1lLXNpZGViYXItc3ViaXRlbS1kZWZhdWx0KScsXG4gICAgICAgICAgICAgIHNlbGVjdGVkOiAndmFyKC0tdGhlbWUtc2lkZWJhci1zdWJpdGVtLXNlbGVjdGVkKScsXG4gICAgICAgICAgICAgIGhvdmVyOiAndmFyKC0tdGhlbWUtc2lkZWJhci1zdWJpdGVtLWhvdmVyKScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9vdGVyOiB7XG4gICAgICAgICAgICAgIGljb246ICd2YXIoLS10aGVtZS1zaWRlYmFyLWZvb3Rlci1pY29uKScsXG4gICAgICAgICAgICAgICdpY29uLWhvdmVyJzogJ3ZhcigtLXRoZW1lLXNpZGViYXItZm9vdGVyLWljb24taG92ZXIpJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib3JkZXI6ICd2YXIoLS10aGVtZS1zaWRlYmFyLWJvcmRlciknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjaGF0LWlucHV0XCI6IHtcbiAgICAgICAgICAgIGJvcmRlcjogJ3ZhcigtLXRoZW1lLWNoYXQtaW5wdXQtYm9yZGVyKScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImFjdGlvbi1tZW51XCI6IHtcbiAgICAgICAgICAgIGJnOiAndmFyKC0tdGhlbWUtYWN0aW9uLW1lbnUtYmcpJyxcbiAgICAgICAgICAgIFwiaXRlbS1ob3ZlclwiOiAndmFyKC0tdGhlbWUtYWN0aW9uLW1lbnUtaXRlbS1ob3ZlciknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgICAgIGJnOiAndmFyKC0tdGhlbWUtc2V0dGluZ3MtaW5wdXQtYmcpJyxcbiAgICAgICAgICAgICAgYWN0aXZlOiAndmFyKC0tdGhlbWUtc2V0dGluZ3MtaW5wdXQtYWN0aXZlKScsXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAndmFyKC0tdGhlbWUtc2V0dGluZ3MtaW5wdXQtcGxhY2Vob2xkZXIpJyxcbiAgICAgICAgICAgICAgdGV4dDogJ3ZhcigtLXRoZW1lLXNldHRpbmdzLWlucHV0LXRleHQpJyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIG1vZGFsOiB7XG4gICAgICAgICAgICBib3JkZXI6ICd2YXIoLS10aGVtZS1tb2RhbC1ib3JkZXIpJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZmlsZS1waWNrZXJcIjoge1xuICAgICAgICAgICAgaG92ZXI6ICd2YXIoLS10aGVtZS1maWxlLXBpY2tlci1ob3ZlciknLFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6IHtcbiAgICAgICAgXCJwcmVmZXJlbmNlLWdyYWRpZW50XCI6XG4gICAgICAgICAgXCJsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjNUE1QzYzIDAlLCByZ2JhKDkwLCA5MiwgOTksIDAuMjgpIDEwMCUpO1wiLFxuICAgICAgICBcImNoYXQtbXNnLXVzZXItZ3JhZGllbnRcIjpcbiAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCgxODBkZWcsICMzRDQxNDcgMCUsICMyQzJGMzUgMTAwJSk7XCIsXG4gICAgICAgIFwic2VsZWN0ZWQtcHJlZmVyZW5jZS1ncmFkaWVudFwiOlxuICAgICAgICAgIFwibGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzMxMzIzNiAwJSwgcmdiYSg2My40MCwgNjQuOTAsIDcwLjEzLCAwKSAxMDAlKTtcIixcbiAgICAgICAgXCJtYWluLWdyYWRpZW50XCI6IFwibGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzNENDE0NyAwJSwgIzJDMkYzNSAxMDAlKVwiLFxuICAgICAgICBcIm1vZGFsLWdyYWRpZW50XCI6IFwibGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzNENDE0NyAwJSwgIzJDMkYzNSAxMDAlKVwiLFxuICAgICAgICBcInNpZGViYXItZ3JhZGllbnRcIjogXCJsaW5lYXItZ3JhZGllbnQoOTBkZWcsICM1QjYxNkEgMCUsICMzRjQzNEIgMTAwJSlcIixcbiAgICAgICAgXCJsb2dpbi1ncmFkaWVudFwiOiBcImxpbmVhci1ncmFkaWVudCgxODBkZWcsICMzRDQxNDcgMCUsICMyQzJGMzUgMTAwJSlcIixcbiAgICAgICAgXCJtZW51LWl0ZW0tZ3JhZGllbnRcIjpcbiAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCg5MGRlZywgIzNENDE0NyAwJSwgIzJDMkYzNSAxMDAlKVwiLFxuICAgICAgICBcIm1lbnUtaXRlbS1zZWxlY3RlZC1ncmFkaWVudFwiOlxuICAgICAgICAgIFwibGluZWFyLWdyYWRpZW50KDkwZGVnLCAjNUI2MTZBIDAlLCAjM0Y0MzRCIDEwMCUpXCIsXG4gICAgICAgIFwid29ya3NwYWNlLWl0ZW0tZ3JhZGllbnRcIjpcbiAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCg5MGRlZywgIzNENDE0NyAwJSwgIzJDMkYzNSAxMDAlKVwiLFxuICAgICAgICBcIndvcmtzcGFjZS1pdGVtLXNlbGVjdGVkLWdyYWRpZW50XCI6XG4gICAgICAgICAgXCJsaW5lYXItZ3JhZGllbnQoOTBkZWcsICM1QjYxNkEgMCUsICMzRjQzNEIgMTAwJSlcIixcbiAgICAgICAgXCJzd2l0Y2gtc2VsZWN0ZWRcIjogXCJsaW5lYXItZ3JhZGllbnQoMTQ2ZGVnLCAjNUI2MTZBIDAlLCAjM0Y0MzRCIDEwMCUpXCJcbiAgICAgIH0sXG4gICAgICBmb250RmFtaWx5OiB7XG4gICAgICAgIHNhbnM6IFtcbiAgICAgICAgICBcInBsdXMtamFrYXJ0YS1zYW5zXCIsXG4gICAgICAgICAgXCJ1aS1zYW5zLXNlcmlmXCIsXG4gICAgICAgICAgXCJzeXN0ZW0tdWlcIixcbiAgICAgICAgICBcIi1hcHBsZS1zeXN0ZW1cIixcbiAgICAgICAgICBcIkJsaW5rTWFjU3lzdGVtRm9udFwiLFxuICAgICAgICAgICdcIlNlZ29lIFVJXCInLFxuICAgICAgICAgIFwiUm9ib3RvXCIsXG4gICAgICAgICAgJ1wiSGVsdmV0aWNhIE5ldWVcIicsXG4gICAgICAgICAgXCJBcmlhbFwiLFxuICAgICAgICAgICdcIk5vdG8gU2Fuc1wiJyxcbiAgICAgICAgICBcInNhbnMtc2VyaWZcIixcbiAgICAgICAgICAnXCJBcHBsZSBDb2xvciBFbW9qaVwiJyxcbiAgICAgICAgICAnXCJTZWdvZSBVSSBFbW9qaVwiJyxcbiAgICAgICAgICAnXCJTZWdvZSBVSSBTeW1ib2xcIicsXG4gICAgICAgICAgJ1wiTm90byBDb2xvciBFbW9qaVwiJ1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgIHN3ZWVwOiBcInN3ZWVwIDAuNXMgZWFzZS1pbi1vdXRcIixcbiAgICAgICAgXCJwdWxzZS1nbG93XCI6IFwicHVsc2UtZ2xvdyAxLjVzIGluZmluaXRlXCIsXG4gICAgICAgICdmYWRlLWluJzogJ2ZhZGUtaW4gMC4zcyBlYXNlLW91dCcsXG4gICAgICAgICdzbGlkZS11cCc6ICdzbGlkZS11cCAwLjRzIGVhc2Utb3V0IGZvcndhcmRzJyxcbiAgICAgICAgJ2JvdW5jZS1zdWJ0bGUnOiAnYm91bmNlLXN1YnRsZSAycyBlYXNlLWluLW91dCBpbmZpbml0ZSdcbiAgICAgIH0sXG4gICAgICBrZXlmcmFtZXM6IHtcbiAgICAgICAgc3dlZXA6IHtcbiAgICAgICAgICBcIjAlXCI6IHsgdHJhbnNmb3JtOiBcInNjYWxlWCgwKVwiLCB0cmFuc2Zvcm1PcmlnaW46IFwiYm90dG9tIGxlZnRcIiB9LFxuICAgICAgICAgIFwiMTAwJVwiOiB7IHRyYW5zZm9ybTogXCJzY2FsZVgoMSlcIiwgdHJhbnNmb3JtT3JpZ2luOiBcImJvdHRvbSBsZWZ0XCIgfVxuICAgICAgICB9LFxuICAgICAgICBmYWRlSW46IHtcbiAgICAgICAgICBcIjAlXCI6IHsgb3BhY2l0eTogMCB9LFxuICAgICAgICAgIFwiMTAwJVwiOiB7IG9wYWNpdHk6IDEgfVxuICAgICAgICB9LFxuICAgICAgICBmYWRlT3V0OiB7XG4gICAgICAgICAgXCIwJVwiOiB7IG9wYWNpdHk6IDEgfSxcbiAgICAgICAgICBcIjEwMCVcIjogeyBvcGFjaXR5OiAwIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwdWxzZS1nbG93XCI6IHtcbiAgICAgICAgICBcIjAlXCI6IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMSlcIixcbiAgICAgICAgICAgIGJveFNoYWRvdzogXCIwIDAgMCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMClcIixcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMClcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCI1MCVcIjoge1xuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogXCJzY2FsZSgxLjEpXCIsXG4gICAgICAgICAgICBib3hTaGFkb3c6IFwiMCAwIDE1cHggcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiMTAwJVwiOiB7XG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiBcInNjYWxlKDEpXCIsXG4gICAgICAgICAgICBib3hTaGFkb3c6IFwiMCAwIDAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjApXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjApXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdmYWRlLWluJzoge1xuICAgICAgICAgICcwJSc6IHsgb3BhY2l0eTogJzAnIH0sXG4gICAgICAgICAgJzEwMCUnOiB7IG9wYWNpdHk6ICcxJyB9XG4gICAgICAgIH0sXG4gICAgICAgICdzbGlkZS11cCc6IHtcbiAgICAgICAgICAnMCUnOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMTBweCknLCBvcGFjaXR5OiAnMCcgfSxcbiAgICAgICAgICAnMTAwJSc6IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKScsIG9wYWNpdHk6ICcxJyB9XG4gICAgICAgIH0sXG4gICAgICAgICdib3VuY2Utc3VidGxlJzoge1xuICAgICAgICAgICcwJSwgMTAwJSc6IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKScgfSxcbiAgICAgICAgICAnNTAlJzogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC0ycHgpJyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHZhcmlhbnRzOiB7XG4gICAgZXh0ZW5kOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFsnbGlnaHQnXSxcbiAgICAgIHRleHRDb2xvcjogWydsaWdodCddLFxuICAgIH1cbiAgfSxcbiAgLy8gUmVxdWlyZWQgZm9yIHJlY2hhcnQgc3R5bGVzIHRvIHNob3cgc2luY2UgdGhleSBjYW4gYmUgcmVuZGVyZWQgZHluYW1pY2FsbHkgYW5kIHdpbGwgYmUgdHJlZS1zaGFrZW4gaWYgbm90IHNhZmUtbGlzdGVkLlxuICBzYWZlbGlzdDogW1xuICAgIHtcbiAgICAgIHBhdHRlcm46XG4gICAgICAgIC9eKGJnLSg/OnNsYXRlfGdyYXl8emluY3xuZXV0cmFsfHN0b25lfHJlZHxvcmFuZ2V8YW1iZXJ8eWVsbG93fGxpbWV8Z3JlZW58ZW1lcmFsZHx0ZWFsfGN5YW58c2t5fGJsdWV8aW5kaWdvfHZpb2xldHxwdXJwbGV8ZnVjaHNpYXxwaW5rfHJvc2UpLSg/OjUwfDEwMHwyMDB8MzAwfDQwMHw1MDB8NjAwfDcwMHw4MDB8OTAwfDk1MCkpJC8sXG4gICAgICB2YXJpYW50czogW1wiaG92ZXJcIiwgXCJ1aS1zZWxlY3RlZFwiXVxuICAgIH0sXG4gICAge1xuICAgICAgcGF0dGVybjpcbiAgICAgICAgL14odGV4dC0oPzpzbGF0ZXxncmF5fHppbmN8bmV1dHJhbHxzdG9uZXxyZWR8b3JhbmdlfGFtYmVyfHllbGxvd3xsaW1lfGdyZWVufGVtZXJhbGR8dGVhbHxjeWFufHNreXxibHVlfGluZGlnb3x2aW9sZXR8cHVycGxlfGZ1Y2hzaWF8cGlua3xyb3NlKS0oPzo1MHwxMDB8MjAwfDMwMHw0MDB8NTAwfDYwMHw3MDB8ODAwfDkwMHw5NTApKSQvLFxuICAgICAgdmFyaWFudHM6IFtcImhvdmVyXCIsIFwidWktc2VsZWN0ZWRcIl1cbiAgICB9LFxuICAgIHtcbiAgICAgIHBhdHRlcm46XG4gICAgICAgIC9eKGJvcmRlci0oPzpzbGF0ZXxncmF5fHppbmN8bmV1dHJhbHxzdG9uZXxyZWR8b3JhbmdlfGFtYmVyfHllbGxvd3xsaW1lfGdyZWVufGVtZXJhbGR8dGVhbHxjeWFufHNreXxibHVlfGluZGlnb3x2aW9sZXR8cHVycGxlfGZ1Y2hzaWF8cGlua3xyb3NlKS0oPzo1MHwxMDB8MjAwfDMwMHw0MDB8NTAwfDYwMHw3MDB8ODAwfDkwMHw5NTApKSQvLFxuICAgICAgdmFyaWFudHM6IFtcImhvdmVyXCIsIFwidWktc2VsZWN0ZWRcIl1cbiAgICB9LFxuICAgIHtcbiAgICAgIHBhdHRlcm46XG4gICAgICAgIC9eKHJpbmctKD86c2xhdGV8Z3JheXx6aW5jfG5ldXRyYWx8c3RvbmV8cmVkfG9yYW5nZXxhbWJlcnx5ZWxsb3d8bGltZXxncmVlbnxlbWVyYWxkfHRlYWx8Y3lhbnxza3l8Ymx1ZXxpbmRpZ298dmlvbGV0fHB1cnBsZXxmdWNoc2lhfHBpbmt8cm9zZSktKD86NTB8MTAwfDIwMHwzMDB8NDAwfDUwMHw2MDB8NzAwfDgwMHw5MDB8OTUwKSkkL1xuICAgIH0sXG4gICAge1xuICAgICAgcGF0dGVybjpcbiAgICAgICAgL14oc3Ryb2tlLSg/OnNsYXRlfGdyYXl8emluY3xuZXV0cmFsfHN0b25lfHJlZHxvcmFuZ2V8YW1iZXJ8eWVsbG93fGxpbWV8Z3JlZW58ZW1lcmFsZHx0ZWFsfGN5YW58c2t5fGJsdWV8aW5kaWdvfHZpb2xldHxwdXJwbGV8ZnVjaHNpYXxwaW5rfHJvc2UpLSg/OjUwfDEwMHwyMDB8MzAwfDQwMHw1MDB8NjAwfDcwMHw4MDB8OTAwfDk1MCkpJC9cbiAgICB9LFxuICAgIHtcbiAgICAgIHBhdHRlcm46XG4gICAgICAgIC9eKGZpbGwtKD86c2xhdGV8Z3JheXx6aW5jfG5ldXRyYWx8c3RvbmV8cmVkfG9yYW5nZXxhbWJlcnx5ZWxsb3d8bGltZXxncmVlbnxlbWVyYWxkfHRlYWx8Y3lhbnxza3l8Ymx1ZXxpbmRpZ298dmlvbGV0fHB1cnBsZXxmdWNoc2lhfHBpbmt8cm9zZSktKD86NTB8MTAwfDIwMHwzMDB8NDAwfDUwMHw2MDB8NzAwfDgwMHw5MDB8OTUwKSkkL1xuICAgIH1cbiAgXSxcbiAgcGx1Z2luczogW1xuICAgIGZ1bmN0aW9uICh7IGFkZFZhcmlhbnQgfSkge1xuICAgICAgYWRkVmFyaWFudCgnbGlnaHQnLCAnLmxpZ2h0ICYnKSAvLyBBZGQgdGhlIGBsaWdodDpgIHZhcmlhbnRcbiAgICB9LFxuICBdXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFSLFNBQVMsb0JBQW9CO0FBQ2xULFNBQVMsZUFBZSxXQUFXOzs7QUNEd1AsT0FBTyxjQUFjO0FBQ2hULE9BQU8sa0JBQWtCOzs7QUNBekIsSUFBTywwQkFBUTtBQUFBLEVBQ2IsVUFBVTtBQUFBLEVBQ1YsU0FBUztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsT0FBTztB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
