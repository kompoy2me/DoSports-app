<template>
	<div>
        <p
            class="headline"
        >Добро пожаловать в DO SPORTS</p>
        <v-form ref="form">
        <div class="row">
            
            <div>
                <label>Рост(см)</label>
                <v-text-field 
                    v-model="program.height"
                    :rules="rules.height"
                    hide-details="auto"
                    required
                    outlined
                    color="#9196FF"
                ></v-text-field> 
            </div>   

            <div>
                <label>Вес(кг)</label>
                <v-text-field 
                    v-model="program.weight"
                    :rules="rules.weight"
                    hide-details="auto"
                    required
                    outlined
                    color="#9196FF"
                ></v-text-field>    
            </div>
        </div>
        <label>Образ жизни</label>
            <v-select
                :menu-props="{ bottom: true, offsetY: true }"
                :append-icon="'mdi-chevron-down'"
                class="input lifestyle"
                :items="this.lifestyleList"
                :item-text="'name'"
                :item-value="'id'"
                v-model="program.lifestyle"
                outlined
            ></v-select>
        
        </v-form>
    </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
export default {
    data: () => ({
        program: {
            idUser: 0,
            bmi: 0,
            height: 0,
            weight: 0,
            weightCategory: 0,
            lifestyle: 1,
            trainPrepare: "0",
            aim: "0",
            norm: {}
        },
        rules: {
            height: [
                v => v >= 50 || "Некорректный рост",
                v => v <= 300 || "Некорректный рост",
            ],
            weight: [
                v => v > 0 || "Некорректный вес",
                v => v <= 600 || "Некорректный вес",
            ]
        },
    }),
    computed: {
        ...mapGetters(["lifestyleList", "weightCategoryList", "createProgramStatus", "activeProgramStatus"])
    },
    methods: {
        ...mapActions(["showLifestyleList", "showWeightCategoryList", "createProgram", "checkActiveProgram"]),
    },
    mounted() {
        this.showLifestyleList();
    }
}
</script>
	
<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.row {
    display: flex;
    align-items: flex-start;

}

</style>