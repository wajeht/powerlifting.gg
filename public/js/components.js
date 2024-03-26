import './vue.global.prod.min.js';
import axios from './axios.min.js';

import "./Users.js";

const { createApp } = Vue;

const app = createApp();
app.config.globalProperties.$axios = axios;

app.component("Users", Users);
app.mount("#app");
