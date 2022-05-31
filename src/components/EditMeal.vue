<template>
    <div >

        <div class="main-edit-meal" v-if="pageStatus === 'meal' && meal" >
            <div class="pt-4 meal-edit-head">
                <div style="width:100%;" class="px-4">
                    <v-icon class="mb-4"
                        @click="$router.push({ name: 'diary'}).catch(err => {})"
                    >
                        mdi-arrow-left
                    </v-icon>
                    <h2 class="d-flex justify-center">
                        {{meal.time}}
                    </h2>
                </div>
            </div>
            <div class="meal-edit-body">
                <v-simple-table class="px-6 pb-4 mb-4" style="background-color: #1A1A27">
                    <template v-slot:default>
                        <tbody>
                            <tr>
                                <td>Белки</td>
                                <td>{{( meal.proteins).toFixed(1)}}</td>
                            </tr>
                            <tr>
                                <td>Жиры</td>
                                <td>{{( meal.fats).toFixed(1)}}</td>
                            </tr>
                            <tr>
                                <td>Углеводы</td>
                                <td>{{( meal.carbohydrates).toFixed(1)}}</td>
                            </tr>
                            <tr>
                                <td>Калории</td>
                                <td>{{( meal.calories).toFixed(1)}}</td>
                            </tr>
                            <tr>
                                <td>Клетчатка</td>
                                <td>{{( meal.fibers).toFixed(1)}}</td>
                            </tr>
                            <tr>
                                <td>Гликемический индекс</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>

                <div style="text-align: center; font-size: 10pt; color:#B5B5B8" class="px-10 py-4">Вы можете отредактировать продукт, нажав на его название</div>

                <div class="mt-4"
                    v-for="food in meal.foods"
                    :key="food.id"
                >   
                    <prod-table
                        @edit-food="openFood" 
                        @del-food="deleteFood"
                        :food="food"></prod-table>
                </div>
                <v-btn
                    @click="addMeal"
                    class="ml-4 mb-8"
                >Добавить</v-btn>
            </div>
        </div>

        <div v-if="pageStatus === 'search' " >
            <product-list 
                @add-prod="addFood"
                @back="pageStatus = 'meal'"
                :meal="meal">
            </product-list>
        </div>

        <div v-if="pageStatus === 'load'" class="load">
            <v-progress-circular 
                :width="4"
                :size="40"
                indeterminate
                color="#004BD7"
            ></v-progress-circular>
        </div>

        <v-overlay
            :color="'#000'"
            opacity=0.8
            v-model="over"
        >
            <v-card
                    width="80vw"
                    class="px-5 py-6 mt-10"
                    style="background-color: #1A1A27"
                >
                <div style="font-size:11pt">Укажите новое количество</div>
                <div style="font-size:14pt">
                    {{editFood.name}}
                </div> 
                <div style="width:100%; text-align:center; font-size: 16pt;">
                    {{value}}г
                </div>
                <v-slider
                    max="1000"
                    min="0"
                    step="5"
                    v-model="value"
                    :color="'#fff'"
                ></v-slider>
                    <v-simple-table class="mb-4" style="background-color: #1A1A27">
                        <template v-slot:default>
                            <tbody>
                                <tr>
                                    <td>Белки</td>
                                    <td>{{( editFood.proteins * value / 100).toFixed(1)}}</td>
                                </tr>
                                <tr>
                                    <td>Жиры</td>
                                    <td>{{( editFood.fats * value / 100).toFixed(1)}}</td>
                                </tr>
                                <tr>
                                    <td>Углеводы</td>
                                    <td>{{( editFood.carbohydrates * value / 100).toFixed(1)}}</td>
                                </tr>
                                <tr>
                                    <td>Клетчатка</td>
                                    <td>{{( editFood.fibers * value / 100).toFixed(1)}}</td>
                                </tr>
                                <tr>
                                    <td>Калории</td>
                                    <td>{{( editFood.calories * value / 100).toFixed(1)}}</td>
                                </tr>
                                <tr>
                                    <td>ГИ</td>
                                    <td>{{ editFood.glycemic_index }}</td>
                                </tr>

                            </tbody>
                        </template>
                    </v-simple-table>
                    <div class="d-flex justify-space-between">
                        <v-btn
                            style="font-size:11pt; width:40%; background-color: #363649 !important"
                            @click="over = false"
                        >
                            Отменить</v-btn>
                        <v-btn
                            @click="changeFood"
                            style="font-size:11pt; width:55%; "
                            >Сохранить</v-btn>
                    </div>
                </v-card>
        </v-overlay>
            
    </div>
