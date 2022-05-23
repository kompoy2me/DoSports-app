<template>
    <div>

        <weeks-viewer
            @curr-data="setCurrData"
        ></weeks-viewer>


        <div class="pa-4">
            <div>Сегодня вы еще не устанавливали приемы пищи.</div>
            <v-btn
                @click="overlay = true"
            >Установить</v-btn>
        </div>


        <v-overlay
        :color="'#000'"
        opacity=0.8
        v-model="overlay">
            <v-card
                style="background-color: #1A1A27;"
                max-width="80vw"
                class="px-5 py-6"
            >
                <div class="headline"
                >Установка приемов пищи на день</div>
                <div class="hint-text">
                    Изменить количество приемов можно будет только удалив и заново создав текущий день.
                    <div>
                        Для каждого приема автоматически установится время. Его вы сможете изменить, когда захотите.
                    </div>
                </div>
                <template>
                    <v-sheet
                        class="ma-0 pa-0"
                    >
                        <v-slide-group
                        v-model="mealCount"
                        center-active
                        show-arrows
                        mandatory
                        >
                        <v-slide-item
                            v-for="n in meals"
                            :key="n"
                            class="d-flex justify-center align-center"
                            style="background-color: #1A1A27; border: #fff solid;"
                            v-slot="{ active, toggle }"
                        >  
                            <v-card
                            :class="active ? 'primary--text' : ''"
                            class="ma-4"
                            height="50"
                            width="100"
                            @click="toggle"
                            >
                            <v-row
                                class="fill-height"
                                align="center"
                                justify="center"
                            >{{n}}
                                <v-scale-transition></v-scale-transition>
                            </v-row>
                            </v-card>
                        </v-slide-item>
                        </v-slide-group>
                    </v-sheet>
                </template>
                <v-btn
                    width="100%"
                    @click="createProgramDiet"
                >Готово</v-btn>
            </v-card>
        </v-overlay>


  </div>
</template>

<script>
import WeeksViewer from '../components/WeeksViewer.vue';
import axios from "axios";
import url from "@/services/url";
import { mapActions } from 'vuex';
export default {
    components: {WeeksViewer},
    data: () => ({
        overlay: false,
        model: null,
        mealSchedule: [],
        mealCount: 3,
        meals: [3, 4, 5],
        currentData: {day: 1, week: 1},
        
    }),
    computed: {
        date() {
            let sched = this.getScheduleDay();
            let formatDate = this.formatDate(sched);

            console.log('start data', JSON.parse(localStorage.getItem('program')).date_start);
            console.log('sched', sched);
            console.log('formatDate', formatDate);
            return formatDate
            //return this.formatDate(this.getScheduleDay());
        },
    },
    methods: {
        ...mapActions(["showProgramDiet"]),
        setCurrData(day, week) {
            this.currentData.day = day + 1;
            this.currentData.week = week + 1;
            //console.log('UPDATED CURRDATA ', this.currentData.week, this.currentData.day)
        },

        async createProgramDiet() {
            console.log('schedule, ', localStorage.getItem('schedule'));
            console.log(this.date);
            
            this.overlay = false;
            let meals = this.mealCount + 3;
            this.calcMealSchedule(meals);

            this.program = {
                idProgram: JSON.parse(localStorage.getItem('program')).id,
                mealsNumber: meals,
                date: this.date,
                carbohydratesDegree: 1, // 0 - низкоуглеводный, 1 - средне, 2 - высоко
                mealSchedule: this.mealSchedule
            };
            console.log(JSON.stringify(this.program));
            await axios.post(`${url}/api/programs/add-program-diet`, this.program).then((res) => {
                if (res.data.name === "Success") {
                    this.getProgramDiet();
                }
            });
        },
        getProgramDiet() {
            let input = {
                idProgram: JSON.parse(localStorage.getItem('program')).id,
                date: this.date,
            };
            this.showProgramDiet(input);
        },

        getScheduleDay() {
            //let week = this.currentDate.week;
            //let day = this.currentDate.day;
            let week = this.currentData.week;
            let day = this.currentData.day;
            //console.log(week, day);
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            
            if (schedule[week]) {
                return schedule[week].days[day].date;
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
        clickMeal() {
        },

        calcMealSchedule(meals) {
            if (meals === 3) {
                this.mealSchedule = [
                    {
                        time: "07:00-09:00",
                        idOrder: 1,
                    },
                    {
                        time: "12:00-14:00",
                        idOrder: 3,
                    },
                    {
                        time: "16:00-18:00",
                        idOrder: 5,
                    }
                ]
            } else if (meals === 4) {
                this.mealSchedule = [
                    {
                        time: "07:00-09:00",
                        idOrder: 1,
                    },
                    {
                        time: "11:00-13:00",
                        idOrder: 2,
                    },
                    {
                        time: "15:00-17:00",
                        idOrder: 3,
                    },
                    {
                        time: "19:00-21:00",
                        idOrder: 5,
                    },
                ]
            } else if (meals === 5) {
                this.mealSchedule = [
                    {
                        time: "07:00-09:00",
                        idOrder: 1,
                    },
                    {
                        time: "10:00-12:00",
                        idOrder: 2,
                    },
                    {
                        time: "13:00-15:00",
                        idOrder: 3,
                    },
                    {
                        time: "16:00-18:00",
                        idOrder: 4,
                    },
                    {
                        time: "19:00-21:00",
                        idOrder: 5,
                    },
                ]
            }
        },
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.v-card {
    font-family: "Inter-Regular", sans-serif;
}
.v-slide-group__next,
.v-slide-group__prev {
    margin: 0;
    padding: 0;
}
.hint-text {
    font-size: 11pt;
}

</style>