<template>
    <div>
        <div v-if="meals===0" class="pa-4">
            <div>Сегодня вы еще не устанавливали приемы пищи.</div>
            <v-btn
                @click="overlay = true"
            >Установить</v-btn>
        </div>
        <v-overlay
        :color="'#000'"
        opacity=0.8
        v-model="overlay">
            <v-card
                style="background-color: #1A1A27;"
                max-width="80vw"
                class="px-5 py-6"
            >
                <div class="headline"
                >Установка приемов пищи на день</div>
                <div class="hint-text">
                    Изменить количество приемов можно будет только удалив и заново создав текущий день.
                    Для каждого приема автоматически установится время. Его вы сможете изменить, когда захотите.
                </div>
                <template>
                    <v-sheet
                        class="ma-0 pa-0"
                    >
                        <v-slide-group
                        v-model="meals"
                        center-active
                        show-arrows
                        >
                        <v-slide-item
                            v-for="n in 10"
                            :key="n"
                            class="d-flex justify-center align-center"
                            style="background-color: #1A1A27; border: #fff solid;"
                            v-slot="{ active, toggle }"
                        >  
                            <v-card
                            :class="active ? 'primary--text' : ''"
                            class="ma-4"
                            height="50"
                            width="200"
                            @click="toggle"
                            >
                            <v-row
                                class="fill-height"
                                align="center"
                                justify="center"
                            >{{n}}
                                <v-scale-transition></v-scale-transition>
                            </v-row>
                            </v-card>
                        </v-slide-item>
                        </v-slide-group>
                    </v-sheet>
                </template>
                <v-btn
                    width="100%"
                    @click="overlay = false"
                >Готово</v-btn>
            </v-card>
            
        </v-overlay>
  </div>
</template>

<script>
export default {
    data: () => ({
        overlay: false,
        model: null,
        meals: 0,
    }),
}
</script>

<style scoped lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.v-card {
    font-family: "Inter-Regular", sans-serif;
}
.v-slide-group__next,
.v-slide-group__prev {
    min-width: 20px;
    margin: 0;
    padding: 0;
}
.hint-text {
    font-size: 18pt;
}

</style>