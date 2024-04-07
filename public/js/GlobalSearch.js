import { reactive as d, ref as i, nextTick as l, withDirectives as r, openBlock as p, createElementBlock as _, createElementVNode as e, vModelText as h, createTextVNode as c, toDisplayString as u, vShow as f } from "vue";
import { _ as m } from "./_plugin-vue_export-helper.js";
const x = { class: "absolute h-screen w-screen z-10 bg-black/30 backdrop-blur-sm top-0 left-0" }, b = { class: "flex flex-col relative mx-auto max-w-lg bg-white -top-1/4 rounded-md shadow-md" }, w = { class: "p-5" }, v = { class: "input input-bordered flex items-center gap-2 w-[374px]" }, k = /* @__PURE__ */ e("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  class: "w-4 h-4 opacity-70"
}, [
  /* @__PURE__ */ e("path", {
    "fill-rule": "evenodd",
    d: "M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
    "clip-rule": "evenodd"
  })
], -1), y = { class: "p-5" }, g = { class: "text-center text-neutral-400 text-sm pb-3" }, S = /* @__PURE__ */ e("span", { class: "text-sm" }, "No recent searches", -1), E = { class: "text-sm" }, G = { class: "font-bold" }, N = /* @__PURE__ */ e("div", { class: "border-t border-1 border-solid text-center px-5 py-3" }, [
  /* @__PURE__ */ c(" press "),
  /* @__PURE__ */ e("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ c(" to close. ")
], -1), B = {
  __name: "GlobalSearch",
  setup(M) {
    const s = d({
      search: "",
      data: [],
      open: !1
    }), o = i(null);
    return window.addEventListener("keydown", function(t) {
      t.ctrlKey && t.key === "k" && (s.open = !0, l(() => o.value.focus())), t.metaKey && t.key === "k" && (s.open = !0, l(() => o.value.focus())), t.key === "Escape" && (s.open = !1, s.search = "");
    }), (t, a) => r((p(), _("div", x, [
      e("div", b, [
        e("div", w, [
          e("label", v, [
            r(e("input", {
              ref_key: "inputRef",
              ref: o,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": a[0] || (a[0] = (n) => s.search = n),
              placeholder: "Search for a coach or a systems..."
            }, null, 512), [
              [h, s.search]
            ]),
            k
          ])
        ]),
        e("div", y, [
          e("div", g, [
            S,
            e("span", E, [
              c("No resutls for "),
              e("span", G, u(`"${s.search}"`), 1)
            ])
          ])
        ]),
        N
      ])
    ], 512)), [
      [f, s.open]
    ]);
  }
}, D = /* @__PURE__ */ m(B, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  D as default
};
