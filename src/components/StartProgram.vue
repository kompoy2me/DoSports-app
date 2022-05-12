<template>
	<div>
        <v-icon class="mb-10"
                @click="$router.push({ name: ''}).catch(err => {})"
        >mdi-arrow-left</v-icon>
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
        
        <div class="border">
            {{ message }}
        </div>
        
        <label>Образ жизни</label>
        <v-select
            :menu-props="{ bottom: true, offsetY: true }"
            :append-icon="'mdi-chevron-down'"
            :items="this.lifestyleList"
            :item-text="'name'"
            :item-value="'id'"
            v-model="program.lifestyle"
            outlined
        ></v-select>

        <label>Уровень подготовленности к тренировкам</label>
        <v-radio-group
            v-model="program.trainPrepare"
            class="train-prepare-group"
            >
            <v-radio
                value="0"
                label="Новичок (Вы - начинающий. Вы не знаете, какое количество тренировок в неделю вам необходимо. Система посчитает это за вас)"
            ></v-radio>
            <v-radio
                value="1"
                label="Профессионал (Вы знаете, сколько тренировок вам необходимо в неделю. Система предоставит возможность создавать любое их количество)"
            ></v-radio>
        </v-radio-group>
        <div >
            <label>Цель программы</label>
            <v-radio-group
                v-model="program.aim"
            >
                <v-radio
                    class="support"
                    value="0"
                    label="Поддержание веса"
                    dark
                ></v-radio>
                <v-radio
                    class="down"
                    value="1"
                    label="Сброс веса"
                    dark
                ></v-radio>
                <v-radio
                    class="up"
                    value="2"
                    label="Набор веса"
                    dark
                ></v-radio>
            </v-radio-group>
        </div>
        <v-btn
            @click="this.calculateProgram"
            color="primary"
        >Начать программу
        </v-btn>
        </v-form>
    </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
export default {
    data: () => ({
        user: null,
        program: {
            idUser: JSON.parse(localStorage.getItem("user")).id,
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
        message: "Индекс массы тела позволяет оценить является ли масса недостаточной, нормальной или избыточной.",
    }),
    computed: {
        ...mapGetters(["lifestyleList", "weightCategoryList", "createProgramStatus", "activeProgramStatus"]),
         bmi() {
            if (this.program.height && this.program.weight) return Math.round(this.program.weight / (this.program.height ** 2) * 10000 * 10) / 10
            return 0
        },
        weightCategory() {
            return this.weightCategoryList.find(obj => this.bmi >= obj.min_bmi && this.bmi <= obj.max_bmi);
        },
        messageBmi() {
            if (this.bmi) {
                return `Ваш ИМТ - ${this.bmi}. У вас ${this.weightCategory.name}.`
            }
            return "Индекс массы тела позволяет оценить является ли масса недостаточной, нормальной или избыточной."

        }
    },
    methods: {
        ...mapActions(["showLifestyleList", "showWeightCategoryList", "createProgram", "checkActiveProgram"]),
        calculateProgram() {
            if (this.$refs.form.validate()) {
                this.program.norm = this.pfc();
                this.program.height = parseInt(this.program.height)
                this.program.weight = parseInt(this.program.weight)
                this.createProgram(this.program).then(() => {
                    if (this.createProgramStatus === "Success") {
                        console.log(JSON.stringify(this.program))
                        localStorage.setItem("program", JSON.stringify(this.program));
                        alert("Успешно");
                    }
                    else {
                        alert(this.createProgramStatus)
                    }
                })
            }
        },
        pfc() {
            let calories = this.calNorm();
            calories += this.valuePfc(calories);
            let result = {
                proteins: Math.round(calories * 25 / 100 / 4),
                fats: Math.round(calories * 38 / 100 / 9),
                carbohydrates: Math.round(calories * 45 / 100 / 4),
                fibers: Math.round(calories / 1000 * 14),
                calories: Math.round(calories)
            };
            return result
        },
        calNorm() {
            let result = 0
            let activity = this.lifestyleList.find(obj => this.program.lifestyle === obj.id).coef;
            let calc = 10 * this.program.weight + 6.25 * this.program.height - 5 * this.ageUser()
            if (this.user.gender === "f") {
                result = calc - 161;
            } else if (this.user.gender === "m") {
                result = calc + 5;
            }
            result *= activity;
            return result;
        },
        ageUser() {
            let today = new Date();
            let birthday = this.user.birthday;
            let age = today.getFullYear() - new Date(birthday).getFullYear();
            let months = today.getMonth() - new Date(birthday).getMonth();
            if (months < 0 || (months === 0 && today.getDate() < birthday.getDate())) {
                age--;
            }
            return age;
        },
        valuePfc(calories) {
            let category = this.weightCategory.id;
            if (category <= 2) {
                return 500;
            } else if (category === 3) {
                if (this.program.aim === "0") {
                    return 0;
                } else if (this.program.aim === "1") {
                    return -calories * 0.1;
                } else if (this.program.aim === "2") {
                    return 500;
                }
            } else if (category === 4) {
                return -calories * 0.15;
            } else if (category >= 5) {
                return -calories * 0.2;
            }
        },
    },
     watch: {
        bmi() {
            this.program.bmi = this.bmi;
        },
        weightCategory() {
            this.program.weightCategory = this.weightCategory.id;
        },
        messageBmi() {
            this.message = this.messageBmi;
        }
    },
    mounted() {
        this.showLifestyleList();
        this.showWeightCategoryList();
    },
    created() {
        this.user = JSON.parse(localStorage.getItem("user"));
        
    }
}
</script>
	
<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.row {
    display: flex;
    justify-content: space-around; 
}
.border {
    padding: 4%;
    border-left: solid #9196FF;
}

</style>