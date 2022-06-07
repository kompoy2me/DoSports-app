<template>
  <div>
    <template>
        <v-sheet
            max-width="100%"
            style="background-color: #1A1A27"
            height="18vh"
        >
        <v-slide-group
                v-model="modelWeeks"
                center-active
                :show-arrows="false"
                mandatory
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
                mandatory
                
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
        modelDays: 0,
        modelWeeks: 0,
    }),
    watch: {
        modelDays: function () {
            this.getDayWeek();
        },
        modelWeeks: function () {
            this.getDayWeek();
        }
    },
    methods: {
        getDayWeek() {
            this.$emit('curr-data', this.modelDays, this.modelWeeks);
        },
        
        nowWeek() {
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            console.log('1 day ', schedule['1'].days['1'].date);
            if (Object.keys(schedule).length) {
                let startDate = new Date(schedule['1'].days['1'].date).getTime();
                let nowDate = new Date().getTime();
                let oneDay = 1000 * 60 * 60 * 24;
                let difference = Math.round((nowDate - startDate) / oneDay);
                if (difference < 7) {
                    this.modelWeeks  = 0;
                } else if (difference < 14) {
                    this.modelWeeks = 1;
                } else {
                    this.modelWeeks = 2;
                }
            }
            console.log('WEEK ', this.modelWeeks);
        },

        nowDay() {
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            if (Object.keys(schedule).length) {
                let startDate = new Date(schedule['1'].days['1'].date).getTime();
                console.log('first day', schedule['1'].days['1'].date );

                let nowDate = new Date().getTime();
                let oneDay = 1000 * 60 * 60 * 24;
                let difference = Math.round((nowDate - startDate) / oneDay) % 7;
                difference = difference <= 21 ? difference % 7 : 7;
                this.modelDays = difference;
                console.log('DAY ',this.modelDays);
                
            }
        },
    },
    created() {
        this.nowWeek();
        this.nowDay();
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.v-card {
    font-family: "Inter-Regular", sans-serif;
}
</style>