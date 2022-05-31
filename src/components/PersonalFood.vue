<template>
  <div class="person-food-main">

      <div v-if="pageStatus === 'prods'">
        <div class="person-food-head"></div>

        <div class="person-food-body">
            <div v-if="selfFoods.length === 0" class="px-4">
                <div >Здесь будет отображаться информация о ваших продуктах.</div>
            </div>

            <div v-else>
                <div style="text-align: center; font-size: 10pt; color:#B5B5B8" class="px-10 py-6">Вы можете отредактировать продукт, нажав на его название</div>
                <div 
                    class="mb-4"
                    v-for="food in selfFoods"
                    :key="food.id"
                >
                    <prod-table 
                        @edit-food="openSelfFood(food)" 
                        @del-food="deleteSelfFood(food)"
                        :food="food">
                    </prod-table>
                </div>
            </div>
            <div class="pa-4">
                <v-btn
                    @click="createFood"
                >Добавить</v-btn>
            </div>
        </div>
      </div>

      <div v-if="pageStatus === 'load'"
        class="load">
            <v-progress-circular 
                :width="4"
                :size="40"
                indeterminate
                color="#004BD7"
            ></v-progress-circular>
      </div>

      <div v-if="pageStatus === 'add' || pageStatus === 'edit'">
            <div class="px-6 my-8">

                <v-form  ref="form" class="mb-8" lazy-validation>
                    
                    <div v-if="pageStatus === 'add'" class="headline-self-prod">Добавление своего продукта</div>
                    <div v-else class="headline-self-prod">Редактирование своего продукта</div>
                    
                    <div class="py-4">
                        <label>Название продукта</label>
                        <v-text-field
                            :rules="rules.name"
                            v-model="food.name"
                            hide-details="auto"
                            outlined
                            required
                        ></v-text-field>
                    </div>
                    
                    <label>Категория</label>
                    <v-select
                        v-model="food.idCategory"
                        :append-icon="'mdi-chevron-down'"
                        :items="foodCategories"
                        :item-text="'name'"
                        :item-value="'id'"
                        hide-details="auto"
                        outlined
                        required
                    ></v-select>

                    <div class="my-4"> Укажите основные параметры продукта на 100 г.</div>
                    <div class="d-flex justify-space-between mb-4">
                        <div class="mr-4">
                            <label>Белки</label>
                                <v-text-field
                                class="input"
                                v-model="food.proteins"
                                type="number"
                                :rules="rules.value"
                                hide-details="auto"
                                outlined
                            >
                            </v-text-field>
                        </div>
                        <div>
                            <label>Жиры</label>
                            <v-text-field
                                class="input weight"
                                v-model="food.fats"
                                type="number"
                                :rules="rules.value"
                                hide-details="auto"
                                outlined
                            >
                            </v-text-field>
                        </div>
                    </div>

                    <div class="d-flex justify-space-between mb-4">
                        <div class="mr-4">
                            <label>Углеводы</label>
                            <v-text-field
                                class="input"
                                v-model="food.carbohydrates"
                                type="number"
                                :rules="rules.value"
                                hide-details="auto"
                                outlined
                            >
                            </v-text-field>
                        </div>
                        <div >
                            <label>Клетчатка</label>
                            <v-text-field
                                class="input weight"
                                v-model="food.fibers"
                                type="number"
                                :rules="rules.value"
                                hide-details="auto"
                                outlined
                            >
                            </v-text-field>
                        </div>
                    </div>

                    <div class="d-flex justify-space-between mb-8">
                        <div class="mr-4">
                            <label>Калории</label>
                            <v-text-field
                                class="input"
                                v-model="food.calories"
                                type="number"
                                :rules="rules.value"
                                hide-details="auto"
                                outlined
                            >
                            </v-text-field>
                        </div>
                        <div>
                            <label>ГИ</label>
                            <v-text-field
                                class="input weight"
                                v-model="food.glycemicIndex"
                                type="number"
                                :rules="rules.value"
                                hide-details="auto"
                                outlined
                            >
                            </v-text-field>
                        </div>
                    </div>

                    <div class="d-flex justify-space-between">
                        <v-btn
                            style="font-size:11pt; width:40%; background-color: #363649 !important"
                            @click="cancel"
                        >
                            Отменить</v-btn>
                        <div v-if="pageStatus === 'add'" style="width:55%">
                            <v-btn
                            width="100%"
                            style="font-size:11pt"
                            @click="addPersonalFood"
                            >Добавить</v-btn>
                        </div>
                        <div v-else style="width:55%">
                            <v-btn
                            width="100%"
                            style="font-size:11pt"
                            @click="editPersonalFood"
                            >Сохранить</v-btn>
                        </div>
                        
                    </div>
                </v-form>
            </div>
      </div>

  </div>
