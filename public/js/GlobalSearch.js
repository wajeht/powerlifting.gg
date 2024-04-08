import { reactive as k, ref as v, nextTick as g, onMounted as I, computed as $, watch as E, openBlock as c, createElementBlock as r, normalizeClass as l, createElementVNode as o, withDirectives as C, withKeys as S, vModelText as B, Fragment as D, renderList as M, toDisplayString as f, createCommentVNode as u, createTextVNode as _ } from "vue";
import A from "axios";
import { _ as N } from "./_plugin-vue_export-helper.js";
const R = { class: "p-5 border-b border-1 border-solid" }, L = { class: "input input-bordered flex items-center gap-2" }, V = /* @__PURE__ */ o("svg", {
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
], -1), z = [
  V
], G = { class: "px-5 py-4 max-h-[335px] overflow-y-scroll bg-[#E8E9EA]" }, K = {
  key: 0,
  class: "flex flex-col gap-2"
}, T = ["href"], q = { class: "flex-1 h-full" }, U = { class: "flex flex-col gap-1" }, j = { class: "rating rating-xs" }, H = {
  key: 0,
  class: "flex-0"
}, Z = {
  key: 1,
  class: "text-center text-neutral-400 text-sm py-10"
}, F = /* @__PURE__ */ o("span", { class: "text-sm" }, "No recent searches", -1), O = [
  F
], J = {
  key: 2,
  class: "text-center text-neutral-400 text-sm py-10"
}, P = { class: "text-sm" }, Q = { class: "font-bold" }, W = /* @__PURE__ */ o("div", { class: "border-t border-1 border-solid text-center p-5" }, [
  /* @__PURE__ */ _(" press "),
  /* @__PURE__ */ o("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ _(" to close. ")
], -1), X = {
  __name: "GlobalSearch",
  setup(Y) {
    const e = k({
      search: "",
      data: [],
      open: !1,
      selectedIndex: null
    }), m = v(null);
    document.addEventListener("click", (t) => {
      const n = document.getElementById("search-modal");
      n && !n.contains(t.target) && (e.open = !1, e.search = "", e.selectedIndex = null);
    }), window.addEventListener("keydown", function(t) {
      if (t.ctrlKey && t.key === "k" && (e.open = !0, g(() => m.value.focus())), t.metaKey && t.key === "k" && (e.open = !0, g(() => m.value.focus())), t.key === "Escape" && (e.open = !1, e.search = "", e.selectedIndex = null), e.open && ["ArrowUp", "ArrowDown"].includes(t.key)) {
        t.preventDefault();
        const s = e.selectedIndex !== null ? e.selectedIndex : -1;
        t.key === "ArrowUp" ? (e.selectedIndex = Math.max(s - 1, 0), n()) : t.key === "ArrowDown" && (e.selectedIndex = Math.min(s + 1, d.value.length - 1), n());
      }
      function n() {
        const s = document.querySelector(".selected");
        if (s) {
          const a = s.parentElement.parentElement, i = s.getBoundingClientRect(), h = a.getBoundingClientRect(), p = s.offsetHeight + 216;
          i.bottom > h.bottom ? a.scrollBy(0, p) : i.top < h.top && a.scrollBy(0, -p);
        }
      }
      if (t.key === "Enter" && e.selectedIndex !== null) {
        t.preventDefault();
        const s = d.value[e.selectedIndex].slug;
        b(s);
      }
    });
    function w() {
      const { protocol: t, hostname: n } = window.location;
      if (n.split(".").length === 2) {
        window.location.href = `${window.location.origin}/search?q=${e.search}`;
        return;
      }
      if (n.split(".").length === 3) {
        const [s, a, i] = n.split(".");
        window.location.href = `${t}//${a}.${i}/search?q=${e.search}`;
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
    const d = $(() => e.data.filter((t) => (t.name + " " + t.slug).toLowerCase().includes(e.search.toLowerCase())));
    E(
      () => e.search,
      (t, n) => {
        t !== n && (e.selectedIndex = null);
      }
    );
    function y(t) {
      const { protocol: n, hostname: s } = window.location;
      return `${n}//${t}.${s}`;
    }
    function b(t) {
      const { protocol: n, hostname: s } = window.location;
      if (s.split(".").length === 2) {
        const a = `${n}//${t}.${s}`;
        window.location.href = a;
      }
      if (s.split(".").length === 3) {
        const [a, i, h] = s.split("."), p = `${n}//${t}.${i}.${h}`;
        window.location.href = p;
      }
    }
    return (t, n) => e.open ? (c(), r("div", {
      key: 0,
      class: l(["absolute h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10 animate__animated animate__veryfast", {
        animate__fadeIn: !e.open,
        animate__fadeIn: e.open
      }])
    }, [
      o("div", {
        id: "search-modal",
        class: l(["flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md animate__animated animate__veryfast", {
          animate__zoomIn: e.open,
          animate__zoomOut: !e.open
        }])
      }, [
        o("div", R, [
          o("label", L, [
            C(o("input", {
              ref_key: "inputRef",
              ref: m,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": n[0] || (n[0] = (s) => e.search = s),
              onKeydown: S(w, ["enter"]),
              placeholder: "Search for a coach or a systems..."
            }, null, 544), [
              [B, e.search]
            ]),
            o("button", {
              onClick: w,
              class: "hover:bg-neutral hover:text-white h-8 w-8 flex justify-center items-center rounded-md"
            }, [...z])
          ])
        ]),
        o("div", G, [
          d.value.length && e.search.length ? (c(), r("ul", K, [
            (c(!0), r(D, null, M(d.value, (s, a) => (c(), r("li", {
              class: l(["p-3 shadow-sm rounded-md hover:bg-neutral hover:text-white", [e.selectedIndex === a ? "bg-neutral text-white selected" : "bg-white"]]),
              key: s.id
            }, [
              o("a", {
                class: "flex gap-2",
                href: y(s.slug)
              }, [
                o("div", {
                  class: l(["p-3 flex-0", `bg-[${s.color}]`])
                }, f(s.emoji), 3),
                o("div", q, [
                  o("div", U, [
                    o("p", null, f(s.name), 1),
                    o("div", j, [
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: l(["mask mask-star", [e.selectedIndex === a ? "bg-white" : ""]])
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: l(["mask mask-star", [e.selectedIndex === a ? "bg-white" : ""]]),
                        checked: ""
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: l(["mask mask-star", [e.selectedIndex === a ? "bg-white" : ""]])
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: l(["mask mask-star", [e.selectedIndex === a ? "bg-white" : ""]])
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: l(["mask mask-star", [e.selectedIndex === a ? "bg-white" : ""]])
                      }, null, 2)
                    ])
                  ])
                ]),
                e.selectedIndex === a ? (c(), r("span", H, "↩")) : u("", !0)
              ], 8, T)
            ], 2))), 128))
          ])) : u("", !0),
          e.search.length ? u("", !0) : (c(), r("div", Z, [...O])),
          !d.value.length && e.search.length ? (c(), r("div", J, [
            o("span", P, [
              _("No results for "),
              o("span", Q, f(`"${e.search}"`), 1)
            ])
          ])) : u("", !0)
        ]),
        W
      ], 2)
    ], 2)) : u("", !0);
  }
}, oe = /* @__PURE__ */ N(X, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  oe as default
};
