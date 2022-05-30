<template>
  <div class="main-meals">

      <div class="weekviever">
        <weeks-viewer 
            @curr-data="setCurrData"
        ></weeks-viewer>
      </div>

        <div class="main-content">

            <div v-if="mealsLoad" class="load">
                <v-progress-circular 
                    :width="4"
                    :size="40"
                    indeterminate
                    color="#004BD7"
                ></v-progress-circular>
            </div>
            
            <div v-else>
                <div 
                    v-if="dailyMeals.diet && dailyMeals.diet.length === 0"
                    class="px-4 py-6"
                >
                    <div class="mb-5">Сегодня вы еще не устанавливали приемы пищи.</div>
                    <v-btn
                        @click="overlay = true"
                    >Установить</v-btn>
                </div>
                <div 
                    class="pa-4"
                v-else>
                        <div 
                            v-for="meal in dailyMeals.diet" 
                            :key="meal.id_order"
                            class="py-3"
                        >
                            <meal-tab :meal="meal" :currDate="currentDate"></meal-tab>
                        </div>
                        <div
                            class="mt-2 mb-10"
                            @click="overlay = true">
                            <v-img
                                class="mr-2"
                                style="display:inline-block"
                                src="@/assets/img/png/icon-reset-program--white.png"
                                width=16px 
                                height=auto
                            ></v-img>
                            <div style="display:inline-block">Сбросить приемы пищи</div>
                        </div>
                </div>
            </div>
        </div>
        
        <v-overlay
        :color="'#000'"
        opacity=0.8
        v-model="overlay"
        style="z-index: 10">
            <div v-if="dailyMeals.diet && dailyMeals.diet.length === 0">
                <v-card
                    style="background-color: #1A1A27;"
                    max-width="90vw"
                    class="px-7 py-6"
                >
                    <div class="headline-light"
                    >Установка приемов пищи на день</div>
                    <div class="d-flex align-center my-4 view-date">
                        <div>Неделя {{currentDate.week}}</div>
                        <v-divider color="white" class="mx-2"></v-divider>
                        <div>День {{currentDate.day}}</div>
                    </div>
                    <div class="hint-text">
                        Изменить количество приемов можно будет только удалив и заново создав текущий день.
                        <div>
                            Для каждого приема автоматически установится время.
                        </div>
                    </div>
                    <div class="my-4 d-flex align-center justify-space-between">
                        <div class="increase" @click="decreaseMeal">
                            <v-icon :color="'#B5B5B8'">mdi-chevron-left</v-icon>
                        </div>
                        <div class="counter">
                            {{mealCount}}
                        </div>
                        <div class="increase" @click="increaseMeal">
                            <v-icon :color="'#B5B5B8'">mdi-chevron-right</v-icon>
                        </div>
                    </div>
                    <div class="d-flex justify-space-between align-center">
                        <v-btn
                            style="font-size:11pt; width:40%; background-color: #363649 !important"
                            @click="overlay = !overlay"
                        >
                            Отменить</v-btn>
                        <v-btn
                            style="width:56%; background-color: #004BD7 !important"
                            @click="createProgramDiet"
                        >Готово</v-btn> 
                    </div>
    
                </v-card>
            </div>
            <div v-else>
                <v-card
                    style="background-color: #1A1A27;"
                    max-width="90vw"
                    class="px-5 py-6"
                >
                    <div class="px-5 mb-7" style="text-align: center;">Вы действительно хотите сбросить приемы пищи?</div>
                    <div class="row-btn">
                        <v-btn
                            style="background-color: #8f8f9a !important"
                            @click="overlay = !overlay"
                            class="mr-3 "
                        >
                            Отменить</v-btn>
                        <v-btn
                            style="background-color: #ff5b5b !important"
                            @click="resetMeals"
                        >Сбросить</v-btn> 
                    </div>
                </v-card>
            </div>
        </v-overlay>
  </div>
</template>

<script>
import WeeksViewer from '../components/WeeksViewer.vue';
import MealTab from './MealTab.vue';
import { mapActions } from 'vuex';
import axios from "axios";
import url from "@/services/url";
export default {
    data: () => ({
        currentDate: {},
        dailyMeals: {},
        mealsLoad: true,
        overlay: false,
        mealCount: 3,
        mealSchedule: [],
    }),
    components: {WeeksViewer, MealTab},
    computed: {
        date() {
            return this.formatDate(this.dailyMeals.date);
        },
    },
    methods: {
        ...mapActions(["updateDietSchedule"]),

        setCurrData(day, week) {
            this.currentDate.day = day + 1;
            this.currentDate.week = week + 1;
            this.updateMeals();
        },

        initMeals() {
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            this.dailyMeals = schedule[this.currentDate.week].days[this.currentDate.day];
        },

        async updateMeals() {
            this.mealsLoad = true;
            if (navigator.connection.type != "none") {
                await this.updateDietSchedule(this.currentDate).then( () => {
                    this.initMeals();
                    this.mealsLoad = false;
                })
            } else {
                this.initMeals();
                this.mealsLoad = false;
            }
        },

        async createProgramDiet() {
            this.calcMealSchedule(this.mealCount);
            let program = {
                idProgram: JSON.parse(localStorage.getItem('program')).id,
                mealsNumber: this.mealCount,
                date: this.date,
                carbohydratesDegree: 1, // 0 - низкоуглеводный, 1 - средне, 2 - высоко
                mealSchedule: this.mealSchedule
            };
            console.log('PROGRAM', JSON.stringify(program));
            await axios.post(`${url}/api/programs/add-program-diet`, program).then((res) => {
                if (res.data.name === "Success") {
                    this.updateMeals();
                    this.overlay = false;
                }
            });
        },

        async resetMeals() {
            if (this.dailyMeals.diet.length) {
                let input = {
                    id: this.dailyMeals.diet[0].id_program_diet,
                }
                await axios.post(`${url}/api/programs/delete-program-diet`, input).then((res) => {
                    if (res.data.name === "Success") {
                        this.updateMeals();
                        this.overlay = false;
                    }
                });
            }
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

        increaseMeal() {
            if (this.mealCount < 5) {
                this.mealCount++;
            }
        },
        decreaseMeal() {
            if (this.mealCount > 3) {
                this.mealCount--;
            }
        },
    },

    mounted() {
        
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.main-meals {
    overflow: auto;
    height: 92vh;
    position: relative;
}
.weekviever {
    position: relative;
    height: 18%;
    background-color: #1A1A27;
    z-index: 6;
}
.main-content {
    overflow: auto;
    height: 82%;
}

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
.meal-head {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.row-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.load {
    text-align: center;
    margin-top: 20vh;
}
.headline-light {
    font-family: "Inter-Bold", sans-serif;
    font-size: 16pt;
    line-height: 1.2em;
}
.view-date {
    font-family: "Inter-Bold", sans-serif;
}
.counter {
    padding: 12px 24vw;
    border: solid 2px #B5B5B8;
    border-radius: 6px;
    font-size: 14pt;
}
</style>