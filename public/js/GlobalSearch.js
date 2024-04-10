import { ref as g, reactive as C, nextTick as v, onMounted as R, computed as L, watch as B, openBlock as c, createElementBlock as r, normalizeClass as m, createElementVNode as a, withDirectives as N, withKeys as M, vModelText as O, Fragment as b, renderList as k, toDisplayString as w, createCommentVNode as p, createTextVNode as x } from "vue";
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
], -1), q = [
  K
], U = { class: "px-5 py-4 max-h-[335px] overflow-y-scroll bg-[#E8E9EA]" }, j = {
  key: 0,
  class: "flex flex-col gap-2"
}, H = ["href"], J = { class: "flex-1 h-full" }, Z = { class: "flex flex-col gap-1" }, F = { class: "rating rating-xs" }, P = ["id", "name"], Q = {
  key: 0,
  class: "flex-0"
}, W = {
  key: 1,
  class: "text-center text-neutral-400 text-sm py-10"
}, X = /* @__PURE__ */ a("span", { class: "text-sm" }, "No recent searches", -1), Y = [
  X
], ee = {
  key: 2,
  class: "text-center text-neutral-400 text-sm py-10"
}, te = { class: "text-sm" }, oe = { class: "font-bold" }, se = /* @__PURE__ */ a("div", { class: "border-t border-1 border-solid text-center p-5" }, [
  /* @__PURE__ */ x(" press "),
  /* @__PURE__ */ a("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ x(" to close. ")
], -1), ae = {
  __name: "GlobalSearch",
  setup(ne) {
    const d = g(null), u = g(null), e = C({
      search: "",
      data: [],
      open: !1,
      selectedIndex: null
    }), _ = g(null);
    document.addEventListener("click", (o) => {
      const s = document.getElementById("modal");
      s && !s.contains(o.target) && (d.value || u.value) && (d.value.classList.add("animate__fadeOut"), u.value.classList.add("animate__zoomOut"), setTimeout(() => {
        e.open = !1, e.search = "", e.selectedIndex = null;
      }, 250));
    }), window.addEventListener("keydown", function(o) {
      if (o.ctrlKey && o.key === "k" && (e.open = !0, v(() => _.value.focus())), o.metaKey && o.key === "k" && (e.open = !0, v(() => _.value.focus())), o.key === "Escape" && (d.value || u.value) && (d.value.classList.add("animate__fadeOut"), u.value.classList.add("animate__zoomOut"), setTimeout(() => {
        e.open = !1, e.search = "", e.selectedIndex = null;
      }, 250)), e.open && ["ArrowUp", "ArrowDown"].includes(o.key)) {
        o.preventDefault();
        const t = e.selectedIndex !== null ? e.selectedIndex : -1;
        o.key === "ArrowUp" ? (e.selectedIndex = Math.max(t - 1, 0), s()) : o.key === "ArrowDown" && (e.selectedIndex = Math.min(t + 1, h.value.length - 1), s());
      }
      function s() {
        const t = document.querySelector(".selected");
        if (t) {
          const n = t.parentElement.parentElement, l = t.getBoundingClientRect(), i = n.getBoundingClientRect(), f = t.offsetHeight + 216;
          l.bottom > i.bottom ? n.scrollBy(0, f) : l.top < i.top && n.scrollBy(0, -f);
        }
      }
      if (o.key === "Enter" && e.selectedIndex !== null) {
        o.preventDefault();
        const t = h.value[e.selectedIndex].slug;
        I(t);
      }
    });
    function y() {
      if (e.search === "")
        return;
      const { protocol: o, hostname: s } = window.location, t = "current_page=1&per_page=25&sort=asc";
      if (s.split(".").length === 2) {
        window.location.href = `${window.location.origin}/tenants?q=${e.search}&${t}`;
        return;
      }
      if (s.split(".").length === 3) {
        const [n, l, i] = s.split(".");
        window.location.href = `${o}//${l}.${i}/tenants?q=${e.search}&${t}`;
        return;
      }
    }
    R(async () => {
      !S() || D() ? e.data = await T() : e.data = E();
    });
    const h = L(() => e.data.filter((o) => o.name.toLowerCase().includes(e.search.toLowerCase())));
    B(
      () => e.search,
      (o, s) => {
        o !== s && (e.selectedIndex = null);
      }
    );
    function $(o) {
      const { protocol: s, hostname: t } = window.location;
      return `${s}//${o}.${t}`;
    }
    function I(o) {
      const { protocol: s, hostname: t } = window.location;
      if (t.split(".").length === 2) {
        const n = `${s}//${o}.${t}`;
        window.location.href = n;
      }
      if (t.split(".").length === 3) {
        const [n, l, i] = t.split("."), f = `${s}//${o}.${l}.${i}`;
        window.location.href = f;
      }
    }
    function S() {
      return localStorage.getItem("cachedData") !== null && localStorage.getItem("cacheTimestamp") !== null;
    }
    function D() {
      const o = (/* @__PURE__ */ new Date()).getTime(), s = parseInt(localStorage.getItem("cacheTimestamp")), t = 24 * 60 * 60 * 1e3;
      return o - s > t;
    }
    function E() {
      return JSON.parse(localStorage.getItem("cachedData"));
    }
    async function T() {
      try {
        const s = (await z.get("/api/tenants")).data.data;
        return localStorage.setItem("cachedData", JSON.stringify(s)), localStorage.setItem("cacheTimestamp", (/* @__PURE__ */ new Date()).getTime().toString()), s;
      } catch (o) {
        return console.error("Error fetching data:", o), [];
      }
    }
    return (o, s) => e.open ? (c(), r("div", {
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
              ref: _,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": s[0] || (s[0] = (t) => e.search = t),
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
            }, [...q])
          ])
        ]),
        a("div", U, [
          h.value.length && e.search.length ? (c(), r("ul", j, [
            (c(!0), r(b, null, k(h.value, (t, n) => (c(), r("li", {
              class: m(["p-3 shadow-sm rounded-md hover:bg-neutral hover:text-white", [e.selectedIndex === n ? "bg-neutral text-white selected" : "bg-white"]]),
              key: `${t.slug}-tenant-${t.id}`
            }, [
              a("a", {
                class: "flex gap-2",
                href: $(t.slug)
              }, [
                a("div", {
                  class: m(["p-3 flex-0", `bg-[${t.color}]`])
                }, w(t.emoji), 3),
                a("div", J, [
                  a("div", Z, [
                    a("p", null, w(t.name), 1),
                    a("div", F, [
                      (c(), r(b, null, k(5, (l) => a("input", {
                        type: "radio",
                        id: `${t.slug}-star-${l}`,
                        key: `${t.slug}-star-${l}`,
                        name: `${t.slug}-star-${l}`,
                        class: m(["mask mask-star", { "bg-white": e.selectedIndex === n }])
                      }, null, 10, P)), 64))
                    ])
                  ])
                ]),
                e.selectedIndex === n ? (c(), r("span", Q, "↩")) : p("", !0)
              ], 8, H)
            ], 2))), 128))
          ])) : p("", !0),
          e.search.length ? p("", !0) : (c(), r("div", W, [...Y])),
          !h.value.length && e.search.length ? (c(), r("div", ee, [
            a("span", te, [
              x("No results for "),
              a("span", oe, w(`"${e.search}"`), 1)
            ])
          ])) : p("", !0)
        ]),
        se
      ], 2)
    ], 2)) : p("", !0);
  }
}, ie = /* @__PURE__ */ A(ae, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  ie as default
};
