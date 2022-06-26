import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from "./store"

Vue.config.productionTip = false;

document.addEventListener("deviceready", onDeviceReady, false);

    function onBackKeyDown() {
        console.log('Backbutton key pressed');
    }
    
function onDeviceReady() {
  document.addEventListener("backbutton", onBackKeyDown, false);
  new Vue({
    store,
    vuetify,
    router,
    render: h => h(App)
  }).$mount('#app');
}