import { reactive as d, ref as i, nextTick as r, openBlock as p, createElementBlock as h, createElementVNode as e, withDirectives as u, withKeys as _, vModelText as f, createTextVNode as a, toDisplayString as m, createCommentVNode as w } from "vue";
import { _ as x } from "./_plugin-vue_export-helper.js";
const b = {
  key: 0,
  class: "absolute h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10"
}, k = {
  id: "search-modal",
  class: "flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md"
}, y = { class: "p-5" }, v = { class: "input input-bordered flex items-center gap-2" }, g = /* @__PURE__ */ e("svg", {
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
], -1), E = { class: "px-5 pb-4" }, S = { class: "text-center text-neutral-400 text-sm py-10" }, N = /* @__PURE__ */ e("span", { class: "text-sm" }, "No recent searches", -1), B = { class: "text-sm" }, G = { class: "font-bold" }, K = /* @__PURE__ */ e("div", { class: "border-t border-1 border-solid text-center px-5 py-3" }, [
  /* @__PURE__ */ a(" press "),
  /* @__PURE__ */ e("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ a(" to close. ")
], -1), M = {
  __name: "GlobalSearch",
  setup(V) {
    const s = d({
      search: "",
      data: [],
      open: !1
    }), c = i(null);
    document.addEventListener("click", (t) => {
      const o = document.getElementById("search-modal");
      o && !o.contains(t.target) && (s.open = !1, s.search = "");
    }), window.addEventListener("keydown", function(t) {
      t.ctrlKey && t.key === "k" && (s.open = !0, r(() => c.value.focus())), t.metaKey && t.key === "k" && (s.open = !0, r(() => c.value.focus())), t.key === "Escape" && (s.open = !1, s.search = "");
    });
    function l() {
      window.location.href = `${window.location.origin}/search?q=${s.search}`;
    }
    return (t, o) => s.open ? (p(), h("div", b, [
      e("div", k, [
        e("div", y, [
          e("label", v, [
            u(e("input", {
              ref_key: "inputRef",
              ref: c,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": o[0] || (o[0] = (n) => s.search = n),
              onKeydown: _(l, ["enter"]),
              placeholder: "Search for a coach or a systems..."
            }, null, 544), [
              [f, s.search]
            ]),
            g
          ])
        ]),
        e("div", E, [
          e("div", S, [
            N,
            e("span", B, [
              a("No resutls for "),
              e("span", G, m(`"${s.search}"`), 1)
            ])
          ])
        ]),
        K
      ])
    ])) : w("", !0);
  }
}, C = /* @__PURE__ */ x(M, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  C as default
};
