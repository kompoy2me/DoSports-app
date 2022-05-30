<template>
  <div>
      <v-card style="background-color: #1A1A27" class="px-4 pt-5">
        <div class="meal-head">
            <div style="font-size: 16pt">
                {{meal.time}} 
            </div>
            <v-divider 
                color="#fff"
                class="mx-3"></v-divider>
            <div 
                style="font-size: 10pt; 
                text-decoration: underline"
                @click="openMeal"
            >
                Редактировать
            </div>
        </div>
        <div 
        class="pa-4"
        style="font-size:10pt; color: #b5b5b8"
        v-if="meal.foods.length === 0">
            Продукты еще не добавлены
        </div>
        <div v-else>
            <v-expand-transition>
                <div v-show="show">
                    <div>
                        <div class="py-4">
                           <div 
                                class="px-4 py-1"
                                v-for="food in meal.foods"
                                :key="food.id"
                            >
                                {{food.name}}
                            </div> 
                        </div>
                        
                        <v-simple-table style="background-color: #1A1A27">
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
                                <!--<tr>
                                    <td>Гликемический индекс</td>
                                    <td>0</td>
                                </tr>-->

                            </tbody>
                            </template>
                        </v-simple-table>
                    </div>
                </div>
            </v-expand-transition>
            <v-card-actions class="d-flex justify-center ">
                <v-btn
                    class="ma-0 pa-1"
                    icon
                    @click="show = !show"
                    style="background-color: transparent !important;"
                >
                    <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
            </v-card-actions>
        </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    props: {
        meal: {},
        currDate: {}
    },
    data: () => ({
        show: false,
    }),
    
    methods: {
        ...mapActions(['setCurrMeal', 'setCurrDate']),
        openMeal() {
            this.setCurrMeal(this.meal);
            this.setCurrDate(this.currDate);
            this.$router.push({ name: 'edit-meal'})
        }
    },
    computed: {
        ...mapGetters(['currMeal'])
    }
}
</script>

<style>

</style>