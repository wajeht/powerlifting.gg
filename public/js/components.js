import "./Users.js";

import axios from './axios.min.js';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const { createApp } = Vue;

const app = createApp();
app.component("Users", Users);
app.mount("#app");
