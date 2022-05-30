<template>
  <div>
        <v-card
            class="mx-4 mb-4 px-2"
            style="background-color: #1A1A27"
        >
          <table class="py-1">

                <td colspan="6" class="food-headline ma-0 px-3 pb-3" >
                    <div>{{food.name}}</div>
                </td>

                  <tr class="food-items" >
                      <th>Б</th>
                      <th>Ж</th>
                      <th>У</th>
                      <th>Ккал</th>
                      <th>Кл</th>
                      <th>ГИ</th>
                  </tr>

                  <tr class="t-params ">
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
.del {
    width: 30%;
    font-size: 10pt;
    margin-right: auto;
    text-align: right;
    vertical-align: top;
    text-decoration: underline;
    color: #FF5B5B;
}
</style>