<template>
    <div>
        <v-card
            height="70vh"
            width="80vw"
            class="px-5 py-6"
            style="background-color: #1A1A27"
        >
        <div>Укажите количество</div>
        <div>
            {{prod.name}}
        </div>    
        
        <v-slider
            class="my-4"
            v-model="val"
            :color="'#fff'"
        ></v-slider>
         <v-simple-table style="background-color: #1A1A27">
            <template v-slot:default>
            <tbody>
                <tr>
                    <td>Белки</td>
                    <td>{{Math.round( prod.proteins * val)}}</td>
                </tr>
                <tr>
                    <td>Жиры</td>
                    <td>{{Math.round( prod.fats * val)}}</td>
                </tr>
                <tr>
                    <td>Углеводы</td>
                    <td>{{Math.round( prod.carbohydrates * val)}}</td>
                </tr>
                <tr>
                    <td>Клетчатка</td>
                    <td>{{Math.round( prod.fibers * val)}}</td>
                </tr>
                <tr>
                    <td>Калории</td>
                    <td>{{Math.round( prod.calories * val)}}</td>
                </tr>
                <tr>
                    <td>ГИ</td>
                    <td>{{Math.round( prod.glycemic_index * val)}}</td>
                </tr>

            </tbody>
            </template>
        </v-simple-table>
        <div>
            <div>Отмена</div>
            <v-btn>Добавить</v-btn>
        </div>
        </v-card>
        
    </div>
</template>

<script>
export default {
    data: () => ({
        val: 0,
    }),
    props: {prod: {}},
    computed: [

    ]
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.t-column {
    font-family: "Inter-Regular", sans-serif;
    width: 20%;
    text-align: left;
}


</style>