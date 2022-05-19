<template>
  <div>
    <template>
        <v-sheet
            class="mx-auto"
            elevation="8"
            max-width="800"
            style="background-color: #1A1A27"
        >
        <v-slide-group
                v-model="modelWeeks"
                center-active
                :show-arrows="false"
                class="pt-4"
            >
                <v-slide-item
                    v-for="n in 3"
                    :key="n"
                    v-slot="{ active, toggle }"
                    class="d-flex justify-center align-center"
                    style="background-color: #1A1A27"
                >
                    <v-card
                        :class="active ? 'primary--text' : ''"
                        height="50"
                        width="300"
                        elevation="0"
                        @click="toggle"
                    > Неделя {{n}}
                    </v-card>
                </v-slide-item>
            </v-slide-group>
            <v-slide-group
                v-model="modelDays"
                center-active
                show-arrows
                class="pb-2"
            >
                <v-slide-item
                    v-for="n in 7"
                    :key="n"
                    v-slot="{ active, toggle }"
                    class="d-flex justify-center align-center"
                    style="background-color: #1A1A27"
                >
                    
                    <v-card
                        :class="active ? 'primary--text' : ''"
                        height="50"
                        width="100"
                        @click="toggle"
                        elevation="0"
                    > День {{n}}
                    </v-card>
                </v-slide-item>
            </v-slide-group>
        </v-sheet>
    </template>
  </div>
</template>

<script>
export default {
    data: () => ({
        modelDays: null,
        modelWeeks:null
    })
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.v-card {
    font-family: "Inter-Regular", sans-serif;
}
</style>