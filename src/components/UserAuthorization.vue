<template>
    <div>
        <p
            class="font-weight-bold black--text text-h5 mb-6"
        >Авторизация</p>
        <v-form ref="form">
            <v-text-field
                v-model="user.login"
                label="Email или логин"
                :rules="rules.login"
                hide-details="auto"
                required
                outlined
            ></v-text-field>
            <v-text-field
                v-model="user.password"
				label="Пароль"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                @click:append="showPass = !showPass"
                :rules="rules.password"
                hide-details="auto"
                required
                outlined
			></v-text-field>
            <v-btn
                color="primary"
                @click="authUser"
                large
            >
                Войти
            </v-btn>
        </v-form>
    </div>
	
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    data: () => ({
        user: {
            login: "",
            password: ""
        },
        rules: {
            login: [
                v => !!v || "Введите логин",
                v => /^[_.\-@\w]+$/.test(v) || 'Некорректный логин',
            ],
            password: [
                v => !!v || "Введите пароль"
            ]
        },
        showPass: false,

    }),
    computed: {
        ...mapGetters(["getMessage, getUser"])
    },
    methods: {
        ...mapActions(["authRequest", "checkAccess"]),
        authUser() {
            if (this.$refs.form.validate()) {
                this.authRequest(this.user).then(() => {
                    if (localStorage.getItem("user-auth")) {
                        this.$router.push({name: "user"})
                    } else {
                        alert(this.getMessage);
                    }
                })
                
            }
        }
    }  
}
</script>
	
<style>
	
</style>