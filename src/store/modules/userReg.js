import axios from "axios";
import url from "../../services/url";

export default{
    state: {
        logins: [{login: ""}],
        emails: [{email: ""}],
        userVK: {},
        tokenVk: null,
        match: null,
        msgReg: "",
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
        
        async createUserVk(ctx, newUser) {
            await axios.post(`${url}/api/vk-auth/add-user`, newUser).then((res) => {
                if (res.data.name === "Success") {
                    ctx.commit("removeTokenVk");
                    ctx.commit("authSuccess", res.data.token);
                } else {
                    ctx.commit("updateMessageReg", res.data.text)
                }
            }).catch((err) => {
                ctx.commit("updateMessageReg", err.data);
            });
        },

        async checkUserVk(ctx, tokenVk) {
            ctx.state.tokenVk = tokenVk;
            if (ctx.state.tokenVk) {
                let token = {value: ctx.state.tokenVk};
                await axios.post(`${url}/api/vk-auth/decode-token-vk`, token).then((res) => {
                    if (res.data.name === "Success") {
                        ctx.commit("updateUserVK", res.data.user);
                    } else {
                        ctx.commit("updateMessageReg", res.data.text);
                        ctx.commit("removeTokenVk");
                    }
                })
            } else {
                ctx.commit("updateUserVK", null);
            }
        },
        async checkUserVkInDb(ctx, id) {
            let user = {id: id};
            await axios.post(`${url}/api/vk-auth/user-in-db`, user).then((res) => {
                if (res.data.name === "Success") {
                    if (res.data.match) {
                        console.log('True');
                        ctx.commit("authSuccess", res.data.token);
                        ctx.commit("removeTokenVK");
                        ctx.commit("updateMatchVK", true);
                    } else {
                        console.log('False');
                        ctx.dispatch("unauthorized");
                        ctx.commit("updateMatchVK", false);
                    }
                }
            })
        }

    },
    mutations: {
        updateLogins(state, list) {
            state.logins = list;
        },

        updateEmails(state, list) {
            state.emails = list;
        },
        updateUserVK(state, data) {
            state.userVK = data;
        },
        removeTokenVK(state) {
            state.tokenVk = null;
        },
        updateMatchVK(state, value) {
            state.match = value;
        },
        updateMessageReg(state, err) {
            state.msgReg = err
        }
    },
    getters: {
        getLogins(state) {
            return state.logins;
        },
        getEmails(state) {
            return state.emails;
        },
        getMatchVK(state) {
            
            return state.match
        },
        getUserVkData(state) {
            return state.userVK;
        },
        getMessageReg(state) {
            return state.msgReg;
        }
    }
    
}