import './axios.min.js'; // 1.6.8
import './Users.js';

  window.axios = axios;

  window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  const { createApp } = Vue;

  const app = createApp();

  app.component("Users", Users);

  app.mount("#app");
