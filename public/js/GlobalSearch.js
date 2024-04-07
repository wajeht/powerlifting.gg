import { reactive as g, ref as y, nextTick as p, onMounted as b, computed as k, watch as v, openBlock as c, createElementBlock as n, createElementVNode as o, withDirectives as I, withKeys as E, vModelText as $, Fragment as C, renderList as D, normalizeClass as f, toDisplayString as u, createCommentVNode as a, createTextVNode as h } from "vue";
import S from "axios";
import { _ as M } from "./_plugin-vue_export-helper.js";
const A = {
  key: 0,
  class: "absolute h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10"
}, B = {
  id: "search-modal",
  class: "flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md"
}, L = { class: "p-5" }, N = { class: "input input-bordered flex items-center gap-2" }, G = /* @__PURE__ */ o("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  class: "w-4 h-4 opacity-70"
}, [
  /* @__PURE__ */ o("path", {
    "fill-rule": "evenodd",
    d: "M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
    "clip-rule": "evenodd"
  })
], -1), K = { class: "px-5 py-4 max-h-sm overflow-y-scroll bg-[#E8E9EA]" }, V = {
  key: 0,
  class: "flex flex-col gap-2"
}, T = ["href"], U = {
  key: 1,
  class: "text-center text-neutral-400 text-sm py-10"
}, z = /* @__PURE__ */ o("span", { class: "text-sm" }, "No recent searches", -1), R = [
  z
], Z = {
  key: 2,
  class: "text-center text-neutral-400 text-sm py-10"
}, j = { class: "text-sm" }, q = { class: "font-bold" }, F = /* @__PURE__ */ o("div", { class: "border-t border-1 border-solid text-center p-5" }, [
  /* @__PURE__ */ h(" press "),
  /* @__PURE__ */ o("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ h(" to close. ")
], -1), H = {
  __name: "GlobalSearch",
  setup(J) {
    const e = g({
      search: "",
      data: [],
      open: !1,
      selectedIndex: null
    }), d = y(null);
    document.addEventListener("click", (t) => {
      const s = document.getElementById("search-modal");
      s && !s.contains(t.target) && (e.open = !1, e.search = "", e.selectedIndex = null);
    }), window.addEventListener("keydown", function(t) {
      if (t.ctrlKey && t.key === "k" && (e.open = !0, p(() => d.value.focus())), t.metaKey && t.key === "k" && (e.open = !0, p(() => d.value.focus())), t.key === "Escape" && (e.open = !1, e.search = "", e.selectedIndex = null), e.open && ["ArrowUp", "ArrowDown"].includes(t.key)) {
        t.preventDefault();
        const s = e.selectedIndex !== null ? e.selectedIndex : -1;
        t.key === "ArrowUp" ? e.selectedIndex = Math.max(s - 1, 0) : t.key === "ArrowDown" && (e.selectedIndex = Math.min(s + 1, r.value.length - 1));
      }
      if (t.key === "Enter" && e.selectedIndex !== null) {
        t.preventDefault();
        const s = r.value[e.selectedIndex].slug;
        _(s);
      }
    });
    function m() {
      window.location.href = `${window.location.origin}/search?q=${e.search}`;
    }
    async function w() {
      try {
        return (await S.get("/api/tenants")).data.data;
      } catch {
        return [];
      }
    }
    b(async () => {
      e.data = await w();
    });
    const r = k(() => e.data.filter((t) => (t.name + " " + t.slug).toLowerCase().includes(e.search.toLowerCase())));
    v(
      () => e.search,
      (t, s) => {
        t !== s && (e.selectedIndex = null);
      }
    );
    function x(t) {
      const { protocol: s, hostname: l } = window.location;
      return `${s}//${t}.${l}`;
    }
    function _(t) {
      const { protocol: s, hostname: l } = window.location, i = `${s}//${t}.${l}`;
      window.location.href = i;
    }
    return (t, s) => e.open ? (c(), n("div", A, [
      o("div", B, [
        o("div", L, [
          o("label", N, [
            I(o("input", {
              ref_key: "inputRef",
              ref: d,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": s[0] || (s[0] = (l) => e.search = l),
              onKeydown: E(m, ["enter"]),
              placeholder: "Search for a coach or a systems..."
            }, null, 544), [
              [$, e.search]
            ]),
            G
          ])
        ]),
        o("div", K, [
          r.value.length && e.search.length ? (c(), n("ul", V, [
            (c(!0), n(C, null, D(r.value, (l, i) => (c(), n("li", {
              class: f(["p-3 shadow-sm bg-white rounded-md hover:bg-neutral hover:text-white", { "bg-[#2B3440] text-white": e.selectedIndex === i }]),
              key: l.id
            }, [
              o("a", {
                class: "flex gap-2",
                href: x(l.slug)
              }, [
                o("div", {
                  class: f(["p-3", `bg-[${l.color}]`])
                }, u(l.emoji), 3),
                o("p", null, u(l.name), 1)
              ], 8, T)
            ], 2))), 128))
          ])) : a("", !0),
          e.search.length ? a("", !0) : (c(), n("div", U, [...R])),
          !r.value.length && e.search.length ? (c(), n("div", Z, [
            o("span", j, [
              h("No results for "),
              o("span", q, u(`"${e.search}"`), 1)
            ])
          ])) : a("", !0)
        ]),
        F
      ])
    ])) : a("", !0);
  }
}, W = /* @__PURE__ */ M(H, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  W as default
};
