<template>
    <div>

        <div class="row my-6">
            <div>{{getWeek}}</div>
            <v-divider color="white" class="mx-2"></v-divider>
            <div>Среднеуглеводный день</div>
        </div>
        <v-simple-table class="pa-2">

            <tr>
                <th></th>
                <th>Цель</th>
                <th>Употреблено</th>
                <th>Поправка</th>
            </tr>
            <tr>
                <th>Калории</th>
                <th>{{ userProg.calories }}</th>
                <th>0</th>
                <th>{{ userProg.calories }}</th>
            </tr>
            <tr>
                <th>Белки</th>
                <th>{{ userProg.proteins }}</th>
                <th>0</th>
                <th>{{ userProg.proteins }}</th>
            </tr>
            <tr>
                <th>Жиры</th>
                <th>{{ userProg.fats }}</th>
                <th>0</th>
                <th>{{ userProg.fats }}</th>
            </tr>
            <tr>
                <th>Углеводы</th>
                <th>{{ userProg.carbohydrates }}</th>
                <th>0</th>
                <th>{{ userProg.carbohydrates }}</th>
            </tr>
            <tr>
                <th>Клетчатка</th>
                <th>{{ userProg.fibers }}</th>
                <th>0</th>
                <th>{{ userProg.fibers }}</th>
            </tr>

        </v-simple-table>
    </div>
</template>

<script>
export default {
    data: () => ({
        userProg: null,
    }),
    mounted() {
        this.userProg = JSON.parse(localStorage.getItem("program"))
    },
    computed: {
        getWeek() { 
            let currDay = new Date();
            let dayWeek = {
                1: "Понедельник",
                2: "Вторник",
                3: "Среда",
                4: "Четверг",
                5: "Пятница",
                6: "Суббота",
                0: "Воскресенье",
            }
            return dayWeek[currDay.getDay()];

        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.row {
    display: flex;
    flex-direction: row;
    justify-content: space-around; 
    align-items: center;
}
</style>