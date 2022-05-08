import axios from "axios";
import url from "../../services/url";

export default{
    state: {
        logins: [{login: ""}],
        emails: [{email: ""}],
    },
    actions: {
        async getLoginList(ctx) {
            const res = await axios.get(`${url}/api/users/get-logins`);
            ctx.commit("updateLogins", res.data);
        },

        async getEmailList(ctx) {
            const res = await axios.get(`${url}/api/users/get-emails`);
            ctx.commit("updateEmails", res.data);
        },

        async createUser(ctx, newUser) {
            await axios.post(`${url}/api/users/add-user-mobile`, newUser).then((res) => {
                if (res.data.name === "Success") {
                    alert(res.data.name);
                }
            });
        },
    },
    mutations: {
        updateLogins(state, list) {
            state.logins = list;
        },

        updateEmails(state, list) {
            state.emails = list;
        },
    },
    getters: {
        getLogins(state) {
            return state.logins;
        },
        getEmails(state) {
            return state.emails;
        }
    }
    
}