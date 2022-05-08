import Vue from "vue";
import Vuex from "vuex";
import userReg from "./modules/userReg";
import userAuth from "./modules/userAuth";
import region from "./modules/region";
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        userAuth, userReg, region
    }
})