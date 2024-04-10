import { ref as w, reactive as R, nextTick as v, onMounted as C, computed as L, watch as B, openBlock as c, createElementBlock as r, normalizeClass as m, createElementVNode as a, withDirectives as N, withKeys as M, vModelText as O, Fragment as k, renderList as b, toDisplayString as _, createCommentVNode as p, createTextVNode as x } from "vue";
import z from "axios";
import { _ as A } from "./_plugin-vue_export-helper.js";
const V = { class: "p-5 border-b border-1 border-solid" }, G = { class: "input input-bordered flex items-center gap-2" }, K = /* @__PURE__ */ a("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  class: "w-4 h-4 opacity-70"
}, [
  /* @__PURE__ */ a("path", {
    "fill-rule": "evenodd",
    d: "M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
    "clip-rule": "evenodd"
  })
], -1), j = [
  K
], q = { class: "px-5 py-4 max-h-[335px] overflow-y-scroll bg-[#E8E9EA]" }, U = {
  key: 0,
  class: "flex flex-col gap-2"
}, H = ["href"], J = { class: "flex-1 h-full" }, Z = { class: "flex flex-col gap-1" }, F = { class: "rating rating-xs" }, P = ["id", "name"], Q = { class: "flex gap-1 text-xs p-1" }, W = { key: 0 }, X = { key: 1 }, Y = {
  key: 0,
  class: "flex-0"
}, ee = {
  key: 1,
  class: "text-center text-neutral-400 text-sm py-10"
}, te = /* @__PURE__ */ a("span", { class: "text-sm" }, "No recent searches", -1), se = [
  te
], oe = {
  key: 2,
  class: "text-center text-neutral-400 text-sm py-10"
}, ae = { class: "text-sm" }, ne = { class: "font-bold" }, le = /* @__PURE__ */ a("div", { class: "border-t border-1 border-solid text-center p-5" }, [
  /* @__PURE__ */ x(" press "),
  /* @__PURE__ */ a("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ x(" to close. ")
], -1), ce = {
  __name: "GlobalSearch",
  setup(re) {
    const d = w(null), u = w(null), e = R({
      search: "",
      data: [],
      open: !1,
      selectedIndex: null
    }), g = w(null);
    document.addEventListener("click", (s) => {
      const o = document.getElementById("modal");
      o && !o.contains(s.target) && (d.value || u.value) && (d.value.classList.add("animate__fadeOut"), u.value.classList.add("animate__zoomOut"), setTimeout(() => {
        e.open = !1, e.search = "", e.selectedIndex = null;
      }, 250));
    }), window.addEventListener("keydown", function(s) {
      if (s.ctrlKey && s.key === "k" && (e.open = !0, v(() => g.value.focus())), s.metaKey && s.key === "k" && (e.open = !0, v(() => g.value.focus())), s.key === "Escape" && (d.value || u.value) && (d.value.classList.add("animate__fadeOut"), u.value.classList.add("animate__zoomOut"), setTimeout(() => {
        e.open = !1, e.search = "", e.selectedIndex = null;
      }, 250)), e.open && ["ArrowUp", "ArrowDown"].includes(s.key)) {
        s.preventDefault();
        const t = e.selectedIndex !== null ? e.selectedIndex : -1;
        s.key === "ArrowUp" ? (e.selectedIndex = Math.max(t - 1, 0), o()) : s.key === "ArrowDown" && (e.selectedIndex = Math.min(t + 1, h.value.length - 1), o());
      }
      function o() {
        const t = document.querySelector(".selected");
        if (t) {
          const n = t.parentElement.parentElement, l = t.getBoundingClientRect(), i = n.getBoundingClientRect(), f = t.offsetHeight + 216;
          l.bottom > i.bottom ? n.scrollBy(0, f) : l.top < i.top && n.scrollBy(0, -f);
        }
      }
      if (s.key === "Enter" && e.selectedIndex !== null) {
        s.preventDefault();
        const t = h.value[e.selectedIndex].slug;
        I(t);
      }
    });
    function y() {
      if (e.search === "")
        return;
      const { protocol: s, hostname: o } = window.location, t = "current_page=1&per_page=25&sort=asc";
      if (o.split(".").length === 2) {
        window.location.href = `${window.location.origin}/tenants?q=${e.search}&${t}`;
        return;
      }
      if (o.split(".").length === 3) {
        const [n, l, i] = o.split(".");
        window.location.href = `${s}//${l}.${i}/tenants?q=${e.search}&${t}`;
        return;
      }
    }
    C(async () => {
      !S() || D() ? e.data = await T() : e.data = E();
    });
    const h = L(() => e.data.filter((s) => s.name.toLowerCase().includes(e.search.toLowerCase())));
    B(
      () => e.search,
      (s, o) => {
        s !== o && (e.selectedIndex = null);
      }
    );
    function $(s) {
      const { protocol: o, hostname: t } = window.location;
      return `${o}//${s}.${t}`;
    }
    function I(s) {
      const { protocol: o, hostname: t } = window.location;
      if (t.split(".").length === 2) {
        const n = `${o}//${s}.${t}`;
        window.location.href = n;
      }
      if (t.split(".").length === 3) {
        const [n, l, i] = t.split("."), f = `${o}//${s}.${l}.${i}`;
        window.location.href = f;
      }
    }
    function S() {
      return localStorage.getItem("cachedData") !== null && localStorage.getItem("cacheTimestamp") !== null;
    }
    function D() {
      const s = (/* @__PURE__ */ new Date()).getTime(), o = parseInt(localStorage.getItem("cacheTimestamp")), t = 24 * 60 * 60 * 1e3;
      return s - o > t;
    }
    function E() {
      return JSON.parse(localStorage.getItem("cachedData"));
    }
    async function T() {
      try {
        const o = (await z.get("/api/tenants")).data.data;
        return localStorage.setItem("cachedData", JSON.stringify(o)), localStorage.setItem("cacheTimestamp", (/* @__PURE__ */ new Date()).getTime().toString()), o;
      } catch (s) {
        return console.error("Error fetching data:", s), [];
      }
    }
    return (s, o) => e.open ? (c(), r("div", {
      key: 0,
      ref_key: "backdropRef",
      ref: d,
      id: "backdrop",
      class: m(["fixed h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10 animate__animated animate__veryfast overflow-hidden", {
        animate__fadeIn: !e.open
      }])
    }, [
      a("div", {
        ref_key: "modalRef",
        ref: u,
        id: "modal",
        class: m(["flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md animate__animated animate__veryfast", {
          animate__zoomIn: e.open
        }])
      }, [
        a("div", V, [
          a("label", G, [
            N(a("input", {
              ref_key: "inputRef",
              ref: g,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": o[0] || (o[0] = (t) => e.search = t),
              onKeydown: M(y, ["enter"]),
              id: "search",
              name: "search",
              placeholder: "Search for a coach or a systems..."
            }, null, 544), [
              [O, e.search]
            ]),
            a("button", {
              onClick: y,
              class: "hover:bg-neutral hover:text-white h-8 w-8 flex justify-center items-center rounded-md"
            }, [...j])
          ])
        ]),
        a("div", q, [
          h.value.length && e.search.length ? (c(), r("ul", U, [
            (c(!0), r(k, null, b(h.value, (t, n) => (c(), r("li", {
              class: m(["p-3 shadow-sm rounded-md hover:bg-neutral hover:text-white", [e.selectedIndex === n ? "bg-neutral text-white selected" : "bg-white"]]),
              key: `${t.slug}-tenant-${t.id}`
            }, [
              a("a", {
                class: "flex gap-2 justify-center",
                href: $(t.slug)
              }, [
                a("div", {
                  class: m(["p-3 flex-0", `bg-[${t.color}]`])
                }, _(t.emoji), 3),
                a("div", J, [
                  a("div", Z, [
                    a("p", null, _(t.name), 1),
                    a("div", F, [
                      (c(), r(k, null, b(5, (l) => a("input", {
                        type: "radio",
                        id: `${t.slug}-star-${l}`,
                        key: `${t.slug}-star-${l}`,
                        name: `${t.slug}-star-${l}`,
                        class: m(["mask mask-star", { "bg-white": e.selectedIndex === n }])
                      }, null, 10, P)), 64))
                    ])
                  ])
                ]),
                a("p", Q, [
                  a("span", null, _(t.reviews_count), 1),
                  t.reviews_count > 1 ? (c(), r("span", W, "Reviews")) : (c(), r("span", X, "Review"))
                ]),
                e.selectedIndex === n ? (c(), r("span", Y, "↩")) : p("", !0)
              ], 8, H)
            ], 2))), 128))
          ])) : p("", !0),
          e.search.length ? p("", !0) : (c(), r("div", ee, [...se])),
          !h.value.length && e.search.length ? (c(), r("div", oe, [
            a("span", ae, [
              x("No results for "),
              a("span", ne, _(`"${e.search}"`), 1)
            ])
          ])) : p("", !0)
        ]),
        le
      ], 2)
    ], 2)) : p("", !0);
  }
}, he = /* @__PURE__ */ A(ce, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  he as default
};