</template>    

<script>
/*eslint-disable*/
import axios from "axios";
import url from "@/services/url";
import { mapGetters, mapActions } from 'vuex'
import ProdTable from './ProdTable.vue'
import ProductList from './ProductList.vue'
export default {
    components: {ProdTable, ProductList},

    data: () => ({
        meal: {},
        pageStatus: 'load',
        mealsLoad: false,
        overlay: false,
        search: false,
        currentDate: {},
        mealIndex: null,
        show: false,
        over: false,
        value: 100,
        editFood: {},
    }),

    computed: {
        ...mapGetters(['currMeal', 'currDate']),

    },
    watch: {

    },
    methods: {
        ...mapActions(["updateDietSchedule"]),

        addMeal() {
            this.pageStatus = 'search';
        },

        async addFood(id, val) {
            this.pageStatus = 'load';
            let food = {
                idFood: id,
                amount: val,
                idMeal: this.meal.id,
            };
            console.log('DATA to add', JSON.stringify(food))
            await axios.post(`${url}/api/programs/add-meal-food`, food).then((res) => {
                if (res.data.name === "Success") {
                    this.updateDiet();
                }
            })
        },

        openFood(food) {
            console.log(JSON.stringify(food));
            this.editFood = food;
            this.value = food.amount;
            this.over = true;
            
        },

        async changeFood() {
            this.pageStatus = 'load';
            this.over = false;
            let food = {
                id: this.editFood.id,
                amount: this.value,
            };
            console.log(JSON.stringify(food))
            await axios.post(`${url}/api/programs/update-amount-food`, food).then((res) => {
                if (res.data.name === "Success") {
                   this.updateDiet();
                   
                }
            })
        },

        async deleteFood(id) {
            this.pageStatus = 'load';
            let food = {
                id: id
            }
            await axios.post(`${url}/api/programs/delete-meal-food`, food).then((res) => {
                if (res.data.name === "Success") {
                    this.updateDiet();
                }
            });
        },

        async updateDiet() {
            this.currentDate = this.currDate;
            await this.updateDietSchedule(this.currentDate).then( () => {
                this.initFoods();         
            })
        },

        initFoods() {
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            this.meal = schedule[this.currentDate.week].days[this.currentDate.day].diet[this.mealIndex];
            this.pageStatus = 'meal';
        },
        
        getMealId() {
            this.currentDate = this.currDate;
            this.meal = this.currMeal;

            let schedule = JSON.parse(localStorage.getItem('schedule'));
            let meal = schedule[this.currentDate.week].days[this.currentDate.day].diet;        
            for (let i = 0; i<meal.length; i++) {
                if (meal[i].id === this.meal.id) {
                    this.mealIndex = i;
                    break
                }
            }
        }
    },

    mounted() {
        this.getMealId();
        this.initFoods();
    }
    
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.main-edit-meal {
    overflow: auto;
    height: 92vh;
    position: relative;
}
.meal-edit-head {
    height: 18%;
    position: relative;
    background-color: #1A1A27;
}
.meal-edit-body {
    overflow: auto;
    height: 82%;
}
.load {
    text-align: center;
    margin-top: 40vh;
}
</style>