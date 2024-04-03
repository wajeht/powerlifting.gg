import { reactive as l, computed as i, onMounted as u, openBlock as o, createElementBlock as r, Fragment as _, renderList as d, createElementVNode as s, toDisplayString as t } from "vue";
import m from "axios";
import { _ as p } from "./_plugin-vue_export-helper.js";
const f = { class: "flex flex-col gap-5" }, h = ["href"], g = { class: "font-bold" }, x = { class: "font-bold" }, b = {
  __name: "Users",
  setup(v) {
    const n = l({
      users: []
    }), c = i(() => window.location.origin);
    return u(async () => {
      const { data: a } = await m.get("/api/users");
      n.users = a.data;
    }), (a, k) => (o(), r("div", f, [
      (o(!0), r(_, null, d(n.users, (e) => (o(), r("a", {
        href: `${c.value}/user/${e.username}`,
        key: `user-key-${e.id}`,
        class: "bg-neutral-200 hover:bg-neutral-300 p-5 rounded-md"
      }, [
        s("h4", g, t(e.emoji), 1),
        s("h4", x, t(e.username), 1),
        s("p", null, t(e.email), 1),
        s("p", null, t(e.role), 1)
      ], 8, h))), 128))
    ]));
  }
}, $ = /* @__PURE__ */ p(b, [["__file", "/usr/src/app/src/web/components/Users/Users.vue"]]);
export {
  $ as default
};
