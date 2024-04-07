import { reactive as b, ref as v, nextTick as x, onMounted as I, computed as E, watch as $, openBlock as a, createElementBlock as c, createElementVNode as o, withDirectives as C, withKeys as S, vModelText as B, Fragment as D, renderList as M, normalizeClass as r, toDisplayString as f, createCommentVNode as i, createTextVNode as g } from "vue";
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
], -1), T = { class: "px-5 py-4 max-h-[335px] overflow-y-scroll bg-[#E8E9EA]" }, U = {
  key: 0,
  class: "flex flex-col gap-2"
}, z = ["href"], H = { class: "flex-1 h-full" }, Z = { class: "flex flex-col gap-1" }, j = { class: "rating rating-xs" }, q = {
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
    }), h = v(null);
    document.addEventListener("click", (t) => {
      const l = document.getElementById("search-modal");
      l && !l.contains(t.target) && (e.open = !1, e.search = "", e.selectedIndex = null);
    }), window.addEventListener("keydown", function(t) {
      if (t.ctrlKey && t.key === "k" && (e.open = !0, x(() => h.value.focus())), t.metaKey && t.key === "k" && (e.open = !0, x(() => h.value.focus())), t.key === "Escape" && (e.open = !1, e.search = "", e.selectedIndex = null), e.open && ["ArrowUp", "ArrowDown"].includes(t.key)) {
        t.preventDefault();
        const s = e.selectedIndex !== null ? e.selectedIndex : -1;
        t.key === "ArrowUp" ? (e.selectedIndex = Math.max(s - 1, 0), l()) : t.key === "ArrowDown" && (e.selectedIndex = Math.min(s + 1, d.value.length - 1), l());
      }
      function l() {
        const s = document.querySelector(".selected");
        if (s) {
          const n = s.parentElement.parentElement, m = s.getBoundingClientRect(), u = n.getBoundingClientRect(), p = s.offsetHeight + 216;
          m.bottom > u.bottom ? n.scrollBy(0, p) : m.top < u.top && n.scrollBy(0, -p);
        }
      }
      if (t.key === "Enter" && e.selectedIndex !== null) {
        t.preventDefault();
        const s = d.value[e.selectedIndex].slug;
        k(s);
      }
    });
    function _() {
    }
    async function w() {
      try {
        return (await A.get("/api/tenants")).data.data;
      } catch {
        return [];
      }
    }
    I(async () => {
      setTimeout(async () => {
        e.data = await w();
      }, 500);
    });
    const d = E(() => e.data.filter((t) => (t.name + " " + t.slug).toLowerCase().includes(e.search.toLowerCase())));
    $(
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
        const [m, u, p] = s.split(".");
        n = `${l}//${t}.${u}.${p}`, console.log(s.split("."), n);
      }
    }
    return (t, l) => e.open ? (a(), c("div", R, [
      o("div", L, [
        o("div", V, [
          o("label", G, [
            C(o("input", {
              ref_key: "inputRef",
              ref: h,
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
          d.value.length && e.search.length ? (a(), c("ul", U, [
            (a(!0), c(D, null, M(d.value, (s, n) => (a(), c("li", {
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
                o("div", H, [
                  o("div", Z, [
                    o("p", null, f(s.name), 1),
                    o("div", j, [
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
                e.selectedIndex === n ? (a(), c("span", q, "↩")) : i("", !0)
              ], 8, z)
            ], 2))), 128))
          ])) : i("", !0),
          e.search.length ? i("", !0) : (a(), c("div", F, [...O])),
          !d.value.length && e.search.length ? (a(), c("div", P, [
            o("span", Q, [
              g("No results for "),
              o("span", W, f(`"${e.search}"`), 1)
            ])
          ])) : i("", !0)
        ]),
        X
      ])
    ])) : i("", !0);
  }
}, le = /* @__PURE__ */ N(Y, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  le as default
};
