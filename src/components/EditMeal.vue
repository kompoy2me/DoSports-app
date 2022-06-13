<template>
    <div >

        <div class="main-edit-meal" v-if="pageStatus === 'meal' && meal" >
            <div class="pt-6 meal-edit-head">
                <div class="px-4">
                    <div>
                        <img 
                        class="ml-2"
                        :width=54
                        @click="$router.push({ name: 'diary'}).catch(err => {})"
                        :src="require('@/assets/img/png/arrow-back--white1.png')">
                    </div>
                   
                    <h2 class="d-flex justify-center mt-4">
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
                
                <div v-if="meal.foods && meal.foods.length === 0">
                <div style="text-align: center; font-size: 10pt; color:#B5B5B8" class="px-10 py-8">Вы еще не добавляли продукты в этот прием пищи</div>
                    <div class="d-flex justify-space-between align-center mx-4">
                        <v-btn
                            @click="addMeal"
                        >Добавить</v-btn>
                        <v-btn
                            outlined
                            style="background-color: #090914 !important"
                            @click="addNewRation"
                        >Добавить рацион</v-btn>
                    </div>
                </div>

                <div v-else >
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
                    <div class="d-flex justify-space-between align-center mx-4 my-8">
                        <v-btn
                            @click="addMeal"
                        >Добавить</v-btn>
                        <v-btn
                            outlined
                            style="background-color: #090914 !important"
                            @click="createNewRation"
                        >Создать рацион</v-btn>
                    </div>
                </div>
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

        <div v-if="pageStatus === 'ration-add'" class="mx-4">
            <div class="d-flex align-center">
                <img
                    class="my-8 ml-2" 
                    :width=54
                    @click="pageStatus = 'meal'"
                    :src="require('@/assets/img/png/arrow-back--white1.png')">
            </div>
            <div v-if="personRations.length === 0">
                <div>У вас еще нет созданных рационов. Создать рацион можно после формирования приема пищи.</div>
            </div>
            <div  v-else>
                <div class="my-3" v-for="ration in personRations"
                    :key="ration.id"
                >
                    <ration-tab 
                        :ration="ration" 
                        :edit="false" 
                        @add-ration="addRationToMeal"
                    ></ration-tab>
                </div>
            </div>
            
        </div>

        <v-overlay
            :color="'#000'"
            opacity=0.8
            v-model="over"
        >
            <v-card v-if="overlayStatus === 'edit'"
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

            <v-card v-if="overlayStatus === 'ration-create'"
                width="90vw"
                class="pa-4"
            >
                <div class="headline-self-prod">Создание рациона</div>
                <v-form ref="form" lazy-validation>
                    <div class="my-4">
                        <label>Название рациона</label>
                        <v-text-field
                            v-model="ration.name"
                            :rules="rules.name"
                            hide-details="auto"
                            outlined
                            require
                        ></v-text-field>
                    </div>
                    
                    <div class="d-flex justify-space-between align-center">
                        <v-btn
                            style="font-size:11pt; width:40%; background-color: #363649 !important"
                            @click="cancelRation"
                        >
                            Отменить</v-btn>
                        <v-btn
                            style="width:56%; background-color: #004BD7 !important"
                            @click="createRation"
                        >Создать</v-btn> 
                    </div>
                </v-form>               
                    
            </v-card>
        </v-overlay>

        <v-dialog
            v-model="dialog"
        >
            <alert-message :msg='msg' @clicked="dialog = false"></alert-message>
        </v-dialog>
            
    </div>
</template>    

<script>
/*eslint-disable*/
import axios from "axios";
import url from "@/services/url";
import { mapGetters, mapActions } from 'vuex';
import ProdTable from './ProdTable.vue';
import ProductList from './ProductList.vue';
import RationTab from "./RationTab.vue";
import AlertMessage from "./AlertMessage.vue";
export default {
    components: {ProdTable, ProductList, RationTab, AlertMessage},

    data: () => ({
        ration: {
            name: "",
            foods: [],
            idUser: 0,
        },
        meal: {},
        msg: {title: 'Рацион успешно создан!', text: 'Для просмотра и редактирования рациона перейдите в пункт меню “Мои рационы”.'},
        pageStatus: 'load',
        overlayStatus: 'edit',
        currentDate: {},
        mealIndex: null,
        over: false,
        dialog: false,
        value: 100,
        editFood: {},
        personRations: [],
        rules: {
            name: [
                v => !!v || "Введите название"
            ]
        },
    }),

    computed: {
        ...mapGetters(['currMeal', 'currDate']),

    },
    watch: {

    },
    methods: {
        ...mapActions(["updateDietSchedule","showRations"]),

        addMeal() {
            this.pageStatus = 'search';
        },

        async addFood(id, val) {
            if (navigator.connection.type != "none") {
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
            }
            
        },

        cancelRation() {
            this.over=false; 
            this.overlayStatus = 'edit'; 
            this.ration.name = '';
        },

        openFood(food) {
            console.log(JSON.stringify(food));
            this.editFood = food;
            this.value = food.amount;
            this.over = true;
        },

        async changeFood() {
            if (navigator.connection.type != "none") {
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
            }
            
        },

        async deleteFood(id) {
            if (navigator.connection.type != "none") {
                this.pageStatus = 'load';
                let food = {
                    id: id
                }
                await axios.post(`${url}/api/programs/delete-meal-food`, food).then((res) => {
                    if (res.data.name === "Success") {
                        this.updateDiet();
                    }
                });
            }
            
        },

        createNewRation() {
            this.overlayStatus = 'ration-create';
            this.over = true;
        },

        async createRation() {
            if (navigator.connection.type != "none") {
                if (this.$refs.form.validate()) {
                    this.over = false;
                    this.pageStatus = 'load';

                    this.ration.foods = this.meal.foods;
                    this.ration.idUser = JSON.parse(localStorage.getItem('user')).id;
                    console.log(JSON.stringify(this.ration));
                    await axios.post(`${url}/api/programs/add-ration`, this.ration).then((res) => {
                        if (res.data.name === "Success") {
                            this.updateDiet();
                            this.ration.name = '';
                            this.dialog = true;
                            
                        }
                    });
                }
            }
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
        },

        async getPersonRations() {
            if (navigator.connection.type != "none") {
                this.pageStatus = 'load';
                let id = JSON.parse(localStorage.getItem('user')).id;
                await this.showRations(id).then(async () => {
                    this.personRations = JSON.parse( localStorage.getItem('rations'));
                });
            }
        },

        async addNewRation() {
            this.over = false;
            await this.getPersonRations().then(() => {
                this.pageStatus = 'ration-add'; 
            }) 
        },

        async addRationToMeal(ration) {
            if (navigator.connection.type != "none") {
                this.pageStatus = 'load'
                let inputRation = {
                    idMeal: this.meal.id,
                    foods: ration.foods,
                }
                console.log(JSON.stringify(inputRation))
                await axios.post(`${url}/api/programs/add-ration-to-meal`, inputRation).then((res) => {
                    if (res.data.name === "Success") {
                        this.updateDiet();
                    }
                })
        
            }
            
        },
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
.headline-self-prod {
    font-size: 18pt;
}

</style>