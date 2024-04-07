import { reactive as h, openBlock as s, createElementBlock as n, createElementVNode as r, withDirectives as m, withKeys as f, vModelText as w, Fragment as g, renderList as _, normalizeClass as x, toDisplayString as l, createCommentVNode as v } from "vue";
import y from "axios";
import { _ as $ } from "./_plugin-vue_export-helper.js";
const b = { class: "flex gap-1 items-center justify-center relative w-[374px]" }, S = { class: "input input-bordered flex items-center gap-2 w-[374px]" }, k = /* @__PURE__ */ r("svg", {
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
  class: "menu absolute top-[55px] w-[374px] rounded-md shadow-md bg-white"
}, D = ["href"], M = {
  __name: "Search",
  setup(B) {
    const e = h({
      loading: !1,
      search: "",
      data: [],
      searchModalOpen: !1
    });
    let c;
    function i(t) {
      const { protocol: a, hostname: o } = window.location;
      return `${a}//${t}.${o}`;
    }
    function d(t, a) {
      clearTimeout(c), c = setTimeout(t, a);
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
        const t = await y.get(`/api/search?q=${encodeURIComponent(e.search)}`);
        e.data = t.data.data;
      } catch (t) {
        console.error("Error fetching data:", t);
      } finally {
        e.loading = !1;
      }
    }
    return (t, a) => (s(), n("div", b, [
      r("label", S, [
        m(r("input", {
          type: "text",
          class: "grow",
          autofocus: "",
          "onUpdate:modelValue": a[0] || (a[0] = (o) => e.search = o),
          placeholder: "Search for a coach or a systems...",
          onKeydown: f(p, ["enter"]),
          onInput: a[1] || (a[1] = (o) => d(u, 500))
        }, null, 544), [
          [w, e.search]
        ]),
        k
      ]),
      e.data.length ? (s(), n("ul", C, [
        (s(!0), n(g, null, _(e.data, (o) => (s(), n("li", {
          class: "flex flex-col gap-2",
          key: o.id
        }, [
          r("a", {
            href: i(o.slug)
          }, [
            r("div", {
              class: x(["p-3", `bg-[${o.color}]`])
            }, l(o.emoji), 3),
            r("p", null, l(o.name), 1)
          ], 8, D)
        ]))), 128))
      ])) : v("", !0)
    ]));
  }
}, j = /* @__PURE__ */ $(M, [["__file", "/usr/src/app/src/web/components/Search/Search.vue"]]);
export {
  j as default
};
