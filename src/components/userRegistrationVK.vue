<template>
	<div>
		<v-form ref="form" lazy-validation>

            <p
				class="mt-6 mb-10 headline"
			>Введите дополнительные данные</p>
            
            <label>Дата рождения</label>
            <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="90%"
                :color="'#FFF'"
                
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        placeholder="ДД.ММ.ГГГГ"
                        :rules="rules.birthday"
                        hide-details="auto"                  
                        v-bind="attrs"
                        readonly
                        v-on="on"
                        required
                        outlined
                        class="mb-4"
                    ></v-text-field>
                </template>
                <v-date-picker
                    style="background-color: #004bd7"
                    header-color="secondary"
                    v-model="date"
                    :active-picker.sync="activePicker"
                    min="1950-01-01"
                    :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                    @change="save"
                    no-title
                ></v-date-picker>
            </v-menu>

            <label>Регион проживания</label>
            <v-select
                v-model="newUserVK.id_region"
                hide-details="auto"
                :items="this.getRegions"
                :item-text="item => `${item.name} (UTC +${item.time})`"
                :item-value="'id'"
                required
                outlined
                class="mb-4"
                color="#9196FF"
            ></v-select>

            <label>Логин</label>
            <v-text-field
                :rules="rules.login"
                v-model="newUserVK.login"
                hide-details="auto"
                required
                outlined
                class="mb-4"
                color="#9196FF"
			></v-text-field>

            <label>Email</label>
            <v-text-field
                v-model="newUserVK.email"
                :rules="rules.email"
                hide-details="auto"
                required
                outlined
                class="mb-6"
                color="#9196FF"
			></v-text-field>
            <!--
            <label>Пароль(не обязательно)</label>
            <v-text-field
                v-model="newUserVK.password"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                @click:append="showPass = !showPass"
                :rules="rules.password"
                hide-details="auto"
                outlined
                color="#9196FF"
			></v-text-field>
            -->
            <v-checkbox
                    label="Нажимая кнопку “Зарегистрироваться”, вы даете согласие на обработку персональных данных"
                    :rules="rules.checkbox"
                    required
                    hide-details="auto"
            ></v-checkbox>
                
            <v-btn
                @click="addUser"
                color="primary"
                large
                block
                class="my-8"
                :loading="logProgress"
            >Зарегистрироваться
            </v-btn>
		</v-form>
		
        <v-dialog
            v-model="dialog"
        >
            <alert-message :msg='msg' @clicked="dialog = false"></alert-message>
        </v-dialog>

	</div>
</template>

<script>
import AlertMessage from "./AlertMessage.vue";
import {mapActions, mapGetters} from "vuex";
export default {
    components: ([AlertMessage]),
	data: () => ({
        newUserVK: {
            fullname: "",
            gender: "m",
            birthday: null,
            id_region: 1,
            id_vk: 0,
            email: "",
            login: "",
            password: ""
        },
        dateFormatted: "",
        showPass: false,
        rules: {
            birthday: [ 
                v => !!v || "Введите дату рождения",
            ],
            email: [],
            login: [],
            checkbox: [
                v => !!v
            ],
            password: [
                v => /^[^'"`]+$/.test(v) || "Некорректный пароль",
                v => v.length >= 7 || "Пароль должен состоять как минимум из 7 символов",
            ],
        },

        activePicker: null,
        date: null,
        menu: false,
        logProgress: false,
        dialog: false,
        msg: {title: '', text: ''},
	}),
    
    watch: {
      menu (val) {
        val && setTimeout(() => (this.activePicker = 'YEAR'))
      },
      token () {
          console.log('CHANGED', this.token)
      }
    },
    computed: {
        ...mapGetters(["getRegions", "getLogins", "getEmails", "getUserVkData", "getUser", "updateMessageReg"]),
        
    },
    methods: {
        ...mapActions(["getRegionList", "getLoginList", "getEmailList","createUserVk", "checkAccess"]),
        parseDate(date) {
            if (!date) return null;
            const [year, month, day] = date.split('-');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        },
        save (date) {
            this.$refs.menu.save(date);
            this.newUserVK.birthday = date;
        },
        updateRules() {
            this.rules.birthday = [
                v => !!v || 'Введите дату рождения',
                v => (!isNaN(Date.parse(this.parseDate(v)))) || 'Некорректная дета',
                v => (Date.parse(this.parseDate(v)) !== "Invalid Date") || 'Некорректная дета',
            ];
            this.rules.email = [
                v => !!v || 'Введите email',
                v => /.+@.+/.test(v) || 'Некорректный email',
                v => !this.getEmails.find(obj => obj.email === v) || 'Данный email уже существует'
            ];
            this.rules.login = [
                v => !!v || 'Введите логин',
                v => /^[_.\w]+$/.test(v) || 'Некорректный логин',
                v => v.length <= 20 || 'Логин должен состоять не более чем из 20 символов',
                v => !this.getLogins.find(obj => obj.login === v) || 'Данный логин уже существует'
            ];
        },
        
        addUser() {
            if (this.$refs.form.validate()) {
                this.logProgress = true;
                this.createUserVk(this.newUserVK).then(() => {
                    if (localStorage.getItem("user-auth")) {
                        this.checkAccess().then(()=>{
                            this.$router.push({ name: 'start-prog'});
                        })
                    }
                    else {
                        this.logProgress = false;
                        this.msg = {title: 'Ошибка регистрации', text: this.getMessageReg},
                        this.dialog = true;
                        //alert(this.getMessageReg)
                    }
                })
            }
        },
        

        setVkData() {
            this.newUserVK.login = this.getUserVkData.username;
            this.newUserVK.fullname = this.getUserVkData.displayName;
            this.newUserVK.gender = this.getUserVkData.gender
            this.newUserVK.id_vk = this.getUserVkData.id;
        }
        

    },
    mounted() {
        this.getRegionList();
        this.getLoginList();
        this.getEmailList();
        this.updateRules();
    },
    created() {
        this.setVkData();
    }
}
</script>
	
<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

label {
    font-size: 14px;
}
.v-input--checkbox .v-label {
    font-size: 10pt;
}
div.v-picker__body {
  background-color: #004bd7 !important;
  color: white;
}
</style>