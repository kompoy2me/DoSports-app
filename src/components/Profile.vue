<template>
	<div v-if="this.user">
        <div class="main-user">
            <div class="user-head">
                <div class="userAvatar">
                    <v-avatar
                        size="140">
                        <img src="@/assets/img/png/empty-image.png" alt="img">
                    </v-avatar>
                    <div class="mt-2">{{ user.fullname }}</div>
                    <div class="email">{{ user.email }}</div>
                </div>
            </div>
            <div class="user-body">
                
                <v-img v-if="user.pro_last_datetime === null"
                    class="mt-4"
                    src="@/assets/img/png/banner-premium.png"
                    width=100% 
                    height=auto
                    @click="$router.push({ name: 'sub'})"
                ></v-img>
                <div class="px-4">
                    <div class="person-data-block">
                    
                    <div class="my-6" @click="$router.push({ name: 'sub'})">Подписка: <div class="person-data" >{{ user.pro_last_datetime === null ? "стандарт" : `премиум (до ${formatDate(user.pro_last_datetime)})` }}</div> </div>
                    <v-divider color="#fff" class="my-4"></v-divider>
                    <div class="mb-2">Дата рождения: <div class="person-data" >{{ user.birthday }}</div> </div>
                    <div class="mb-2">Регион проживания: <div class="person-data" >{{ user.id_region }}</div> </div>
                    <div  class="navigation mb-2 mt-4" @click="$router.push({ name: 'edit-user'})">Редактировать</div>
                    </div>
                <v-divider color="#fff" class="my-4"></v-divider>
                <div class="person-data-block">
                    
                    <div class="bmi mb-2">ИНДЕКС МАССЫ ТЕЛА - {{program.bmi}}</div>
                    <div class="d-flex">
                        <div class="mr-10 mb-2">Вес: <div class="person-data" >{{ program.weight }}</div></div>
                        <div>Рост: <div class="person-data" >{{ program.height }}</div></div>
                    </div>
                    <div class="mb-2">Категория: <div class="person-data" >{{weight_category[program.id_weight_category]}}</div> </div>
                    <div class="mb-2">Образ жизни: <div class="person-data" >{{lifestyle[program.id_lifestyle]}}</div> </div>
                    <div class="mb-2">Уровень подготовки: <div class="person-data" >{{train_prepare[program.train_prepare]}}</div> </div>
                    <div class="mb-2">Цель программы: <div class="person-data" >{{aim[program.aim]}}</div> </div>
                    
                 <div class="navigation mt-4" @click="overlay = true">
                    Удалить программу
                </div>
                </div>

               <div >
                    <v-btn style="width: 100%" class="my-8" width="" @click="logOut">Выйти из аккаунта</v-btn>
                </div>

                </div>
                
                
                
            </div>
        </div>
        <v-overlay
            :color="'#000'"
            opacity=0.8
            style="z-index: 10"
            v-model="overlay">
            <v-dialog
             v-model="overlay">
                <v-card
                        style="background-color: #1A1A27;"
                        width="90vw"
                        class="px-5 py-6"
                    >
                        <div class="px-5 mb-2" style="text-align: center; font-size: 16pt;">Вы действительно хотите сбросить программу?</div>
                        <div class="mb-4" style="text-align: center; color: #ff5b5b; font-size: 11pt;">Весь текущий прогресс будет утерян</div>
                        <div class="row-btn">
                            <v-btn
                                style="background-color: #8f8f9a !important"
                                @click="overlay = !overlay"
                                class="mr-3 "
                            >
                                Отменить</v-btn>
                            <v-btn
                                style="background-color: #ff5b5b !important"
                                @click="deleteProgram"
                                :loading="load_del"
                            >Сбросить</v-btn>
                        </div>
                    </v-card>
            </v-dialog>
        </v-overlay>        
    </div>
</template>

<script>
import { mapActions, mapGetters} from 'vuex'
export default {
    data: () => ({
        user: null,
        program: null,
        overlay: false,
        load_del:false,
        weight_category: [
            '',
            'острый дефицит массы тела',
            'недостаточный вес',
            'нормальный вес',
            'избыточный вес',
            'I степень ожирения',
            'II степень ожирения',
            'III степень ожирения'
        ],
        lifestyle: [
            '',
            'малоподвижный',
            'умеренно активный',
            'активный',
            'очень активный'
        ],
        aim: [
            
            'поддержание веса',
            'сброс веса',
            'набор веса'
        ],
        train_prepare: [
            'новичок',
            'проффессионал'
        ]
    }),
    methods: {
        ...mapActions(["getRegionList","unauthorized", "closeProgram"]),

        async logOut() {
            this.unauthorized().then(() => {
                this.$router.push({name: "start"})
            })
        },

        initializeUser() {
            this.user = JSON.parse(localStorage.getItem("user"));
            this.program = JSON.parse(localStorage.getItem("program"));
        },

        deleteProgram() {
            this.load_del = true;
            this.closeProgram(this.user).then(() => {
                localStorage.removeItem("program");
                localStorage.removeItem("schedule");
                localStorage.removeItem("diet");
                this.$router.push({ name: 'start-prog'});
            })
        },
        formatDate(date) {
            if (date) {
                let d = new Date(date);
                let day = d.getDate();
                let month = d.getMonth() + 1;
                let year = d.getFullYear();
                return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
            }
            return "";
        },
    },
    computed: {
        ...mapGetters(["getRegions"]),
    },

    mounted() {
        this.initializeUser()
    },
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.main-user {
    overflow: auto;
    height: 92vh;
    position: relative;
    
}
.user-head {
    position: relative;
    height: 35%;
    background-color: #1A1A27;
}
.user-body {
    overflow: auto;
    height: 65%;
}
.userAvatar {
    width: 100%;
    position: absolute;
    bottom: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: "Inter-Bold", sans-serif;
}
.banner {
    margin-bottom: 20px;
}
.person-data-block {
    font-family: "Inter-Bold", sans-serif;
}
.person-data {
    display: inline-block;
    font-family: "Inter-Regular", sans-serif;
}
.bmi {
    font-size: 13pt;
}
.navigation {
    text-decoration: underline;
    font-family: "Inter-Regular", sans-serif;
    font-size: 11pt;
}

.email {
    font-family: "Inter-Regular", sans-serif;
    font-size: 11pt;
}
</style>