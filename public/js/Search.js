import { onMounted as t, openBlock as o, createElementBlock as c, createElementVNode as e } from "vue";
import { _ as s } from "./_plugin-vue_export-helper.js";
const r = { class: "flex gap-1 w-full items-center justify-center" }, n = /* @__PURE__ */ e("input", {
  type: "text",
  placeholder: "Search for a coach or a system...",
  class: "input input-bordered w-full max-w-[18rem]"
}, null, -1), a = /* @__PURE__ */ e("button", { class: "btn btn-neutral" }, "Search", -1), l = [
  n,
  a
], _ = {
  __name: "Search",
  setup(p) {
    return t(() => {
      console.log("xxxx"), console.log("xxxx");
    }), (u, i) => (o(), c("div", r, [...l]));
  }
}, m = /* @__PURE__ */ s(_, [["__file", "/usr/src/app/src/web/components/Search/Search.vue"]]);
export {
  m as default
};
