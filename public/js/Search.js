import { reactive as u, openBlock as s, createElementBlock as l, createElementVNode as r, withDirectives as m, vModelText as f, Fragment as h, renderList as _, normalizeClass as g, toDisplayString as n, createCommentVNode as w } from "vue";
import x from "axios";
import { _ as v } from "./_plugin-vue_export-helper.js";
const y = { class: "flex gap-1 items-center justify-center relative w-[374px]" }, b = { class: "input input-bordered flex items-center gap-2 w-[374px]" }, S = /* @__PURE__ */ r("svg", {
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
], -1), $ = {
  key: 0,
  class: "menu absolute top-[55px] w-[374px] rounded-md shadow-md"
}, k = ["href"], C = {
  __name: "Search",
  setup(D) {
    const e = u({
      loading: !1,
      search: "",
      data: []
    });
    let c;
    function i(o) {
      const { protocol: a, hostname: t } = window.location;
      return `${a}//${o}.${t}`;
    }
    function d(o, a) {
      clearTimeout(c), c = setTimeout(o, a);
    }
    async function p() {
      e.loading = !0;
      try {
        if (e.search === "") {
          e.data = [];
          return;
        }
        const o = await x.get(`/api/search?q=${encodeURIComponent(e.search)}`);
        e.data = o.data.data;
      } catch (o) {
        console.error("Error fetching data:", o);
      } finally {
        e.loading = !1;
      }
    }
    return (o, a) => (s(), l("div", y, [
      r("label", b, [
        m(r("input", {
          type: "text",
          class: "grow",
          autofocus: "",
          "onUpdate:modelValue": a[0] || (a[0] = (t) => e.search = t),
          placeholder: "Search for a coach or a system...",
          onInput: a[1] || (a[1] = (t) => d(p, 500))
        }, null, 544), [
          [f, e.search]
        ]),
        S
      ]),
      e.data.length ? (s(), l("ul", $, [
        (s(!0), l(h, null, _(e.data, (t) => (s(), l("li", {
          class: "flex flex-col gap-2",
          key: t.id
        }, [
          r("a", {
            href: i(t.slug)
          }, [
            r("div", {
              class: g(["p-3", `bg-[${t.color}]`])
            }, n(t.emoji), 3),
            r("p", null, n(t.name), 1)
          ], 8, k)
        ]))), 128))
      ])) : w("", !0)
    ]));
  }
}, T = /* @__PURE__ */ v(C, [["__file", "/usr/src/app/src/web/components/Search/Search.vue"]]);
export {
  T as default
};
