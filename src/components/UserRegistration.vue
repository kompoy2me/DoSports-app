<template>
	<div>
		<v-form ref="form" lazy-validation>
            <p
				class="font-weight-bold black--text text-h5 mb-6"
			>Регистрация</p>
			<v-text-field
                v-model="newUser.fullname"
				label="ФИО"
				:counter="50"
                :rules="rules.fullname"
                required
			></v-text-field>

			<label>Пол</label>
			<v-radio-group
                v-model="newUser.gender"
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

            <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="90%"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        label="Дата рождения"
                        :rules="rules.birthday"
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        readonly
                        v-on="on"
                        required
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date"
                    :active-picker.sync="activePicker"
                    min="1950-01-01"
                    :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                    @change="save"
                    no-title
                ></v-date-picker>
            </v-menu>

            <v-select
                v-model="newUser.id_region"
                label="Регион проживания"
                :items="this.getRegions"
                :item-text="item => `${item.name} (UTC +${item.time})`"
                :item-value="'id'"
                required
            ></v-select>

            <v-text-field
                label="Логин"
                :counter="20"
                :rules="rules.login"
                v-model="newUser.login"
                hide-details="auto"
                required
			></v-text-field>

            <v-text-field
                v-model="newUser.email"
				label="Email"
				:counter="50"
                :rules="rules.email"
                required
			></v-text-field>

            <v-text-field
                v-model="newUser.password"
				label="Пароль"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                @click:append="showPass = !showPass"
                :rules="rules.password"
				:counter="50"
                hide-details="auto"
                required
			></v-text-field>

            <v-checkbox
                    label="Нажимая кнопку “Зарегистрироваться”, вы даете согласие на обработку персональных данных"
                    :rules="rules.checkbox"
                    required
                ></v-checkbox>
                
            <v-btn
                @click="addUser"
                color="primary"
                large
                block
                class="mt-4"
            >Зарегистрироваться
            </v-btn>
		</v-form>
		
	</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
export default {
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
        ...mapActions(["getRegionList", "getLoginList", "getEmailList","createUser"]),
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
                this.createUser(this.newUser);
                //this.regUser()
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
        }
    },
    mounted() {
        this.getRegionList();
        this.getLoginList();
        this.getEmailList();
        this.updateRules();
    }
}
</script>
	
<style>
	
</style>