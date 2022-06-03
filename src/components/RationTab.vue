<template>
  <div>
      <v-card style="background-color: #1A1A27" class="pa-4 pb-0">

        <div v-if="edit" 
            class="d-flex justify-space-between align-center">

            <div class="line-limit-length mr-4" 
                style="font-size: 16pt"
                @click="editRation(ration)">
                {{ration.name}} 
            </div>

            <div 
                style="font-size: 10pt"
                @click="delRation(ration)"
            >
                Удалить
            </div>
        </div>

        <div v-else>
            <div class="d-flex justify-space-between align-center">
                <div class="line-limit-length mr-4" style="font-size: 16pt">
                {{ration.name}} 
                </div>
                <div 
                    style="font-size: 11pt;"
                    @click="addToMeal(ration)"
                >
                    Добавить
                </div>
            </div>
        </div>

        <div 
        class="pa-4"
        style="font-size:10pt; color: #b5b5b8"
        v-if="ration.foods.length === 0">
            Продукты еще не добавлены
        </div>
        <div v-else>
            <v-expand-transition>
                <div v-show="show">
                    <div>
                        <div class="py-4">
                           <div 
                                class="px-4 py-1"
                                v-for="food in ration.foods"
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
                                    <td>{{( ration.proteins).toFixed(1)}}</td>
                                </tr>
                                <tr>
                                    <td>Жиры</td>
                                    <td>{{( ration.fats).toFixed(1)}}</td>
                                </tr>
                                <tr>
                                    <td>Углеводы</td>
                                    <td>{{( ration.carbohydrates).toFixed(1)}}</td>
                                </tr>
                                <tr>
                                    <td>Калории</td>
                                    <td>{{( ration.calories).toFixed(1)}}</td>
                                </tr>
                                <tr>
                                    <td>Клетчатка</td>
                                    <td>{{( ration.fibers).toFixed(1)}}</td>
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
        ration: {},
        edit: null,
       // currDate: {}
    },
    data: () => ({
        show: false,
    }),
    
    methods: {
        ...mapActions([]),
        openMeal() {
            /*
            this.setCurrMeal(this.meal);
            this.setCurrDate(this.currDate);
            this.$router.push({ name: 'edit-meal'})*/
        },

        editRation(ration) {
            this.$emit('edit-ration', ration);
        },

        delRation(ration) {
            this.$emit('del-ration', ration);
        },

        addToMeal(ration) {
            this.$emit('add-ration', ration);
        }
    },
    computed: {
        ...mapGetters(['currMeal'])
    }
}
</script>

<style>
.line-limit-length {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
}
</style>