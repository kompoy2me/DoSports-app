<template>
    <div>

        <weeks-viewer class=""
            @curr-data="setCurrData"
        ></weeks-viewer>

        <!--{{dailyMeals.date}} 
        {{dailyMeals.diet.length}}-->

        <div 
            v-if="dailyMeals.diet.length === 0"
            class="pa-4"
        >
            <div class="mb-5">Сегодня вы еще не устанавливали приемы пищи.</div>
            <v-btn
                @click="overlay = true"
            >Установить</v-btn>
        </div>

        <div 
            class="px-4"
        v-else>
            <div 
                v-for="meal in dailyMeals.diet" 
                :key="meal.id_order"
                class="py-3"
            >
                <meal-tab :meal="meal"></meal-tab>
            </div>

            <div
                class="mt-2 mb-10"
                @click="resetDialog">
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
        

        <v-overlay
        :color="'#000'"
        opacity=0.8
        v-model="overlay">
        <div v-if="dailyMeals.diet.length === 0">
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
import MealTab from './MealTab.vue';
import WeeksViewer from '../components/WeeksViewer.vue';
import axios from "axios";
import url from "@/services/url";
import { mapActions } from 'vuex';
export default {
    components: {WeeksViewer, MealTab},
    data: () => ({
        overlay: false,
        show: false,
        schedule: null,
        mealSchedule: [],
        mealCount: 3,
        meals: [3, 4, 5],
        currentData: {day: 1, week: 1},
        dailyMeals: null,
    }),
    computed: {
        date() {
            return this.formatDate(this.dailyMeals.date);
        },
    },
    watch: {
        schedule: function() {
            this.initMeals();
        }
    },
    methods: {
        ...mapActions(["showProgramDiet", "initSchedule", "showProgramDiet", "updateDietSchedule"]),

        initMeals() {
            this.dailyMeals = this.schedule[this.currentData.week].days[this.currentData.day];
        },

        setCurrData(day, week) {
            this.currentData.day = day + 1;
            this.currentData.week = week + 1;
            this.initMeals();
            //console.log('UPDATED CURRDATA ', this.currentData.week, this.currentData.day)
        },
        
        async createProgramDiet() {
            let meals = this.mealCount + 3;
            this.calcMealSchedule(meals);
            this.program = {
                idProgram: JSON.parse(localStorage.getItem('program')).id,
                mealsNumber: meals,
                date: this.date,
                carbohydratesDegree: 1, // 0 - низкоуглеводный, 1 - средне, 2 - высоко
                mealSchedule: this.mealSchedule
            };
            await axios.post(`${url}/api/programs/add-program-diet`, this.program).then((res) => {
                if (res.data.name === "Success") {
                    this.getProgramDiet_();
                }
            });
        },
        
        async getProgramDiet_() {
            await this.updateDietSchedule(this.currentData).then( () => {
                this.schedule = JSON.parse(localStorage.getItem('schedule'));
                console.log('! schedule changed', JSON.stringify(this.schedule[this.currentData.week].days[this.currentData.day].diet));
                this.overlay = false;
            })
            
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
        resetDialog() {
            this.overlay = true;
        },

        async resetMeals() {
            if (this.dailyMeals.diet.length) {
                let input = {
                    id: this.dailyMeals.diet[0].id_program_diet,
                }
                await axios.post(`${url}/api/programs/delete-program-diet`, input).then((res) => {
                    if (res.data.name === "Success") {
                        this.getProgramDiet_();
                    }
                });
            }
        }
    },
    mounted() {
        this.schedule = JSON.parse(localStorage.getItem('schedule'));
        this.initMeals();
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

</style>