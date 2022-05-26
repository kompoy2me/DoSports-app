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
            <div style="font-size: 10pt; text-decoration: underline">Редактировать</div>
        </div>
        <div 
        class="pa-4"
        style="font-size:10pt; color: #b5b5b8"
        v-if="meal.foods.length === 0">
            Продукты еще не назначены
        </div>
        <div v-else>
            <v-expand-transition>
                <div v-show="show">
                    <div>
                        <v-simple-table style="background-color: #1A1A27">
                            <template v-slot:default>

                            <tbody>
                                <tr>
                                    <td>Белки</td>
                                    <td>{{Math.round( meal.proteins)}}</td>
                                </tr>
                                <tr>
                                    <td>Жиры</td>
                                    <td>{{Math.round( meal.fats)}}</td>
                                </tr>
                                <tr>
                                    <td>Углеводы</td>
                                    <td>{{Math.round( meal.carbohydrates)}}</td>
                                </tr>
                                <tr>
                                    <td>Клетчатка</td>
                                    <td>{{Math.round( meal.fibers)}}</td>
                                </tr>
                                <tr>
                                    <td>Калории</td>
                                    <td>{{Math.round( meal.calories)}}</td>
                                </tr>

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
export default {
    props: {
        meal: {}
    },
    data: () => ({
        show: false,
    })
}
</script>

<style>

</style>