import axios from "axios";
import url from "../../services/url";

export default{
    state: {
        user: null,
        msgAuth: "",
        tokenAccess: localStorage.getItem("user-token-access") || "",
        tokenRefresh: localStorage.getItem("user-token-refresh") || "",
    },
    actions: {
        async authRequest(ctx, user) {
            await axios.post(`${url}/api/users/auth`, user).then((resp) => {
                if (!resp.data.message) {
                    ctx.commit("authSuccess", resp.data.token);
                }
                ctx.commit("updateMessage", resp.data.message);
            }).catch((err) => {
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
        } 
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
        updateUser(state, user) {
            state.user = user;
        },
        setUnauthorized(state) {
            state.user = null;
            localStorage.removeItem("user-auth");
            localStorage.removeItem("user-token-access");
            localStorage.removeItem("user-token-refresh");
            state.tokenAccess = "";
            state.tokenRefresh = "";
        },
        authError(state, message) {
            state.message = message;
            localStorage.removeItem("user-token-access");
            localStorage.removeItem("user-token-refresh");
            state.tokenAccess = "";
            state.tokenRefresh = "";
        }
    },
    getters: {
        getMessage(state) {
            return state.msgAuth;
        },
        getUser(state) {
            return state.user;
        }
        
    }
}