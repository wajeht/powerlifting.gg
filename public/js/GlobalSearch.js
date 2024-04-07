import { reactive as _, ref as w, nextTick as u, onMounted as x, computed as g, openBlock as r, createElementBlock as c, createElementVNode as s, withDirectives as y, withKeys as b, vModelText as v, Fragment as k, renderList as E, normalizeClass as C, toDisplayString as i, createCommentVNode as n, createTextVNode as h } from "vue";
import S from "axios";
import { _ as $ } from "./_plugin-vue_export-helper.js";
const L = {
  key: 0,
  class: "absolute h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10"
}, M = {
  id: "search-modal",
  class: "flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md"
}, N = { class: "p-5" }, B = { class: "input input-bordered flex items-center gap-2" }, D = /* @__PURE__ */ s("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  class: "w-4 h-4 opacity-70"
}, [
  /* @__PURE__ */ s("path", {
    "fill-rule": "evenodd",
    d: "M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
    "clip-rule": "evenodd"
  })
], -1), G = { class: "px-5 py-4 max-h-sm overflow-y-scroll bg-[#E8E9EA]" }, K = {
  key: 0,
  class: "flex flex-col gap-2"
}, V = ["href"], T = {
  key: 1,
  class: "text-center text-neutral-400 text-sm py-10"
}, z = /* @__PURE__ */ s("span", { class: "text-sm" }, "No recent searches", -1), A = [
  z
], R = {
  key: 2,
  class: "text-center text-neutral-400 text-sm py-10"
}, Z = { class: "text-sm" }, j = { class: "font-bold" }, q = /* @__PURE__ */ s("div", { class: "border-t border-1 border-solid text-center p-5" }, [
  /* @__PURE__ */ h(" press "),
  /* @__PURE__ */ s("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ h(" to close. ")
], -1), F = {
  __name: "GlobalSearch",
  setup(I) {
    const e = _({
      search: "",
      data: [],
      open: !1
    }), l = w(null);
    document.addEventListener("click", (t) => {
      const a = document.getElementById("search-modal");
      a && !a.contains(t.target) && (e.open = !1, e.search = "");
    }), window.addEventListener("keydown", function(t) {
      t.ctrlKey && t.key === "k" && (e.open = !0, u(() => l.value.focus())), t.metaKey && t.key === "k" && (e.open = !0, u(() => l.value.focus())), t.key === "Escape" && (e.open = !1, e.search = "");
    });
    function p() {
      window.location.href = `${window.location.origin}/search?q=${e.search}`;
    }
    async function m() {
      try {
        return (await S.get("/api/tenants")).data.data;
      } catch {
        return [];
      }
    }
    x(async () => {
      e.data = await m();
    });
    const d = g(() => e.data.filter((t) => (t.name + " " + t.slug).toLowerCase().includes(e.search.toLowerCase())));
    function f(t) {
      const { protocol: a, hostname: o } = window.location;
      return `${a}//${t}.${o}`;
    }
    return (t, a) => e.open ? (r(), c("div", L, [
      s("div", M, [
        s("div", N, [
          s("label", B, [
            y(s("input", {
              ref_key: "inputRef",
              ref: l,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": a[0] || (a[0] = (o) => e.search = o),
              onKeydown: b(p, ["enter"]),
              placeholder: "Search for a coach or a systems..."
            }, null, 544), [
              [v, e.search]
            ]),
            D
          ])
        ]),
        s("div", G, [
          d.value.length && e.search.length ? (r(), c("ul", K, [
            (r(!0), c(k, null, E(d.value, (o) => (r(), c("li", {
              class: "p-3 shadow-sm bg-white rounded-md hover:bg-neutral hover:text-white",
              key: o.id
            }, [
              s("a", {
                class: "flex gap-2",
                href: f(o.slug)
              }, [
                s("div", {
                  class: C(["p-3", `bg-[${o.color}]`])
                }, i(o.emoji), 3),
                s("p", null, i(o.name), 1)
              ], 8, V)
            ]))), 128))
          ])) : n("", !0),
          e.search.length ? n("", !0) : (r(), c("div", T, [...A])),
          !d.value.length && e.search.length ? (r(), c("div", R, [
            s("span", Z, [
              h("No resutls for "),
              s("span", j, i(`"${e.search}"`), 1)
            ])
          ])) : n("", !0)
        ]),
        q
      ])
    ])) : n("", !0);
  }
}, O = /* @__PURE__ */ $(F, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  O as default
};
