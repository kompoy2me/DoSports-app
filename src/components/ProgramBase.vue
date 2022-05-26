<template>
    <div>
        <weeks-viewer
            @curr-data="setCurrData"
        ></weeks-viewer>
        <div class="row my-6">
            <div>
                {{weekDay}}
                <div style="font-size:11pt">{{date}}</div>
            </div>
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
            
        </v-simple-table>
    </div>
</template>

<script>
import WeeksViewer from '../components/WeeksViewer.vue';
export default {
    components: { WeeksViewer },
    data: () => ({
        userProg: null,
        currentData: {day: 1, week: 1},
        weekDay: "",
        date: "",
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

        setCurrData(day, week) {
            this.currentData.day = day + 1;
            this.currentData.week = week + 1;
            this.updateDate();
        },
        
        updateDate() {
            let dayNum = this.getScheduleDay();
            let dayWeek = {
                1: "Понедельник",
                2: "Вторник",
                3: "Среда",
                4: "Четверг",
                5: "Пятница",
                6: "Суббота",
                0: "Воскресенье",
            };
            this.weekDay = dayWeek[dayNum.weekDay];
            this.date = this.formatDate(dayNum.date)
            
        },

        getScheduleDay() {
            let week = this.currentData.week;
            let day = this.currentData.day;
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            if (schedule[week]) {
                return schedule[week].days[day];
            }
            return "";
        },

        formatDate(date) {
            if (date) {
                console.log('DATE', date);
                let d = new Date(date);
                let day = d.getDate();
                let month = d.getMonth() + 1;
                let year = d.getFullYear();
                return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
            }
            return "";
        },
    },

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