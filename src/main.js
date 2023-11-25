// import { createApp } from "vue";
// import { createPinia } from "pinia";
// import router from "./router";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fas } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// import "./axios";
// import "./style.css";
// import App from "./App.vue";
// import store from "./store";
// import storeAuth from "./store/auth.js";

// library.add(fas);
// const pinia = createPinia();
// const app = createApp(App);
// pinia.use(({ storeAuth }) => {
//   storeAuth.router = markRaw(router);
// });
// app.use(storeAuth)
// app.use(pinia);
// app.use(router);
// app.use(store);
// app.component("font-awesome-icon", FontAwesomeIcon);
// app.mount("#app"); 


import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./axios";
import "./style.css";
import App from "./App.vue";

const pinia = createPinia();
library.add(fas);
pinia.use(({ store }) => {
  store.router = markRaw(router);
});
const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(pinia);
app.use(router);

app.mount("#app");