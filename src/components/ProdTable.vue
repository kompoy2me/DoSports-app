<template>
  <div>
        <v-card
            class="mx-4 mb-2 px-2"
            style="background-color: #1A1A27"
        >
          <table class="py-1">
                <td colspan="6" class="food-headline ma-0 px-3 pb-3" >
                    <div class="d-flex align-top">
                        <div 
                            @click="editFood(food)"
                            class="d-flex align-top" 
                            style="width: 100%; ">

                            <div v-if="food.amount">{{food.name}} ({{food.amount}}г)</div>
                            <div v-else>{{food.name}} (100г)</div>
                        </div>
                        <div class="dele">
                            <v-icon 
                                @click="clickDel(food.id)"
                                dense>
                            mdi-window-close
                            </v-icon>
                        </div>
                    </div>
                </td>
                
                  <tr class="food-items" >
                      <th>Б</th>
                      <th>Ж</th>
                      <th>У</th>
                      <th>Ккал</th>
                      <th>Кл</th>
                      <th>ГИ</th>
                  </tr>

                  <tr v-if="food.amount" class="t-params ">
                      <th>{{(food.proteins * (food.amount/100)).toFixed(1)}}</th>
                      <th>{{(food.fats * (food.amount/100)).toFixed(1)}}</th>
                      <th>{{(food.carbohydrates * (food.amount/100)).toFixed(1)}}</th>
                      <th>{{(food.calories * (food.amount/100)).toFixed(1)}}</th>
                      <th>{{(food.fibers * (food.amount/100)).toFixed(1)}}</th>
                      <th>{{food.glycemic_index}}</th>
                  </tr>
                  <tr v-else class="t-params ">
                      <th>{{food.proteins}}</th>
                      <th>{{food.fats}}</th>
                      <th>{{food.carbohydrates}}</th>
                      <th>{{food.calories}}</th>
                      <th>{{food.fibers}}</th>
                      <th>{{food.glycemic_index}}</th>
                  </tr>
              
          </table>
      </v-card>
  </div>
</template>

<script>
export default {
    props: {
        food: {}
    },
    methods: {
        editFood(food) {
            this.$emit('edit-food', food);
        },
        clickDel(id) {
            this.$emit('del-food', id);
        },
    },
    computed: {
    },

    created() {
        /*if (!this.food.amount) {
            this.food.amount = 100;
        }*/

    }
    
}

</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.thead {
    font-family: "Inter-Regular", sans-serif;
}
.t-params {
    font-family: "Inter-Regular", sans-serif;
    font-size: 10pt;
}
.food-headline {
    font-family: "Inter-Medium", sans-serif !important;
}
table  {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
   
}
.food-items {
    font-size: 8pt;
    color: #B5B5B8;
}
.row-items {
    display: flex;
    flex-direction: row;
}
.dele {
    text-decoration: none !important;
}
</style>