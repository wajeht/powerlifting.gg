import { reactive as b, ref as v, nextTick as x, onMounted as I, computed as E, watch as C, openBlock as a, createElementBlock as c, createElementVNode as s, withDirectives as $, withKeys as S, vModelText as B, Fragment as D, renderList as M, normalizeClass as r, toDisplayString as h, createCommentVNode as i, createTextVNode as p } from "vue";
import A from "axios";
import { _ as N } from "./_plugin-vue_export-helper.js";
const R = {
  key: 0,
  class: "absolute h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10"
}, L = {
  id: "search-modal",
  class: "flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md"
}, V = { class: "p-5 border-b border-1 border-solid" }, G = { class: "input input-bordered flex items-center gap-2" }, K = /* @__PURE__ */ s("svg", {
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
], -1), T = { class: "px-5 py-4 max-h-[335px] overflow-y-scroll bg-[#E8E9EA]" }, U = {
  key: 0,
  class: "flex flex-col gap-2"
}, q = ["href"], z = { class: "flex-1 h-full" }, H = { class: "flex flex-col gap-1" }, Z = { class: "rating rating-xs" }, j = {
  key: 0,
  class: "flex-0"
}, F = {
  key: 1,
  class: "text-center text-neutral-400 text-sm py-10"
}, J = /* @__PURE__ */ s("span", { class: "text-sm" }, "No recent searches", -1), O = [
  J
], P = {
  key: 2,
  class: "text-center text-neutral-400 text-sm py-10"
}, Q = { class: "text-sm" }, W = { class: "font-bold" }, X = /* @__PURE__ */ s("div", { class: "border-t border-1 border-solid text-center p-5" }, [
  /* @__PURE__ */ p(" press "),
  /* @__PURE__ */ s("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ p(" to close. ")
], -1), Y = {
  __name: "GlobalSearch",
  setup(ee) {
    const e = b({
      search: "",
      data: [],
      open: !1,
      selectedIndex: null
    }), u = v(null);
    document.addEventListener("click", (t) => {
      const n = document.getElementById("search-modal");
      n && !n.contains(t.target) && (e.open = !1, e.search = "", e.selectedIndex = null);
    }), window.addEventListener("keydown", function(t) {
      if (t.ctrlKey && t.key === "k" && (e.open = !0, x(() => u.value.focus())), t.metaKey && t.key === "k" && (e.open = !0, x(() => u.value.focus())), t.key === "Escape" && (e.open = !1, e.search = "", e.selectedIndex = null), e.open && ["ArrowUp", "ArrowDown"].includes(t.key)) {
        t.preventDefault();
        const o = e.selectedIndex !== null ? e.selectedIndex : -1;
        t.key === "ArrowUp" ? (e.selectedIndex = Math.max(o - 1, 0), n()) : t.key === "ArrowDown" && (e.selectedIndex = Math.min(o + 1, d.value.length - 1), n());
      }
      function n() {
        const o = document.querySelector(".selected");
        if (o) {
          const l = o.parentElement.parentElement, m = o.getBoundingClientRect(), f = l.getBoundingClientRect(), g = o.offsetHeight + 216;
          m.bottom > f.bottom ? l.scrollBy(0, g) : m.top < f.top && l.scrollBy(0, -g);
        }
      }
      if (t.key === "Enter" && e.selectedIndex !== null) {
        t.preventDefault();
        const o = d.value[e.selectedIndex].slug;
        k(o);
      }
    });
    function w() {
      window.location.href = `${window.location.origin}/search?q=${e.search}`;
    }
    async function _() {
      try {
        return (await A.get("/api/tenants")).data.data;
      } catch {
        return [];
      }
    }
    I(async () => {
      e.data = await _();
    });
    const d = E(() => e.data.filter((t) => (t.name + " " + t.slug).toLowerCase().includes(e.search.toLowerCase())));
    C(
      () => e.search,
      (t, n) => {
        t !== n && (e.selectedIndex = null);
      }
    );
    function y(t) {
      const { protocol: n, hostname: o } = window.location;
      return `${n}//${t}.${o}`;
    }
    function k(t) {
      const { protocol: n, hostname: o } = window.location, l = `${n}//${t}.${o}`;
      window.location.href = l;
    }
    return (t, n) => e.open ? (a(), c("div", R, [
      s("div", L, [
        s("div", V, [
          s("label", G, [
            $(s("input", {
              ref_key: "inputRef",
              ref: u,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": n[0] || (n[0] = (o) => e.search = o),
              onKeydown: S(w, ["enter"]),
              placeholder: "Search for a coach or a systems..."
            }, null, 544), [
              [B, e.search]
            ]),
            K
          ])
        ]),
        s("div", T, [
          d.value.length && e.search.length ? (a(), c("ul", U, [
            (a(!0), c(D, null, M(d.value, (o, l) => (a(), c("li", {
              class: r(["p-3 shadow-sm rounded-md hover:bg-neutral hover:text-white", [e.selectedIndex === l ? "bg-neutral text-white selected" : "bg-white"]]),
              key: o.id
            }, [
              s("a", {
                class: "flex gap-2",
                href: y(o.slug)
              }, [
                s("div", {
                  class: r(["p-3 flex-0", `bg-[${o.color}]`])
                }, h(o.emoji), 3),
                s("div", z, [
                  s("div", H, [
                    s("p", null, h(o.name), 1),
                    s("div", Z, [
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
                  ])
                ]),
                e.selectedIndex === l ? (a(), c("span", j, "↩")) : i("", !0)
              ], 8, q)
            ], 2))), 128))
          ])) : i("", !0),
          e.search.length ? i("", !0) : (a(), c("div", F, [...O])),
          !d.value.length && e.search.length ? (a(), c("div", P, [
            s("span", Q, [
              p("No results for "),
              s("span", W, h(`"${e.search}"`), 1)
            ])
          ])) : i("", !0)
        ]),
        X
      ])
    ])) : i("", !0);
  }
}, ne = /* @__PURE__ */ N(Y, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  ne as default
};
