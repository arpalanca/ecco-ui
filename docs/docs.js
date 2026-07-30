(() => {
  const guessLang = (text) => {
    const t = text.trim();
    if (/^<!DOCTYPE|^<html\b|^<[a-z]/i.test(t)) return "HTML";
    if (/^(npm|yarn|pnpm|npx)\b/.test(t)) return "Shell";
    if (/^import\s|from\s+['"]|export\s/.test(t) && /jsx|tsx|react/i.test(t))
      return "JSX";
    if (/^<script|^const\s|^let\s|^function\b|=>/.test(t)) return "JavaScript";
    if (/^:root\b|^--[a-z]|@import|\.[\w-]+\s*\{/.test(t)) return "CSS";
    if (/^<template\b|v-if=|@click=/.test(t)) return "Vue";
    if (/^<script\b[\s\S]*lang=["']ts["']|\$props|\$state/.test(t)) return "Svelte";
    return "Code";
  };

  const enhanceCodeBlocks = () => {
    document.querySelectorAll(".docs-content pre").forEach((pre) => {
      if (pre.closest(".docs-code")) return;

      const code = pre.querySelector("code") || pre;
      const text = code.textContent.replace(/\n$/, "");
      const lang = pre.dataset.lang || guessLang(text);
      const title = pre.dataset.title || "Copyable sample";

      const wrap = document.createElement("div");
      wrap.className = "docs-code";
      wrap.setAttribute("role", "group");
      wrap.setAttribute("aria-label", `${title} code sample`);

      const toolbar = document.createElement("div");
      toolbar.className = "docs-code-toolbar";

      const label = document.createElement("span");
      label.className = "docs-code-label";
      label.textContent = `${lang} · ${title}`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "docs-code-copy";
      button.setAttribute("aria-label", `Copy ${title}`);
      button.textContent = "Copy";

      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const range = document.createRange();
          range.selectNodeContents(code);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          document.execCommand("copy");
          selection.removeAllRanges();
        }
        button.textContent = "Copied";
        button.dataset.copied = "true";
        window.setTimeout(() => {
          button.textContent = "Copy";
          delete button.dataset.copied;
        }, 1600);
      });

      toolbar.append(label, button);
      pre.replaceWith(wrap);
      wrap.append(toolbar, pre);
    });
  };

  const enhanceDocsTabs = () => {
    document.querySelectorAll("[data-docs-tabs]").forEach((tabs) => {
      const list = tabs.querySelector('[role="tablist"]');
      if (!list) return;
      const tabButtons = [...list.querySelectorAll('[role="tab"]')];

      const activate = (tab) => {
        tabButtons.forEach((btn) => {
          const selected = btn === tab;
          btn.setAttribute("aria-selected", selected ? "true" : "false");
          const panel = document.getElementById(
            btn.getAttribute("aria-controls")
          );
          if (panel) panel.hidden = !selected;
        });
      };

      tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => activate(btn));
      });
    });
  };

  const enhanceNav = () => {
    const links = [
      ...document.querySelectorAll('.docs-sidebar nav a[href^="#"]'),
    ];
    const map = new Map(
      links
        .map((a) => {
          const id = a.getAttribute("href").slice(1);
          const el = document.getElementById(id);
          return el ? [el, a] : null;
        })
        .filter(Boolean)
    );
    if (!map.size) return;

    const openSectionFor = (link) => {
      if (!link) return;
      const section = link.closest("details[data-nav-section]");
      if (section) section.open = true;
    };

    const setCurrent = (link) => {
      links.forEach((a) => a.removeAttribute("aria-current"));
      if (link) {
        link.setAttribute("aria-current", "true");
        openSectionFor(link);
      }
    };

    links.forEach((a) => {
      a.addEventListener("click", () => setCurrent(a));
    });

    const syncFromHash = () => {
      const id = decodeURIComponent(location.hash.replace(/^#/, "") || "top");
      const match = links.find((a) => a.getAttribute("href") === `#${id}`);
      if (match) setCurrent(match);
    };

    window.addEventListener("hashchange", syncFromHash);

    let allowObserver = !location.hash;
    if (location.hash) {
      syncFromHash();
      window.setTimeout(() => {
        allowObserver = true;
      }, 700);
    } else {
      setCurrent(links[0]);
    }

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!allowObserver) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrent(map.get(visible.target));
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.2, 0.45, 0.75, 1] }
    );

    map.forEach((_, el) => observer.observe(el));
  };

  enhanceCodeBlocks();
  enhanceDocsTabs();
  enhanceNav();
})();
