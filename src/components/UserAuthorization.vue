<template>
    <div>
        <div>
            <v-icon class="mb-10"
                @click="$router.push({ name: 'start'}).catch(err => {})"
            >
                mdi-arrow-left
            </v-icon>
        </div>
        <p
            class="headline"
        >Авторизация</p>

        <v-form ref="form">

            <label>Email или логин</label>
            <v-text-field class="uu"
                v-model="user.login"
                :rules="rules.login"
                hide-details="auto"
                required
                outlined
                color="#9196FF"
            ></v-text-field>

            <label>Пароль</label>
            <v-text-field
                v-model="user.password"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                @click:append="showPass = !showPass"
                :rules="rules.password"
                hide-details="auto"
                required
                outlined
                color="#9196FF"
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
        ...mapGetters(["getMessage", "getUser"])
    },
    methods: {
        ...mapActions(["authRequest", "checkAccess"]),

        async authUser() {
            if (this.$refs.form.validate()) {
                this.authRequest(this.user).then( () => { 
                    
                    if (localStorage.getItem("user-auth")) {
                        this.checkAccess().then(() => {
                            if (this.getUser) {
                                localStorage.setItem("user", JSON.stringify(this.getUser));
                                this.$router.push({name: "user"});
                            }
                            else {
                                alert(this.getMessage);
                            }
                        })
                        
                    } else {
                        if (this.getMessage) {
                            this.user.password = "";
                            alert("Проверьте правильность логина или пароля");
                        }
                    }
                })
                
            }
        }
    }  
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";


</style>