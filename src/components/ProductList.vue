<template>
    <div class="search-main">

        <div class="pa-4 ma-0 search-head">
            <v-icon class="mb-4"
                @click="backToEdit"
            >
                mdi-arrow-left
            </v-icon>
            <!--Поиск продукта-->
            <v-text-field
                class="my-4"
                v-model="foodName"
                label="Название продукта..."
                outlined
                hide-details
                :append-icon="'mdi-magnify'"
            ></v-text-field>
            <div class="d-flex justify-space-between">
                <div style="width:45%">
                    <v-select
                        v-model="idCategory"
                        :append-icon="'mdi-chevron-down'"
                        :items="this.foodCats"
                        :item-text="'name'"
                        :item-value="'id'"
                        label="Все категории"
                        outlined
                    ></v-select>
                </div>
                <v-btn
                    @click="personProdsOn"
                    outlined
                    style="background-color: #363649 !important"
                    >{{userProds}}</v-btn>
            </div>
        </div>

        <div class="search-body">
            <!--Отрисовка продуктов в цикле-->
            <div
                class="my-4"
            >
                <div 
                    v-for="food in foodsFiltered" 
                    :key="food.id"
                    @click="checkItem(food)"
                    >
                    <prod-table-light :food="food"></prod-table-light>
                </div>
            </div>
        
            <v-overlay
            :color="'#000'"
            opacity=0.8
            v-model="overlay">
                <v-card
                    width="80vw"
                    class="px-5 py-6 mt-10"
                    style="background-color: #1A1A27"
                >
                <div style="font-size:11pt">Укажите количество</div>
                <div style="font-size:14pt">
                    {{checkedProd.name}}
                </div>    
                <div style="width:100%; text-align:center; font-size: 16pt;">
                    {{val}}г
                </div>
                <v-slider
                    max="1000"
                    min="0"
                    step="5"
                    v-model="val"
                    :color="'#fff'"
                ></v-slider>
                <v-simple-table class="mb-4" style="background-color: #1A1A27">
                    <template v-slot:default>
                        <tbody>
                            <tr>
                                <td>Белки</td>
                                <td>{{Math.round( checkedProd.proteins * val / 100)}}</td>
                            </tr>
                            <tr>
                                <td>Жиры</td>
                                <td>{{Math.round( checkedProd.fats * val / 100)}}</td>
                            </tr>
                            <tr>
                                <td>Углеводы</td>
                                <td>{{Math.round( checkedProd.carbohydrates * val / 100)}}</td>
                            </tr>
                            <tr>
                                <td>Клетчатка</td>
                                <td>{{Math.round( checkedProd.fibers * val / 100)}}</td>
                            </tr>
                            <tr>
                                <td>Калории</td>
                                <td>{{Math.round( checkedProd.calories * val / 100)}}</td>
                            </tr>
                            <tr>
                                <td>ГИ</td>
                                <td>{{checkedProd.glycemic_index }}</td>
                            </tr>

                        </tbody>
                    </template>
                    </v-simple-table>
                    <div class="d-flex justify-space-between">
                        <v-btn
                            style="font-size:11pt; width:40%; background-color: #363649 !important"
                            @click="cancel"
                        >
                            Отменить</v-btn>
                        <v-btn
                            @click="addFood"
                            style="font-size:11pt; width:55%; "
                            >Добавить</v-btn>
                    </div>
                </v-card>
            </v-overlay>
        </div>

    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import ProdTableLight from "./ProdTableLight.vue";
export default {
    components: {ProdTableLight}, 
    data: () => ({
        foods: [],
        foodName: "",
        overlay: false,
        checkedProd: {},
        val: 100,
        idCategory: 0,
        userProds: 'Мои продукты',
        
        allFoods: [],
        selfFoods: [],
    }),
	methods: {
        ...mapActions(["showFoods", "updateDietSchedule", "showFoodCategories", "showPersonalFoods"]),

        checkItem(food) {
            this.overlay = true;
            this.checkedProd = food;
        },

        cancel() {
            this.overlay = false;
            this.val = 0;
        },

        addFood() {
            this.$emit('add-prod', this.checkedProd.id, this.val);
        },
        backToEdit() {
            this.$emit('back');
        },

        async getPersonalFoods() {
            if (navigator.connection.type != "none") {
                let id = JSON.parse(localStorage.getItem('user')).id;
                this.showPersonalFoods(id).then(() => {
                    localStorage.setItem('personal-foods', JSON.stringify(this.personalFoods));
                }) 
            }   
        },

        personProdsOn() {
            if (this.userProds === 'Мои продукты') {
                this.foods = this.personalFoods;
                this.userProds = 'Все продукты';
            }
            else {
                this.foods = this.getFoods;
                this.userProds = 'Мои продукты';
            }
            
        }
    },
    computed: {
        ...mapGetters(["getFoods", "currDate", "currMeal", "foodCategories", "personalFoods"]),

        foodCats() {
            if (this.foodCategories) {
                let cats = Array.from(this.foodCategories);
                cats.splice(0, 0, {id: 0, name: "Все категории"});
                return cats;
            }
            return [];
        },

        foodsFiltered() {
            if (!this.foods) {
                return [];
            }
            let foods = Array.from(this.foods);
            if (this.idCategory && this.foodName) {
                foods = this.foods.filter(obj => obj.id_food_category === this.idCategory && obj.name.toLowerCase().includes(this.foodName.toLowerCase()));
            } else if (this.idCategory) {
                foods = this.foods.filter(obj => obj.id_food_category === this.idCategory);
            } else if (this.foodName) {
                foods = this.foods.filter(obj => obj.name.toLowerCase().includes(this.foodName.toLowerCase()));
            }
            return foods;
        },
        
    },
    mounted() {
        this.showFoods().then(()=>{
            this.foods = this.getFoods;
        });
        this.showFoodCategories();
        this.getPersonalFoods();
        
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.search-main {
    overflow: auto;
    height: 92vh;
    position: relative;
}
.search-head {
    position: relative;
    min-height: 36%;
    background-color: #1A1A27;
    z-index: 5;

}
.search-body {
    overflow: auto;
    height: 64%;
    z-index: 0;
}
</style>