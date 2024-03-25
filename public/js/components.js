import "./Tenants.js";

const { createApp } = Vue;

const app = createApp();
app.component("Tenants", Tenants);
app.mount("#app");
