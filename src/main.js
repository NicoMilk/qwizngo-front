import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueMoment from "vue-moment";
import moment from "moment";
import VueScrollTo from "vue-scrollto";

require("moment/locale/fr");

Vue.use(VueScrollTo)

Vue.use(VueMoment, {
  moment,
});
Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
