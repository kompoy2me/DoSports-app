<template>
	<div class="main-user">
        <div class="user-head">
            <!--<v-img
                src="@/assets/img/png/user-head.png"
                width=auto 
                height=100%
            ></v-img>-->
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
            
            <v-img
            class="mt-4"
                src="@/assets/img/png/banner-premium.png"
                width=100% 
                height=auto
                @click="getPremium"
            ></v-img>
            <div class="pa-4">
                <div class="person-data-block py-4">
                
                <div class="mb-2">Подписка: <div class="person-data" >{{ user.pro ? 'премиум' : 'стандарт' }}</div> </div>
                <div class="mb-2">Дата рождения: <div class="person-data" >{{ user.birthday }}</div> </div>
                <div class="mb-2">Регион проживания: <div class="person-data" >{{ user.id_region }}</div> </div>
                <div class="navigation" @click="logOut">Выйти из аккаунта</div>
            </div>
            <div class="person-data-block py-4">
                
                <div class="bmi mb-2">ИНДЕКС МАССЫ ТЕЛА - {{program.bmi}}</div>
                <div class="d-flex">
                    <div class="mr-10 mb-2">Вес: <div class="person-data" >{{ program.weight }}</div></div>
                    <div>Рост: <div class="person-data" >{{ program.height }}</div></div>
                </div>
                <div class="mb-2">Категория: <div class="person-data" >{{weight_category[program.id_weight_category]}}</div> </div>
                <div class="mb-2">Образ жизни: <div class="person-data" >{{lifestyle[program.id_lifestyle]}}</div> </div>
                <div class="mb-2">Уровень подготовки: <div class="person-data" >{{train_prepare[program.train_prepare]}}</div> </div>
                <div class="mb-2">Цель программы: <div class="person-data" >{{aim[program.aim]}}</div> </div>
                <div  class="navigation mb-2">Редактировать</div>
            </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters} from 'vuex'
export default {
    data: () => ({
        user: null,
        program: null,
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
        ...mapActions(["getRegionList","unauthorized"]),
        logOut() {
            this.unauthorized().then(() => {
                this.$router.push({name: "start"})
            })
        },
        getPremium() {
            alert('!')
        }
    },
    computed: {
        ...mapGetters(["getRegions"]),
        
    },
    mounted() {
        this.getRegionList();
    },
    created() {
        this.user = JSON.parse(localStorage.getItem("user"))
        this.program = JSON.parse(localStorage.getItem("program"))
    }
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
    height: 60%;
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
    border-top: solid white;
    font-family: "Inter-Bold", sans-serif;
}
.person-data {
    display: inline-block;
    font-family: "Inter-Regular", sans-serif;
}
.bmi {
    font-size: 14pt;
}
.navigation {
    text-align: right;
    text-decoration: underline;
    font-family: "Inter-Regular", sans-serif;
    font-size: 11pt;
}

.email {
    font-family: "Inter-Regular", sans-serif;
    font-size: 11pt;
}
</style>