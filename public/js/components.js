import "./HelloWorld.vue";

const { createApp } = Vue;

const app = createApp();
app.component("hello-world", HelloWorld);
app.mount("#app");
