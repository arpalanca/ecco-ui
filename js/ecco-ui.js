/*!
 * Ecco UI v0.1.0
 * Tiny helpers for tabs + dialogs. Progressive enhancement only.
 * MIT License · https://github.com/arpalanca/ecco-ui
 */
(function (global) {
  "use strict";

  function activateTab(tabsRoot, tab) {
    var list = tabsRoot.querySelector('[role="tablist"]');
    if (!list || !tab) return;
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    tabs.forEach(function (btn) {
      var selected = btn === tab;
      btn.setAttribute("aria-selected", selected ? "true" : "false");
      btn.tabIndex = selected ? 0 : -1;
      var panelId = btn.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      if (panel) panel.hidden = !selected;
    });
  }

  function initTabs(root) {
    var scope = root || document;
    var groups = scope.querySelectorAll("[data-ecco-tabs], .ecco-tabs");
    groups.forEach(function (tabsRoot) {
      if (tabsRoot.getAttribute("data-ecco-ready") === "tabs") return;
      var list = tabsRoot.querySelector('[role="tablist"]');
      if (!list) return;
      var tabs = Array.prototype.slice.call(
        list.querySelectorAll('[role="tab"]')
      );
      if (!tabs.length) return;

      tabs.forEach(function (btn, index) {
        btn.addEventListener("click", function () {
          activateTab(tabsRoot, btn);
        });
        btn.addEventListener("keydown", function (event) {
          var key = event.key;
          var next = null;
          if (key === "ArrowRight" || key === "ArrowDown") {
            next = tabs[(index + 1) % tabs.length];
          } else if (key === "ArrowLeft" || key === "ArrowUp") {
            next = tabs[(index - 1 + tabs.length) % tabs.length];
          } else if (key === "Home") {
            next = tabs[0];
          } else if (key === "End") {
            next = tabs[tabs.length - 1];
          }
          if (next) {
            event.preventDefault();
            activateTab(tabsRoot, next);
            next.focus();
          }
        });
      });

      var current =
        tabs.find(function (t) {
          return t.getAttribute("aria-selected") === "true";
        }) || tabs[0];
      activateTab(tabsRoot, current);
      tabsRoot.setAttribute("data-ecco-ready", "tabs");
    });
  }

  function openModal(dialog) {
    if (!dialog || typeof dialog.showModal !== "function") return;
    if (!dialog.open) dialog.showModal();
  }

  function closeModal(dialog) {
    if (!dialog || typeof dialog.close !== "function") return;
    if (dialog.open) dialog.close();
  }

  function initModals(root) {
    var scope = root || document;

    scope.querySelectorAll("[data-ecco-open]").forEach(function (trigger) {
      if (trigger.getAttribute("data-ecco-ready") === "open") return;
      trigger.addEventListener("click", function () {
        var id = trigger.getAttribute("data-ecco-open");
        var dialog = id ? document.getElementById(id) : null;
        openModal(dialog);
      });
      trigger.setAttribute("data-ecco-ready", "open");
    });

    scope.querySelectorAll("dialog.ecco-modal, dialog[data-ecco-modal]").forEach(
      function (dialog) {
        if (dialog.getAttribute("data-ecco-ready") === "modal") return;

        dialog.addEventListener("click", function (event) {
          if (event.target === dialog) closeModal(dialog);
        });

        dialog
          .querySelectorAll("[data-ecco-close]")
          .forEach(function (closer) {
            closer.addEventListener("click", function () {
              closeModal(dialog);
            });
          });

        dialog.setAttribute("data-ecco-ready", "modal");
      }
    );
  }

  function init(root) {
    initTabs(root);
    initModals(root);
  }

  var api = {
    init: init,
    initTabs: initTabs,
    initModals: initModals,
    openModal: openModal,
    closeModal: closeModal,
  };

  global.EccoUI = api;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
    });
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
