import { reactive as d, openBlock as s, createElementBlock as l, createElementVNode as t, withDirectives as p, vModelText as u, Fragment as m, renderList as h, normalizeClass as f, toDisplayString as c, createCommentVNode as _ } from "vue";
import g from "axios";
import { _ as w } from "./_plugin-vue_export-helper.js";
const x = { class: "flex gap-1 items-center justify-center relative w-[374px]" }, v = { class: "input input-bordered flex items-center gap-2 w-[374px]" }, y = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  class: "w-4 h-4 opacity-70"
}, [
  /* @__PURE__ */ t("path", {
    "fill-rule": "evenodd",
    d: "M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
    "clip-rule": "evenodd"
  })
], -1), b = {
  key: 0,
  class: "menu absolute top-[55px] w-[374px] bg-neutral-100/50 backdrop-blur-md rounded-md shadow-md"
}, S = ["href"], k = {
  __name: "Search",
  setup($) {
    const o = d({
      loading: !1,
      search: "",
      data: []
    });
    function n(a) {
      const { protocol: r, hostname: e } = window.location;
      return `${r}//${a}.${e}`;
    }
    async function i() {
      o.loading = !0;
      try {
        const a = await g.get(`/api/search?q=${encodeURIComponent(o.search)}`);
        o.data = a.data.data;
      } catch (a) {
        console.error("Error fetching data:", a);
      } finally {
        o.loading = !1;
      }
    }
    return (a, r) => (s(), l("div", x, [
      t("label", v, [
        p(t("input", {
          type: "text",
          class: "grow",
          autofocus: "",
          "onUpdate:modelValue": r[0] || (r[0] = (e) => o.search = e),
          placeholder: "Search for a coach or a system...",
          onInput: i
        }, null, 544), [
          [u, o.search]
        ]),
        y
      ]),
      o.data.length ? (s(), l("ul", b, [
        (s(!0), l(m, null, h(o.data, (e) => (s(), l("li", {
          class: "flex flex-col gap-2",
          key: e.id
        }, [
          t("a", {
            href: n(e.slug)
          }, [
            t("div", {
              class: f(["p-3", `bg-[${e.color}]`])
            }, c(e.emoji), 3),
            t("p", null, c(e.name), 1)
          ], 8, S)
        ]))), 128))
      ])) : _("", !0)
    ]));
  }
}, E = /* @__PURE__ */ w(k, [["__file", "/usr/src/app/src/web/components/Search/Search.vue"]]);
export {
  E as default
};
