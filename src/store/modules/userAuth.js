import axios from "axios";
import url from "../../services/url";


export default{
    state: {
        user: null,
        msgAuth: "ok",
        tokenAccess: localStorage.getItem("user-token-access") || "",
        tokenRefresh: localStorage.getItem("user-token-refresh") || "",
        connState: navigator.connection.type,
    },
    actions: {
        async authRequest(ctx, user) {
            await axios.post(`${url}/api/users/auth`, user).then((resp) => {
                if (!resp.data.message) {
                    ctx.commit("authSuccess", resp.data.token);
                }
                ctx.commit("updateMessage", resp.data.message);
            }).catch((err) => {
                console.log('auth Error');
                ctx.commit("updateMessage", err.data);
            });
        },
        async checkAccess(ctx) {
            if (ctx.state.tokenAccess) {
                await axios.post(`${url}/api/users/verify-token-access`, {access: ctx.state.tokenAccess}).then((res) => {
                    if (res.data.name === "Success") {
                        ctx.commit("updateUser", res.data.user);
                    } else {
                        ctx.dispatch("checkTokenRefresh");
                    }
                }).catch((err) => {
                    console.log(err);
                    ctx.commit("authError", err.data);
                })
            } else {
                ctx.dispatch("checkTokenRefresh");
            }
        },
        async checkTokenRefresh(ctx) {
            if (ctx.state.tokenRefresh) {
                await axios.post(`${url}/api/users/verify-token-refresh`, {refresh: ctx.state.tokenRefresh}).then((res) => {
                    if (res.data.name === "Success") {
                        let token = {access: res.data.token.access, refresh: res.data.token.refresh};
                        ctx.commit("authSuccess", token);
                        ctx.commit("updateUser", res.data.user);
                    } else {
                        ctx.dispatch("unauthorized");
                    }
                }).catch((err) => {
                    console.log(err);
                    ctx.commit("authError", err.data);
                })
            } else {
                ctx.dispatch("unauthorized");
            }
        },
        async unauthorized(ctx) {
            ctx.commit("setUnauthorized");
        },

    },
    mutations: {
        authSuccess(state, token) {
            localStorage.setItem("user-auth", 1);
            if (token) {
                state.tokenAccess = token.access;
                state.tokenRefresh = token.refresh;
                localStorage.setItem("user-token-access", token.access);
                localStorage.setItem("user-token-refresh", token.refresh);
                console.log(`access ${state.tokenAccess}, refresh ${state.tokenRefresh}`);
            }
        },
        updateMessage(state, message) {
            state.msgAuth = message;
        },

        checkPremium(state) {
            if (state.user.pro_last_datetime) {
                let premium_date = new Date(state.user.pro_last_datetime);
                let curr_date = new Date();
                if (curr_date>premium_date) {
                    state.user.pro_last_datetime = null;
                }
            }
        },

        updateUser(state, user) {
            state.user = user;
            this.commit("checkPremium");
            localStorage.setItem("user", JSON.stringify(state.user));
            console.log("user updated", JSON.stringify(state.user));
        },
        setUnauthorized(state) {
            state.user = null;
            localStorage.removeItem("user-auth");
            localStorage.removeItem("user-token-access");
            localStorage.removeItem("user-token-refresh");
            localStorage.removeItem("user");
            localStorage.removeItem("program");
            localStorage.removeItem("schedule");
            localStorage.removeItem("diet");
            localStorage.removeItem("personal-foods");            
            localStorage.removeItem("rations");
            localStorage.removeItem("diary");
            state.tokenAccess = "";
            state.tokenRefresh = "";
        },
        authError(state, message) {
            state.message = message;
            state.user = null;
            localStorage.removeItem("user-auth");
            localStorage.removeItem("user-token-access");
            localStorage.removeItem("user-token-refresh");
            localStorage.removeItem("user");
            localStorage.removeItem("program");
            localStorage.removeItem("schedule");
            localStorage.removeItem("diet");
            localStorage.removeItem("personal-foods");
            localStorage.removeItem("rations");
            localStorage.removeItem("diary");
            state.tokenAccess = "";
            state.tokenRefresh = "";
        },


    },
    getters: {
        getMessage(state) {
            return state.msgAuth;
        },
        getUser(state) {
            return state.user;
        },
        getConnState(state) {
            return state.connState;
        }
        
    }
}