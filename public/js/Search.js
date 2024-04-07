import { reactive as h, openBlock as s, createElementBlock as c, createElementVNode as r, withDirectives as f, withKeys as m, vModelText as w, Fragment as g, renderList as y, normalizeClass as _, toDisplayString as l, createCommentVNode as x } from "vue";
import k from "axios";
import { _ as v } from "./_plugin-vue_export-helper.js";
const $ = { class: "flex gap-1 items-center justify-center relative w-[374px]" }, b = { class: "input input-bordered flex items-center gap-2 w-[374px]" }, M = /* @__PURE__ */ r("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  class: "w-4 h-4 opacity-70"
}, [
  /* @__PURE__ */ r("path", {
    "fill-rule": "evenodd",
    d: "M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
    "clip-rule": "evenodd"
  })
], -1), C = {
  key: 0,
  class: "menu absolute top-[55px] w-[374px] rounded-md shadow-md bg-whte"
}, E = ["href"], K = {
  __name: "Search",
  setup(S) {
    const e = h({
      loading: !1,
      search: "",
      data: [],
      searchModalOpen: !1
    });
    let n;
    window.addEventListener("keydown", function(o) {
      o.ctrlKey && o.key === "k" && (console.log("Ctrl + K detected"), e.searchModalOpen = !0), o.metaKey && o.key === "k" && (console.log("Cmd + K detected"), e.searchModalOpen = !0), o.key === "Escape" && (console.log("Escape key detected"), e.searchModalOpen = !1);
    });
    function i(o) {
      const { protocol: a, hostname: t } = window.location;
      return `${a}//${o}.${t}`;
    }
    function d(o, a) {
      clearTimeout(n), n = setTimeout(o, a);
    }
    function p() {
      window.location.href = `${window.location.origin}/search?q=${e.search}`;
    }
    async function u() {
      e.loading = !0;
      try {
        if (e.search === "") {
          e.data = [];
          return;
        }
        const o = await k.get(`/api/search?q=${encodeURIComponent(e.search)}`);
        e.data = o.data.data;
      } catch (o) {
        console.error("Error fetching data:", o);
      } finally {
        e.loading = !1;
      }
    }
    return (o, a) => (s(), c("div", $, [
      r("label", b, [
        f(r("input", {
          type: "text",
          class: "grow",
          autofocus: "",
          "onUpdate:modelValue": a[0] || (a[0] = (t) => e.search = t),
          placeholder: "Search for a coach or a systems...",
          onKeydown: m(p, ["enter"]),
          onInput: a[1] || (a[1] = (t) => d(u, 500))
        }, null, 544), [
          [w, e.search]
        ]),
        M
      ]),
      e.data.length ? (s(), c("ul", C, [
        (s(!0), c(g, null, y(e.data, (t) => (s(), c("li", {
          class: "flex flex-col gap-2",
          key: t.id
        }, [
          r("a", {
            href: i(t.slug)
          }, [
            r("div", {
              class: _(["p-3", `bg-[${t.color}]`])
            }, l(t.emoji), 3),
            r("p", null, l(t.name), 1)
          ], 8, E)
        ]))), 128))
      ])) : x("", !0)
    ]));
  }
}, T = /* @__PURE__ */ v(K, [["__file", "/usr/src/app/src/web/components/Search/Search.vue"]]);
export {
  T as default
};
