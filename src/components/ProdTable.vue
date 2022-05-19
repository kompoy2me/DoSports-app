<template>
  <div>
        <v-card
            class="mx-4 mb-6 px-2 py-6"
            style="background-color: #1A1A27"
        >
          <v-simple-table style="background-color: #1A1A27">
              <thead>
                  <td colspan="6" class="pl-3 food-headline">{{food.name}}</td>
                  <tr>
                      <th>Б</th>
                      <th>Ж</th>
                      <th>У</th>
                      <th>Ккал</th>
                      <th>Кл</th>
                      <th>ГИ</th>
                  </tr>
                </thead>
                  <tr class="t-params ">
                      <th>{{food.proteins}}</th>
                      <th>{{food.fats}}</th>
                      <th>{{food.carbohydrates}}</th>
                      <th>{{food.calories}}</th>
                      <th>{{food.fibers}}</th>
                      <th>{{food.glycemic_index}}</th>
                  </tr>
              
          </v-simple-table>
      </v-card>
  </div>
</template>

<script>
export default {
    props: {
        food: {}
    },
    data: () => ({

    }),
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
</style>