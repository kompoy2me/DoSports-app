<template>
    <div>
        <!--Поиск продукта-->
        <v-text-field
            v-model="inputStr"
            label="Название продукта..."
            outlined
            :append-icon="'mdi-magnify'"
        ></v-text-field>
        
        <!--Отрисовка продуктов в цикле-->
        <div
        style="height:500px; overflow:scroll"
        >
            <div 
                v-for="food in filteredFoods" 
                :key="food.id"
                @click="checkItem(food)"
                >
                <prod-table :food="food"></prod-table>
            </div>
        </div>
        

        <v-overlay
        :color="'#000'"
        opacity=0.6
        v-model="overlay">
            <prod-cover :prod="checkedProd"></prod-cover>
            <v-btn
                @click="overlay = false"
            >Добавить</v-btn>
        </v-overlay>

    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ProdTable from "./ProdTable.vue";
import ProdCover from "./ProdCover.vue";
export default {
    components: {ProdTable, ProdCover}, 
    data: () => ({
        foods: [],
        inputStr: "",
        overlay: false,
        checkedProd: null,
    }),
	methods: {
        ...mapActions(["showFoods"]),
        //Обработка клика на продукт
        checkItem(food) {
            this.overlay = true;
            console.log(JSON.stringify(food))
            this.checkedProd = food;
            //alert(JSON.stringify(id));
        }
    },
    computed: {
        ...mapGetters(["getFoods"]),
        filteredFoods() {
            if (this.inputStr) {
                return this.foods.filter(item => {
                    return item.name.includes(this.inputStr);
                });
            }
            return this.foods;
        }
    },
    mounted() {
        this.showFoods().then(()=>{
            this.foods = this.getFoods;
        }) 
    }
}
</script>

<style>

</style>