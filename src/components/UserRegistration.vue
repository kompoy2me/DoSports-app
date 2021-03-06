<template>
	<div>
		<v-form ref="form" lazy-validation>
            <img
                class="mt-8 mb-2" 
                :width=54
                @click="$router.push({ name: 'start'}).catch(err => {})"
                :src="require('@/assets/img/png/arrow-back--white1.png')">
            <p
				class="mt-1 mb-10 headline"
			>Регистрация</p>

            <label>ФИО</label>
			<v-text-field
                class="mb-4"
                v-model="newUser.fullname"
                color="#9196FF"
                :rules="rules.fullname"
                hide-details="auto"
                required
                outlined
			></v-text-field>

			<label>Пол</label>
			<v-radio-group
                class="mt-0 mb-4"
                hide-details="auto"
                v-model="newUser.gender"
                row
            >
				<v-radio
					label="Мужской"
					value="m"
				></v-radio>
				<v-radio
					label="Женский"
					value="f"
				></v-radio>
			</v-radio-group>
            
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
                v-model="newUser.id_region"
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
                v-model="newUser.login"
                hide-details="auto"
                required
                outlined
                class="mb-4"
                color="#9196FF"
			></v-text-field>

            <label>Email</label>
            <v-text-field
                v-model="newUser.email"
                :rules="rules.email"
                hide-details="auto"
                required
                outlined
                class="mb-4"
                color="#9196FF"
			></v-text-field>

            <label>Пароль</label>
            <v-text-field
                v-model="newUser.password"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                @click:append="showPass = !showPass"
                :rules="rules.password"
                hide-details="auto"
                required
                outlined
                class="mb-8"
                color="#9196FF"
			></v-text-field>

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
                :loading="this.regProgress"
            >Зарегистрироваться
            </v-btn>
		</v-form>
		<v-dialog
            v-model="dialog">
            <alert-message :msg="msg" @clicked="dialog = false; $router.push({ name: 'authorization'})"></alert-message>
        </v-dialog>
	</div>
</template>

<script>
import axios from "axios";
import url from "@/services/url";
import AlertMessage from "./AlertMessage.vue";
import {mapActions, mapGetters} from "vuex";
export default {
    components: {AlertMessage},
	data: () => ({
        newUser: {
            fullname: "",
            gender: "m",
            birthday: null,
            id_region: 1,
            email: "",
            login: "",
            password: "",
        },
        dateFormatted: "",
        showPass: false,
        regProgress: false,
        dialog: false,
        msg: {},

        rules: {
            fullname: [
                v => !!v ||"Введите ФИО",
                v => /^[а-яА-Я ]+$/.test(v) || "Некорректный ФИО",
                v => v.trim().split(" ").length >= 2 || "Поле должно состоять как минимум из фамилии и имени",
                v => v.length <= 50 || "ФИО должно состоять не более чем из 50 символов"
            ],
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
	}),
    watch: {
      menu (val) {
        val && setTimeout(() => (this.activePicker = 'YEAR'))
      },
    },
    computed: {
        ...mapGetters(["getRegions", "getLogins", "getEmails"])
    },
    methods: {
        ...mapActions(["getRegionList", "getLoginList", "getEmailList"]),

        parseDate(date) {
            if (!date) return null;
            const [year, month, day] = date.split('-');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        },

        save (date) {
            this.$refs.menu.save(date);
            this.newUser.birthday = date;
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
                this.regProgress = true;
                this.createUser(this.newUser);
            }
        },

        regUser() {
            console.log(this.newUser.fullname,
            this.newUser.gender,
            this.newUser.birthday,
            this.newUser.id_region,
            this.newUser.email,
            this.newUser.login,
            this.newUser.password)
        },

        async createUser(newUser) {
            await axios.post(`${url}/api/users/add-user-mobile`, newUser).then((res) => {
                if (res.data.name === "Success") {
                    //alert(res.data.name);
                    this.msg = {title: 'Регистрация успешна!', text: `Для продолжения войдите в свой аккаунт`};
                    this.dialog = true;
                }
            });
        },
    },
    mounted() {
        this.getRegionList();
        this.getLoginList();
        this.getEmailList();
        this.updateRules();
    }
}
</script>
	
<style lang="scss">
@import "../assets/main.css";

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
button.v-btn {
    background: transparent !important;   
}
</style>