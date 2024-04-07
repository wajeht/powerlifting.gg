import { reactive as b, ref as v, nextTick as w, onMounted as I, computed as $, watch as E, openBlock as a, createElementBlock as c, createElementVNode as o, withDirectives as C, withKeys as S, vModelText as B, Fragment as D, renderList as M, normalizeClass as r, toDisplayString as f, createCommentVNode as u, createTextVNode as g } from "vue";
import A from "axios";
import { _ as N } from "./_plugin-vue_export-helper.js";
const R = {
  key: 0,
  class: "absolute h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10"
}, L = {
  id: "search-modal",
  class: "flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md"
}, V = { class: "p-5 border-b border-1 border-solid" }, G = { class: "input input-bordered flex items-center gap-2" }, K = /* @__PURE__ */ o("svg", {
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
], -1), T = { class: "px-5 py-4 max-h-[335px] overflow-y-scroll bg-[#E8E9EA]" }, q = {
  key: 0,
  class: "flex flex-col gap-2"
}, U = ["href"], z = { class: "flex-1 h-full" }, H = { class: "flex flex-col gap-1" }, Z = { class: "rating rating-xs" }, j = {
  key: 0,
  class: "flex-0"
}, F = {
  key: 1,
  class: "text-center text-neutral-400 text-sm py-10"
}, J = /* @__PURE__ */ o("span", { class: "text-sm" }, "No recent searches", -1), O = [
  J
], P = {
  key: 2,
  class: "text-center text-neutral-400 text-sm py-10"
}, Q = { class: "text-sm" }, W = { class: "font-bold" }, X = /* @__PURE__ */ o("div", { class: "border-t border-1 border-solid text-center p-5" }, [
  /* @__PURE__ */ g(" press "),
  /* @__PURE__ */ o("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ g(" to close. ")
], -1), Y = {
  __name: "GlobalSearch",
  setup(ee) {
    const e = b({
      search: "",
      data: [],
      open: !1,
      selectedIndex: null
    }), m = v(null);
    document.addEventListener("click", (t) => {
      const l = document.getElementById("search-modal");
      l && !l.contains(t.target) && (e.open = !1, e.search = "", e.selectedIndex = null);
    }), window.addEventListener("keydown", function(t) {
      if (t.ctrlKey && t.key === "k" && (e.open = !0, w(() => m.value.focus())), t.metaKey && t.key === "k" && (e.open = !0, w(() => m.value.focus())), t.key === "Escape" && (e.open = !1, e.search = "", e.selectedIndex = null), e.open && ["ArrowUp", "ArrowDown"].includes(t.key)) {
        t.preventDefault();
        const s = e.selectedIndex !== null ? e.selectedIndex : -1;
        t.key === "ArrowUp" ? (e.selectedIndex = Math.max(s - 1, 0), l()) : t.key === "ArrowDown" && (e.selectedIndex = Math.min(s + 1, i.value.length - 1), l());
      }
      function l() {
        const s = document.querySelector(".selected");
        if (s) {
          const n = s.parentElement.parentElement, d = s.getBoundingClientRect(), h = n.getBoundingClientRect(), p = s.offsetHeight + 216;
          d.bottom > h.bottom ? n.scrollBy(0, p) : d.top < h.top && n.scrollBy(0, -p);
        }
      }
      if (t.key === "Enter" && e.selectedIndex !== null) {
        t.preventDefault();
        const s = i.value[e.selectedIndex].slug;
        k(s);
      }
    });
    function _() {
      const { protocol: t, hostname: l } = window.location;
      if (l.split(".").length === 2) {
        window.location.href = `${window.location.origin}/search?q=${e.search}`;
        return;
      }
      if (l.split(".").length === 3) {
        const [s, n, d] = l.split(".");
        window.location.href = `${t}//${n}.${d}/search?q=${e.search}`;
        return;
      }
    }
    async function x() {
      try {
        return (await A.get("/api/tenants")).data.data;
      } catch {
        return [];
      }
    }
    I(async () => {
      setTimeout(async () => {
        e.data = await x();
      }, 500);
    });
    const i = $(() => e.data.filter((t) => (t.name + " " + t.slug).toLowerCase().includes(e.search.toLowerCase())));
    E(
      () => e.search,
      (t, l) => {
        t !== l && (e.selectedIndex = null);
      }
    );
    function y(t) {
      const { protocol: l, hostname: s } = window.location;
      return `${l}//${t}.${s}`;
    }
    function k(t) {
      const { protocol: l, hostname: s } = window.location;
      let n;
      if (s.split(".").length === 2 && (n = `${l}//${t}.${s}`, console.log(s.split("."), n)), s.split(".").length === 3) {
        const [d, h, p] = s.split(".");
        n = `${l}//${t}.${h}.${p}`, console.log(s.split("."), n);
      }
    }
    return (t, l) => e.open ? (a(), c("div", R, [
      o("div", L, [
        o("div", V, [
          o("label", G, [
            C(o("input", {
              ref_key: "inputRef",
              ref: m,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": l[0] || (l[0] = (s) => e.search = s),
              onKeydown: S(_, ["enter"]),
              placeholder: "Search for a coach or a systems..."
            }, null, 544), [
              [B, e.search]
            ]),
            K
          ])
        ]),
        o("div", T, [
          i.value.length && e.search.length ? (a(), c("ul", q, [
            (a(!0), c(D, null, M(i.value, (s, n) => (a(), c("li", {
              class: r(["p-3 shadow-sm rounded-md hover:bg-neutral hover:text-white", [e.selectedIndex === n ? "bg-neutral text-white selected" : "bg-white"]]),
              key: s.id
            }, [
              o("a", {
                class: "flex gap-2",
                href: y(s.slug)
              }, [
                o("div", {
                  class: r(["p-3 flex-0", `bg-[${s.color}]`])
                }, f(s.emoji), 3),
                o("div", z, [
                  o("div", H, [
                    o("p", null, f(s.name), 1),
                    o("div", Z, [
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: r(["mask mask-star", [e.selectedIndex === n ? "bg-white" : ""]])
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: r(["mask mask-star", [e.selectedIndex === n ? "bg-white" : ""]]),
                        checked: ""
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: r(["mask mask-star", [e.selectedIndex === n ? "bg-white" : ""]])
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: r(["mask mask-star", [e.selectedIndex === n ? "bg-white" : ""]])
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: r(["mask mask-star", [e.selectedIndex === n ? "bg-white" : ""]])
                      }, null, 2)
                    ])
                  ])
                ]),
                e.selectedIndex === n ? (a(), c("span", j, "↩")) : u("", !0)
              ], 8, U)
            ], 2))), 128))
          ])) : u("", !0),
          e.search.length ? u("", !0) : (a(), c("div", F, [...O])),
          !i.value.length && e.search.length ? (a(), c("div", P, [
            o("span", Q, [
              g("No results for "),
              o("span", W, f(`"${e.search}"`), 1)
            ])
          ])) : u("", !0)
        ]),
        X
      ])
    ])) : u("", !0);
  }
}, le = /* @__PURE__ */ N(Y, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  le as default
};
