import { reactive as p, openBlock as o, createElementBlock as s, withDirectives as u, createElementVNode as r, vModelText as m, createCommentVNode as c, Fragment as h, renderList as _, normalizeClass as f, toDisplayString as l } from "vue";
import g from "axios";
import { _ as x } from "./_plugin-vue_export-helper.js";
const b = { class: "flex gap-1 items-center justify-center relative w-[374px]" }, y = ["disabled"], w = ["disabled"], k = { key: 0 }, v = { key: 1 }, S = {
  key: 0,
  class: "menu absolute top-[55px] w-[374px] bg-neutral-100 rounded-sm"
}, $ = ["href"], C = {
  __name: "Search",
  setup(D) {
    const e = p({
      loading: !1,
      search: "",
      data: []
    });
    function i(a) {
      const { protocol: n, hostname: t } = window.location;
      return `${n}//${a}.${t}`;
    }
    async function d() {
      e.loading = !0;
      try {
        const a = await g.get(`/api/search?q=${encodeURIComponent(e.search)}`);
        e.data = a.data.data;
      } catch (a) {
        console.error("Error fetching data:", a);
      } finally {
        e.loading = !1;
      }
    }
    return (a, n) => (o(), s("div", b, [
      u(r("input", {
        type: "text",
        "onUpdate:modelValue": n[0] || (n[0] = (t) => e.search = t),
        placeholder: "Search for a coach or a system...",
        class: "input input-bordered w-full max-w-[18rem]",
        disabled: e.loading
      }, null, 8, y), [
        [m, e.search]
      ]),
      r("button", {
        onClick: d,
        class: "btn btn-neutral",
        disabled: e.loading
      }, [
        e.loading ? c("", !0) : (o(), s("span", k, "Search")),
        e.loading ? (o(), s("span", v, "...........")) : c("", !0)
      ], 8, w),
      e.data.length ? (o(), s("ul", S, [
        (o(!0), s(h, null, _(e.data, (t) => (o(), s("li", {
          class: "flex flex-col gap-2",
          key: t.id
        }, [
          r("a", {
            href: i(t.slug)
          }, [
            r("div", {
              class: f(["p-3", `bg-[${t.color}]`])
            }, l(t.emoji), 3),
            r("p", null, l(t.name), 1)
          ], 8, $)
        ]))), 128))
      ])) : c("", !0)
    ]));
  }
}, B = /* @__PURE__ */ x(C, [["__file", "/usr/src/app/src/web/components/Search/Search.vue"]]);
export {
  B as default
};
