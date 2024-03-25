import "./Users.js";

const { createApp } = Vue;

const app = createApp();
app.component("Users", Users);
app.mount("#app");
