<template>
    <div class="common-main" >

        <div class="common-head pa-0 ma-0" >
            <weeks-viewer
                @curr-data="setCurrData"
            ></weeks-viewer>
        </div>

        <div class="common-body">
            <div style="font-size:11pt" class="px-4 d-flex align-center my-6">
                <div>
                    {{weekDay}}
                    <div style="font-size:11pt">{{date}}</div>
                </div>
                <v-divider color="white" class="mx-2"></v-divider>
                <div>Среднеуглеводный день</div>
            </div>
            <v-simple-table
                class="table"
                style="background-color: #1A1A27"
            >
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th>
                        </th>
                        <th>
                            Цель
                        </th>
                        <th>
                            Употреблено
                        </th>
                        <th>
                            Поправка
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="item in table"
                        :key="item.name"
                    >
                        <td class="name">{{ item.name }}</td>
                        <td class="aim">{{ item.aim }}</td>
                        <td class="eaten">{{ item.eaten }}</td>
                        <td class="amendment">{{ item.amendment }}</td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>

        

        
    </div>
</template>

<script>
import WeeksViewer from '../components/WeeksViewer.vue';
export default {
    components: { WeeksViewer },
    data: () => ({
        userProg: {},
        currentDate: {day: 1, week: 1},
        weekDay: "",
        date: "",
        dailyMeals: {},
        eaten: {proteins: 0, fats: 0, carbohydrates: 0, calories: 0, fibers: 0}
    }),
    
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
        },

        table() {
            if (this.dailyMeals) {
                let aim = {
                    calories: this.userProg.calories,
                    proteins: this.userProg.proteins,
                    fats: this.userProg.fats,
                    carbohydrates: this.userProg.carbohydrates,
                    fibers: this.userProg.fibers
                }
                let eaten = {
                    calories: this.eaten.calories,
                    proteins: this.eaten.proteins,
                    fats: this.eaten.fats,
                    carbohydrates: this.eaten.carbohydrates,
                    fibers: this.eaten.fibers
                }
                let round = (value) => {
                    return (+value.toFixed(1));
                }
                return [
                    { name: "Белки", aim: aim.proteins, eaten: eaten.proteins, amendment: round(aim.proteins -  eaten.proteins)},
                    { name: "Жиры", aim: aim.fats, eaten: eaten.fats, amendment: round(aim.fats -  eaten.fats)},
                    { name: "Углеводы", aim: aim.carbohydrates, eaten: eaten.carbohydrates, amendment: round(aim.carbohydrates -  eaten.carbohydrates)},
                    { name: "Калории", aim: aim.calories, eaten: eaten.calories, amendment: round(aim.calories -  eaten.calories)},
                    { name: "Клетчатка", aim: aim.fibers, eaten: eaten.fibers, amendment: round(aim.fibers - eaten.fibers) },
                ]
            }
            return [
                { name: "Белки", aim: 0, eaten: 0, amendment: 0 },
                { name: "Жиры", aim: 0, eaten: 0, amendment: 0 },
                { name: "Углеводы", aim: 0, eaten: 0, amendment: 0 },
                { name: "Калории", aim: 0, eaten: 0, amendment: 0 },
                { name: "Клетчатка", aim: 0, eaten: 0, amendment: 0 },
            ]
        }
    },
    methods: {

        setCurrData(day, week) {
            this.currentDate.day = day + 1;
            this.currentDate.week = week + 1;
            console.log('UPDATED DATE ', week, day);
            this.updateBase();
            
        },
        updateBase() {
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            this.dailyMeals = schedule[this.currentDate.week].days[this.currentDate.day];
            this.eaten = this.dailyMeals.eaten
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
            let week = this.currentDate.week;
            let day = this.currentDate.day;
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            if (schedule[week]) {
                return schedule[week].days[day];
            }
            return "";
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
    mounted() {
            this.userProg = JSON.parse(localStorage.getItem("program"))
            
    }

}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

 .table {
    margin-top: 15px;
    border-radius: 4px;
    width: 100%;
    padding: 25px;
    

    th {
        padding: 0 0 5px 0 !important;
        font-family: 'Inter-Regular', sans-serif;
        font-weight: normal;
        font-size: 14px;
        line-height: 200%;
    }
    td {
        padding: 0 !important;
        font-family: 'Inter-Regular', sans-serif;
        font-weight: normal;
        font-size: 16px;
        line-height: 200%;
    }
    tbody {
        td.name {
            width: 240px;
            font-family: 'Inter-Regular', sans-serif;
            font-weight: normal;
            font-size: 16px;
            line-height: 200%;
        }
        td.aim {
            width: 185px;
        }
        td.eaten {
            width: 245px;
        }
        td.amendment {
            width: auto;
        }
        tr {
            td {
                padding-top: 4px !important;
            }
        }
        tr:first-child {
            td {
                padding-top: 4px !important;
            }
        }
    }
}
</style>