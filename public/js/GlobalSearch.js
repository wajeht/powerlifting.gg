import { reactive as g, ref as k, nextTick as m, onMounted as y, computed as b, watch as v, openBlock as n, createElementBlock as c, createElementVNode as s, withDirectives as I, withKeys as E, vModelText as $, Fragment as C, renderList as D, normalizeClass as r, toDisplayString as h, createCommentVNode as i, createTextVNode as p } from "vue";
import S from "axios";
import { _ as M } from "./_plugin-vue_export-helper.js";
const A = {
  key: 0,
  class: "absolute h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10"
}, L = {
  id: "search-modal",
  class: "flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md"
}, N = { class: "p-5" }, B = { class: "input input-bordered flex items-center gap-2" }, G = /* @__PURE__ */ s("svg", {
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
], -1), K = { class: "px-5 py-4 max-h-sm overflow-y-scroll bg-[#E8E9EA]" }, V = {
  key: 0,
  class: "flex flex-col gap-2"
}, T = ["href"], U = { class: "flex flex-col gap-1" }, z = { class: "flex-1" }, R = { class: "rating rating-xs" }, Z = {
  key: 0,
  class: "flex-0"
}, j = {
  key: 1,
  class: "text-center text-neutral-400 text-sm py-10"
}, q = /* @__PURE__ */ s("span", { class: "text-sm" }, "No recent searches", -1), F = [
  q
], H = {
  key: 2,
  class: "text-center text-neutral-400 text-sm py-10"
}, J = { class: "text-sm" }, O = { class: "font-bold" }, P = /* @__PURE__ */ s("div", { class: "border-t border-1 border-solid text-center p-5" }, [
  /* @__PURE__ */ p(" press "),
  /* @__PURE__ */ s("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ p(" to close. ")
], -1), Q = {
  __name: "GlobalSearch",
  setup(W) {
    const e = g({
      search: "",
      data: [],
      open: !1,
      selectedIndex: null
    }), u = k(null);
    document.addEventListener("click", (t) => {
      const o = document.getElementById("search-modal");
      o && !o.contains(t.target) && (e.open = !1, e.search = "", e.selectedIndex = null);
    }), window.addEventListener("keydown", function(t) {
      if (t.ctrlKey && t.key === "k" && (e.open = !0, m(() => u.value.focus())), t.metaKey && t.key === "k" && (e.open = !0, m(() => u.value.focus())), t.key === "Escape" && (e.open = !1, e.search = "", e.selectedIndex = null), e.open && ["ArrowUp", "ArrowDown"].includes(t.key)) {
        t.preventDefault();
        const o = e.selectedIndex !== null ? e.selectedIndex : -1;
        t.key === "ArrowUp" ? e.selectedIndex = Math.max(o - 1, 0) : t.key === "ArrowDown" && (e.selectedIndex = Math.min(o + 1, d.value.length - 1));
      }
      if (t.key === "Enter" && e.selectedIndex !== null) {
        t.preventDefault();
        const o = d.value[e.selectedIndex].slug;
        w(o);
      }
    });
    function f() {
      window.location.href = `${window.location.origin}/search?q=${e.search}`;
    }
    async function x() {
      try {
        return (await S.get("/api/tenants")).data.data;
      } catch {
        return [];
      }
    }
    y(async () => {
      e.data = await x();
    });
    const d = b(() => e.data.filter((t) => (t.name + " " + t.slug).toLowerCase().includes(e.search.toLowerCase())));
    v(
      () => e.search,
      (t, o) => {
        t !== o && (e.selectedIndex = null);
      }
    );
    function _(t) {
      const { protocol: o, hostname: a } = window.location;
      return `${o}//${t}.${a}`;
    }
    function w(t) {
      const { protocol: o, hostname: a } = window.location, l = `${o}//${t}.${a}`;
      window.location.href = l;
    }
    return (t, o) => e.open ? (n(), c("div", A, [
      s("div", L, [
        s("div", N, [
          s("label", B, [
            I(s("input", {
              ref_key: "inputRef",
              ref: u,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": o[0] || (o[0] = (a) => e.search = a),
              onKeydown: E(f, ["enter"]),
              placeholder: "Search for a coach or a systems..."
            }, null, 544), [
              [$, e.search]
            ]),
            G
          ])
        ]),
        s("div", K, [
          d.value.length && e.search.length ? (n(), c("ul", V, [
            (n(!0), c(C, null, D(d.value, (a, l) => (n(), c("li", {
              class: r(["p-3 shadow-sm rounded-md hover:bg-neutral hover:text-white", [e.selectedIndex === l ? "bg-neutral text-white" : "bg-white"]]),
              key: a.id
            }, [
              s("a", {
                class: "flex gap-2",
                href: _(a.slug)
              }, [
                s("div", {
                  class: r(["p-3 flex-0", `bg-[${a.color}]`])
                }, h(a.emoji), 3),
                s("div", U, [
                  s("p", z, h(a.name), 1),
                  s("div", R, [
                    s("input", {
                      type: "radio",
                      name: "rating-1",
                      class: r(["mask mask-star", [e.selectedIndex === l ? "bg-white" : ""]])
                    }, null, 2),
                    s("input", {
                      type: "radio",
                      name: "rating-1",
                      class: r(["mask mask-star", [e.selectedIndex === l ? "bg-white" : ""]]),
                      checked: ""
                    }, null, 2),
                    s("input", {
                      type: "radio",
                      name: "rating-1",
                      class: r(["mask mask-star", [e.selectedIndex === l ? "bg-white" : ""]])
                    }, null, 2),
                    s("input", {
                      type: "radio",
                      name: "rating-1",
                      class: r(["mask mask-star", [e.selectedIndex === l ? "bg-white" : ""]])
                    }, null, 2),
                    s("input", {
                      type: "radio",
                      name: "rating-1",
                      class: r(["mask mask-star", [e.selectedIndex === l ? "bg-white" : ""]])
                    }, null, 2)
                  ])
                ]),
                e.selectedIndex === l ? (n(), c("span", Z, "↩")) : i("", !0)
              ], 8, T)
            ], 2))), 128))
          ])) : i("", !0),
          e.search.length ? i("", !0) : (n(), c("div", j, [...F])),
          !d.value.length && e.search.length ? (n(), c("div", H, [
            s("span", J, [
              p("No results for "),
              s("span", O, h(`"${e.search}"`), 1)
            ])
          ])) : i("", !0)
        ]),
        P
      ])
    ])) : i("", !0);
  }
}, te = /* @__PURE__ */ M(Q, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  te as default
};
