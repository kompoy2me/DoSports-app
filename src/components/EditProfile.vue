<template>
	<div>
		<v-form ref="form" lazy-validation 
        class="px-4">
            <img
                class="mt-8 mb-2" 
                :width=54
                @click="$router.push({ name: 'user'}).catch(err => {})"
                :src="require('@/assets/img/png/arrow-back--white1.png')">
            <div
                style="font-size:16pt"
				class="mt-1 mb-10"
			>Личная информация</div>

            <label>ФИО</label>
			<v-text-field
                class="mb-4"
                v-model="user.fullname"
                color="#9196FF"
                :rules="rules.fullname"
                hide-details="auto"
                required
                outlined
			></v-text-field>
            
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
                v-model="user.id_region"
                hide-details="auto"
                :items="this.getRegions"
                :item-text="item => `${item.name} (UTC +${item.time})`"
                :item-value="'id'"
                required
                outlined
                class="mb-4"
                color="#9196FF"
            ></v-select>

            <label>Email</label>
            <v-text-field
                v-model="user.email"
                :rules="rules.email"
                hide-details="auto"
                required
                outlined
                class="mb-4"
                color="#9196FF"
			></v-text-field>
                
            <v-btn
                color="primary"
                large
                block
                class="my-8"
                @click="changePersonalData"
                :loading="this.editProgress"
            >Сохранить
            </v-btn>
		</v-form>
		<v-dialog
            v-model="dialog">
            <alert-message :msg="msg" @clicked="dialog = false"></alert-message>
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
        user: {
            id: 0,
            fullname: "",
            birthday: null,
            email: "",
            id_region: 1,
        },
        dateFormatted: "",
        showPass: false,
        editProgress: false,
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
        ...mapActions(["getRegionList", "getLoginList", "getEmailList", "checkAccess"]),

        parseDate(date) {
            if (!date) return null;
            const [year, month, day] = date.split('-');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        },

        save (date) {
            this.$refs.menu.save(date);
            this.user.birthday = date;
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
                v => !this.getEmails.find(obj => obj.email === v) || v === JSON.parse(localStorage.getItem("user")).email || 'Данный email уже существует'
            ];
        },

        async changePersonalData() {
            if (this.$refs.form.validate()) {
                this.editProgress = true;
                await axios.post(`${url}/api/users/change-personal-data`, this.user).then((res) => {
                    if (res.data.name === "Success") {
                        this.updateUser().then(() => {
                            this.msg = {title: 'Информация обновлена!', text: ``}
                            this.dialog = true;
                        })
                    }
                });
            }
        },

        async updateUser() {
            await this.checkAccess().then(()=> {
                this.user = JSON.parse(localStorage.getItem("user"));
                this.editProgress = false;
            })
        },

        initializeUser() {
            this.user = JSON.parse(localStorage.getItem("user"));
            this.date = this.user.birthday;
            this.updateRules();
        },

    },
    mounted() {
        this.getRegionList();
        this.getLoginList();
        this.getEmailList();
        this.initializeUser();
       
        
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