<template>
    <div>
        <div v-if="load" class="load">
            <v-progress-circular 
                :width="4"
                :size="40"
                indeterminate
                color="#004BD7"
            ></v-progress-circular>
        </div>
        <div v-else>
            <div>
            <img
                class="mt-8" 
                :width=54
                @click="$router.push({ name: 'start'}).catch(err => {})"
                :src="require('@/assets/img/png/arrow-back--white1.png')">
        </div>
        <p
            class="mt-1 mb-10 headline"
        >Авторизация</p>

        <v-form ref="form">

            <label>Email или логин</label>
            <v-text-field
                v-model="user.login"
                :rules="rules.login"
                hide-details="auto"
                required
                outlined
                color="#9196FF"
                class="mb-3"
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
                class="mb-6"
			></v-text-field>
            <v-btn
                color="primary"
                @click="authUser"
                large
                :loading="logProgress"
            >
                Войти
            </v-btn>
        </v-form>
        </div>

        <v-dialog
            v-model="dialog"
        >
            <alert-message :msg='msg' @clicked="dialog = false"></alert-message>
        </v-dialog>

    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AlertMessage from "./AlertMessage.vue";
export default {
    components: {AlertMessage},
    data: () => ({
        user: {
            login: "",
            password: ""
        },
        logProgress: false,
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
        load: false,
        dialog: false,
        msg: {title: '', text: ''},
    }),
    computed: {
        ...mapGetters(["activeProgramStatus","getMessage", "getUser", "programData"])
    },
    methods: {
        ...mapActions(["checkActiveProgram","authRequest", "checkAccess", "showProgram", "initSchedule"]),

        async authUser() {
            if (this.$refs.form.validate()) {
                this.logProgress = true;
                await this.authRequest(this.user).then( () => { 
                    if (localStorage.getItem("user-auth")) {
                        this.checkUserData();
                    } else {
                        if (this.getMessage) {
                            this.user.password = "";
                            this.logProgress = false;
                            this.msg = {title: 'Ошибка входа', text: 'Проверьте правильность логина или пароля'},
                            this.dialog = true;
                        }
                    }
                })
                
            }
        },

        checkUserData(){
            this.checkAccess().then(() => {
                if (this.getUser) {
                    this.checkUserProgram();
                }
                else {
                    this.msg = {title: 'Ошибка входа', text: this.getMessage},
                    this.logProgress = false;
                    this.dialog = true;
                }
            })
        },

        async checkUserProgram() {
            this.checkActiveProgram(this.getUser.id).then(() =>{
                if (!this.activeProgramStatus) {
                    this.$router.push({ name: 'start-prog'});
                }
                else {
                    //скачать программу пользователя
                    this.showProgram(this.getUser).then(() => {
                        this.load = true;
                        this.initSchedule().then(() => {
                            this.$router.push({name: "main"});
                        })
                    });
                    
                }
            })
        },

    }  
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.load {
    text-align: center;
    margin-top: 40vh !important;
}
</style>