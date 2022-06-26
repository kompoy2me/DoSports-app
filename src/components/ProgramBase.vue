<template>
    <div class="common-main" >

        <div class="common-head pa-0 ma-0" >
            <weeks-viewer
                @curr-data="setCurrData"
            ></weeks-viewer>
        </div>

        <div class="common-body px-3 py-2">

            <div v-if="statusStat === 'load'" class="load">
                <v-progress-circular 
                    :width="4"
                    :size="40"
                    indeterminate
                    color="#004BD7"
                ></v-progress-circular>
            </div>

            <div v-else>
                <div style="font-size:12pt" class="my-4">
                    <div class="d-flex justify-space-between">
                        {{weekDay}}
                        <div >{{date}}</div>
                    </div>
                    <v-divider color="white" class="mt-3 mb-7"></v-divider>
                </div>
                <!--<div style="font-size:11pt" class="mt-6">Расчет питательных веществ на день</div>-->
                <v-simple-table
                    class="table px-4 pb-6 pt-2"
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
                            <td v-if="Math.abs(item.amendment / item.aim) < 0.1 " class="amendment">{{ item.amendment }}</td>
                            <td v-else class="amendment" style="color:#FF5B5B">{{ item.amendment }}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </div>

            
        </div>

    </div>
</template>

<script>
import axios from "axios";
import url from "@/services/url";
import WeeksViewer from '../components/WeeksViewer.vue';
export default {
    components: { WeeksViewer },
    data: () => ({
        selectedStat: 0,
        userProg: {},
        currentDate: {day: 1, week: 1},
        weekDay: "",
        date: "",
        dailyMeals: {},
        statusStat: 'stat',
        diary: [],
        eaten: {proteins: 0, fats: 0, carbohydrates: 0, calories: 0, fibers: 0},
        menu: [
            {id: 0, name: "Вес"},
            {id: 1, name: "Грудь"},
            {id: 2, name: "Талия"},
            {id: 3, name: "Бедра"},
            {id: 4, name: "Бицепс"},
            {id: 5, name: "Голень"},
            {id: 6, name: "Шея"},
        ],
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
        },
        datasets() {
            let obj = {
                weight: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Вес (кг)',
                            data: []
                        }
                    ]
                },
                bust: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват груди (см)',
                            data: []
                        }
                    ]
                },
                hip: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват бедер (см)',
                            data: []
                        }
                    ]
                },
                waist: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват талии (см)',
                            data: []
                        }
                    ]
                },
                bicep: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват бицепса (см)',
                            data: []
                        }
                    ]
                },
                shin: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват голени (см)',
                            data: []
                        }
                    ]
                },
                neck: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват шеи (см)',
                            data: []
                        }
                    ]
                }
            };
            if (this.diary.length) {
                for (let key in obj) {
                    obj[key].datasets[0].backgroundColor = '#9196FF';
                    obj[key].datasets[0].borderColor = '#9196FF';
                }
                for (let i = 0; i < this.diary.length; i++) {
                    obj.weight.datasets[0].data.push(this.diary[i].weight);
                    let labe = this.formatDate(this.diary[i].date.split("T")[0]).split('.');
                    obj.weight.labels.push(labe[0]+'.'+labe[1]);
                    console.log(this.diary[i].date.split("T")[0])
                    if (this.diary[i].bust) {
                        obj.bust.datasets[0].data.push(this.diary[i].bust);
                        obj.bust.labels.push(this.formatDate(this.diary[i].date.split("T")[0]));
                    }
                    if (this.diary[i].hip) {
                        obj.hip.datasets[0].data.push(this.diary[i].hip);
                        obj.hip.labels.push(this.formatDate(this.diary[i].date.split("T")[0]));
                    }
                    if (this.diary[i].waist) {
                        obj.waist.datasets[0].data.push(this.diary[i].waist);
                        obj.waist.labels.push(this.formatDate(this.diary[i].date.split("T")[0]));
                    }
                    if (this.diary[i].bicep) {
                        obj.bicep.datasets[0].data.push(this.diary[i].bicep);
                        obj.bicep.labels.push(this.formatDate(this.diary[i].date.split("T")[0]));
                    }
                    if (this.diary[i].shin) {
                        obj.shin.datasets[0].data.push(this.diary[i].shin);
                        obj.shin.labels.push(this.formatDate(this.diary[i].date.split("T")[0]));
                    }
                    if (this.diary[i].neck) {
                        obj.neck.datasets[0].data.push(this.diary[i].neck);
                        obj.neck.labels.push(this.formatDate(this.diary[i].date.split("T")[0]));
                    }
                }
            }
            return obj;
        },
    },
    methods: {
         async getDiary() {
            let user = JSON.parse(localStorage.getItem("user"));
            await axios.post(`${url}/api/programs/get-user-diary`, user).then((res) => {
                if (res.data.name === "Success") {
                    this.diary = res.data.diary;
                }
            })
        },

        setCurrData(day, week) {
            this.currentDate.day = day + 1;
            this.currentDate.week = week + 1;
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
        this.userProg = JSON.parse(localStorage.getItem("program"));
        this.getDiary();
        
    }

}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.common-body {
    font-family: 'Inter-Regular', sans-serif;
    overflow: auto;
    height: 82%;
}
.common-head {
    position: relative;
    height: 18%;
    background-color: #1A1A27;
    z-index: 6;
}
.common-main {
    overflow: auto;
    height: 92vh;
    position: relative;
}

.table {
    margin-top: 15px;
    border-radius: 4px;
    width: 100%;
    

    th {
        padding: 0 0 5px 0 !important;
        font-weight: normal;
        font-size: 14px;
        line-height: 200%;
    }
    td {
        padding: 0 !important;
        font-family: 'Inter-Regular', sans-serif;
        font-weight: normal;
        font-size: 16px;
        border: none !important;
        line-height: 200%;
    }
    tbody {
        td.name {
            width: 240px;
            
            font-family: 'Inter-Regular', sans-serif;
            font-weight: normal;
            font-size: 16px;
            text-align: start !important;
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