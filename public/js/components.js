import "./Tenants.js?v=0.2";

const { createApp } = Vue;

const app = createApp();
app.component("Tenants", Tenants);
app.mount("#app");