</template>

<script>
import axios from "axios";
import url from "@/services/url";
import ProdTable from './ProdTable.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
    components: {ProdTable},
    data: () => ({
        food: {
            id: 0,
            name: "",
            idCategory: 1,
            proteins: "",
            fats: "",
            carbohydrates: "",
            fibers: "",
            calories: "",
            glycemicIndex: "",
            idAuthor: 0,
        },
        pageStatus: 'load',
        selfFoods: [],
         rules: {
            name: [
                v => !!v || 'Введите название',
            ],
            value: [
                v => v !== '' || 'Введите значение',
                v => v >= 0 || 'Введите значение',
            ],
        }
    }),
    
    methods: {
        
        ...mapActions(["showFoodCategories","showPersonalFoods"]),

        openSelfFood(food) {
            food.glycemicIndex = food.glycemic_index;
            food.idCategory = food.id_food_category;
            this.food = food;
            this.pageStatus = 'edit';            
        },

        async deleteSelfFood(food) {
            if (navigator.connection.type != "none") {
                this.pageStatus = 'load';
                let input_food = {
                    id: food.id,
                }
                await axios.post(`${url}/api/programs/delete-personal-food`, input_food).then(async (res) => {
                    console.log(JSON.stringify(res));
                    if (res.data.name === "Success") {
                        this.getPersonalFoods();
                    }
                });
            }
        },

        createFood() {
            this.pageStatus = 'add';
        },

        cancel() {
            this.food = {
                id: 0,
                name: "",
                idCategory: 1,
                proteins: "",
                fats: "",
                carbohydrates: "",
                fibers: "",
                calories: "",
                glycemicIndex: ""
            };
            this.pageStatus = 'prods';
        },

        async editPersonalFood() {
            if (navigator.connection.type != "none") {
                if (this.$refs.form.validate()) {
                    this.pageStatus = 'load';
                    this.food.idAuthor = JSON.parse(localStorage.getItem('user')).id;
                    console.log(JSON.stringify(this.food));
                    await axios.post(`${url}/api/programs/update-personal-food`, this.food).then(async (res) => {
                        if (res.data.name === "Success") {
                            this.getPersonalFoods();
                        }
                    });
                }
            }

        },

        async addPersonalFood() {
            if (navigator.connection.type != "none") {
                if (this.$refs.form.validate()) {
                    this.pageStatus = 'load';
                    this.food.idAuthor = JSON.parse(localStorage.getItem('user')).id;
                    console.log(JSON.stringify(this.food));
                    await axios.post(`${url}/api/programs/add-personal-food`, this.food).then(async (res) => {
                        if (res.data.name === "Success") {
                            this.getPersonalFoods();
                        }
                    });
                }
            }
            
        },

        updatePersonal() {
            this.selfFoods = JSON.parse(localStorage.getItem('personal-foods'));
        },

        async getPersonalFoods() {
            if (navigator.connection.type != "none") {
                let id = JSON.parse(localStorage.getItem('user')).id;
                this.showPersonalFoods(id).then(() => {
                    localStorage.setItem('personal-foods', JSON.stringify(this.personalFoods));
                    this.updatePersonal();
                    this.pageStatus = 'prods';
                }) 
            }   
        }
    },
    computed: {
        ...mapGetters(["foodCategories","personalFoods"])
    },
    mounted() {
        this.showFoodCategories();
        this.getPersonalFoods();
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.person-food-main {
    font-family: "Inter-Regular", sans-serif;
    overflow: auto;
    height: 92vh;
    position: relative;
}
.load {
    text-align: center;
    margin-top: 20vh;
}
label {
    font-size: 10pt !important;
    color: #B5B5B8;
}
.headline-self-prod {
    font-size: 18pt;
}
</style>