import { ref as g, reactive as T, nextTick as v, onMounted as R, computed as L, watch as B, openBlock as c, createElementBlock as r, normalizeClass as m, createElementVNode as s, withDirectives as N, withKeys as M, vModelText as O, Fragment as b, renderList as k, toDisplayString as w, createCommentVNode as p, createTextVNode as x } from "vue";
import z from "axios";
import { _ as A } from "./_plugin-vue_export-helper.js";
const V = { class: "p-5 border-b border-1 border-solid" }, G = { class: "input input-bordered flex items-center gap-2" }, K = /* @__PURE__ */ s("svg", {
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
], -1), q = [
  K
], U = { class: "px-5 py-4 max-h-[335px] overflow-y-scroll bg-[#E8E9EA]" }, j = {
  key: 0,
  class: "flex flex-col gap-2"
}, H = ["href"], J = { class: "flex-1 h-full" }, Z = { class: "flex flex-col gap-1" }, F = { class: "rating rating-xs" }, P = ["name"], Q = {
  key: 0,
  class: "flex-0"
}, W = {
  key: 1,
  class: "text-center text-neutral-400 text-sm py-10"
}, X = /* @__PURE__ */ s("span", { class: "text-sm" }, "No recent searches", -1), Y = [
  X
], ee = {
  key: 2,
  class: "text-center text-neutral-400 text-sm py-10"
}, te = { class: "text-sm" }, oe = { class: "font-bold" }, ae = /* @__PURE__ */ s("div", { class: "border-t border-1 border-solid text-center p-5" }, [
  /* @__PURE__ */ x(" press "),
  /* @__PURE__ */ s("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ x(" to close. ")
], -1), se = {
  __name: "GlobalSearch",
  setup(ne) {
    const d = g(null), u = g(null), e = T({
      search: "",
      data: [],
      open: !1,
      selectedIndex: null
    }), _ = g(null);
    document.addEventListener("click", (t) => {
      const a = document.getElementById("modal");
      a && !a.contains(t.target) && (d.value || u.value) && (d.value.classList.add("animate__fadeOut"), u.value.classList.add("animate__zoomOut"), setTimeout(() => {
        e.open = !1, e.search = "", e.selectedIndex = null;
      }, 250));
    }), window.addEventListener("keydown", function(t) {
      if (t.ctrlKey && t.key === "k" && (e.open = !0, v(() => _.value.focus())), t.metaKey && t.key === "k" && (e.open = !0, v(() => _.value.focus())), t.key === "Escape" && (d.value || u.value) && (d.value.classList.add("animate__fadeOut"), u.value.classList.add("animate__zoomOut"), setTimeout(() => {
        e.open = !1, e.search = "", e.selectedIndex = null;
      }, 250)), e.open && ["ArrowUp", "ArrowDown"].includes(t.key)) {
        t.preventDefault();
        const o = e.selectedIndex !== null ? e.selectedIndex : -1;
        t.key === "ArrowUp" ? (e.selectedIndex = Math.max(o - 1, 0), a()) : t.key === "ArrowDown" && (e.selectedIndex = Math.min(o + 1, h.value.length - 1), a());
      }
      function a() {
        const o = document.querySelector(".selected");
        if (o) {
          const n = o.parentElement.parentElement, l = o.getBoundingClientRect(), i = n.getBoundingClientRect(), f = o.offsetHeight + 216;
          l.bottom > i.bottom ? n.scrollBy(0, f) : l.top < i.top && n.scrollBy(0, -f);
        }
      }
      if (t.key === "Enter" && e.selectedIndex !== null) {
        t.preventDefault();
        const o = h.value[e.selectedIndex].slug;
        $(o);
      }
    });
    function y() {
      if (e.search === "")
        return;
      const { protocol: t, hostname: a } = window.location, o = "current_page=1&per_page=25&sort=asc";
      if (a.split(".").length === 2) {
        window.location.href = `${window.location.origin}/tenants?q=${e.search}&${o}`;
        return;
      }
      if (a.split(".").length === 3) {
        const [n, l, i] = a.split(".");
        window.location.href = `${t}//${l}.${i}/tenants?q=${e.search}&${o}`;
        return;
      }
    }
    R(async () => {
      !S() || D() ? e.data = await C() : e.data = E();
    });
    const h = L(() => e.data.filter((t) => (t.name + " " + t.slug).toLowerCase().includes(e.search.toLowerCase())));
    B(
      () => e.search,
      (t, a) => {
        t !== a && (e.selectedIndex = null);
      }
    );
    function I(t) {
      const { protocol: a, hostname: o } = window.location;
      return `${a}//${t}.${o}`;
    }
    function $(t) {
      const { protocol: a, hostname: o } = window.location;
      if (o.split(".").length === 2) {
        const n = `${a}//${t}.${o}`;
        window.location.href = n;
      }
      if (o.split(".").length === 3) {
        const [n, l, i] = o.split("."), f = `${a}//${t}.${l}.${i}`;
        window.location.href = f;
      }
    }
    function S() {
      return localStorage.getItem("cachedData") !== null && localStorage.getItem("cacheTimestamp") !== null;
    }
    function D() {
      const t = (/* @__PURE__ */ new Date()).getTime(), a = parseInt(localStorage.getItem("cacheTimestamp")), o = 24 * 60 * 60 * 1e3;
      return t - a > o;
    }
    function E() {
      return JSON.parse(localStorage.getItem("cachedData"));
    }
    async function C() {
      try {
        const a = (await z.get("/api/tenants")).data.data;
        return localStorage.setItem("cachedData", JSON.stringify(a)), localStorage.setItem("cacheTimestamp", (/* @__PURE__ */ new Date()).getTime().toString()), a;
      } catch (t) {
        return console.error("Error fetching data:", t), [];
      }
    }
    return (t, a) => e.open ? (c(), r("div", {
      key: 0,
      ref_key: "backdropRef",
      ref: d,
      id: "backdrop",
      class: m(["fixed h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10 animate__animated animate__veryfast overflow-hidden", {
        animate__fadeIn: !e.open
      }])
    }, [
      s("div", {
        ref_key: "modalRef",
        ref: u,
        id: "modal",
        class: m(["flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md animate__animated animate__veryfast", {
          animate__zoomIn: e.open
        }])
      }, [
        s("div", V, [
          s("label", G, [
            N(s("input", {
              ref_key: "inputRef",
              ref: _,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": a[0] || (a[0] = (o) => e.search = o),
              onKeydown: M(y, ["enter"]),
              id: "search",
              name: "search",
              placeholder: "Search for a coach or a systems..."
            }, null, 544), [
              [O, e.search]
            ]),
            s("button", {
              onClick: y,
              class: "hover:bg-neutral hover:text-white h-8 w-8 flex justify-center items-center rounded-md"
            }, [...q])
          ])
        ]),
        s("div", U, [
          h.value.length && e.search.length ? (c(), r("ul", j, [
            (c(!0), r(b, null, k(h.value, (o, n) => (c(), r("li", {
              class: m(["p-3 shadow-sm rounded-md hover:bg-neutral hover:text-white", [e.selectedIndex === n ? "bg-neutral text-white selected" : "bg-white"]]),
              key: o.id
            }, [
              s("a", {
                class: "flex gap-2",
                href: I(o.slug)
              }, [
                s("div", {
                  class: m(["p-3 flex-0", `bg-[${o.color}]`])
                }, w(o.emoji), 3),
                s("div", J, [
                  s("div", Z, [
                    s("p", null, w(o.name), 1),
                    s("div", F, [
                      (c(), r(b, null, k(5, (l) => s("input", {
                        type: "radio",
                        key: l,
                        name: `rating-${n}`,
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
            s("span", te, [
              x("No results for "),
              s("span", oe, w(`"${e.search}"`), 1)
            ])
          ])) : p("", !0)
        ]),
        ae
      ], 2)
    ], 2)) : p("", !0);
  }
}, ie = /* @__PURE__ */ A(se, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  ie as default
};
