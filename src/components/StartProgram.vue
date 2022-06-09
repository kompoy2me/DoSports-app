<template>
	<div class="main-start">

        <div v-if="load" class="load">
            <v-progress-circular 
                :width="4"
                :size="40"
                indeterminate
                color="#004BD7"
            ></v-progress-circular>
        </div>

        <div v-else>
            <div class="mt-6 mb-4 headline"
        >Начните свою программу <p style="color: #9196FF">прямо сейчас >>></p> </div> 
        <div class="mb-6">
            Прежде чем начать, необходимо рассчитать индекс массы тела, дневную норму потребления питательных веществ и калорий.
        </div>

        <v-form ref="form" lazy-validation>
            <div class="d-flex flex-row justify-space-between mb-3"  >
                <div style="width:46%">
                    <label class="label-font">Рост(см)</label>
                    <v-text-field
                        v-model="program.height"
                        :rules="rules.height"
                        hide-details="auto"
                        required
                        outlined
                        type="number"
                        color="#9196FF"
                    ></v-text-field> 
                </div>   

                <div style="width:46%">
                    <label class="label-font">Вес(кг)</label>
                    <v-text-field
                        v-model="program.weight"
                        :rules="rules.weight"
                        hide-details="auto"
                        required
                        outlined
                        type="number"
                        color="#9196FF"
                    ></v-text-field>    
                </div>
            </div>
            
            <div class="border mb-4">
                {{ message }}
            </div>
            
            <label class="label-font">Образ жизни</label>
            <v-select
                class="mb-6"
                :menu-props="{ bottom: true, offsetY: true }"
                :append-icon="'mdi-chevron-down'"
                :items="this.lifestyleList"
                :item-text="'name'"
                :item-value="'id'"
                v-model="program.lifestyle"
                outlined
                hide-details="auto"
            ></v-select>

            <label class="label-font">Уровень подготовленности к тренировкам</label>
            
            <v-radio-group
                class="ma-0 pa-0"
                
                v-model="program.trainPrepare"
                hide-details="auto"
                >
                <div class="flex-start mb-3">
                    <v-radio
                        value="0"
                    ></v-radio>
                    <div >Новичок (Вы - начинающий. Вы не знаете, какое количество тренировок в неделю вам необходимо. Система посчитает это за вас)</div>
                </div>
                <div class="flex-start">
                    <v-radio
                        value="1"
                    ></v-radio>
                    <div >Профессионал (Вы знаете, сколько тренировок вам необходимо в неделю. Система предоставит возможность создавать любое их количество)</div>
                </div>
            </v-radio-group>
            <div class="my-4">
                <label class="label-font" >Цель программы</label>
                <v-radio-group
                class="ma-0 pa-0 "
                    v-model="program.aim"
                >   
                    <div class="d-flex align-center">
                        <v-radio
                            value="0"    
                            dark
                            class="mr-2" 
                        ></v-radio>
                    <label >Поддержание веса</label>
                    </div>
                    
                    <div class="d-flex align-center">
                        <v-radio
                            value="1"
                            class="mr-2"    
                            dark
                        ></v-radio>
                    <label >Сброс веса</label>
                    </div>
                    <div class="d-flex align-center">
                        <v-radio
                            value="2"    
                            dark
                            class="mr-2" 
                        ></v-radio>
                    <label >Набор веса</label>
                    </div>
                </v-radio-group>
            </div>
            <v-btn
                @click="this.calculateProgram"
                color="primary"
                width="100%"
                class="mb-6"
                :loading="initProgress"
            >Начать программу
            </v-btn>
        </v-form>

        <v-dialog
            v-model="dialog"
        >
            <alert-message :msg='msg' @clicked="createScedule"></alert-message>
        </v-dialog>
        </div>

        

    </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import AlertMessage from "./AlertMessage.vue";
export default {
    components: {AlertMessage},
    data: () => ({
        initProgress: false,
        dialog: false,
        msg: {title: '', text: ''},
        load: false,
        user: null,
        program: {
            idUser: JSON.parse(localStorage.getItem("user")).id,
            bmi: 0,
            height: '',
            weight: '',
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
            if (this.program.height && this.program.weight) 
                return Math.round(this.program.weight / (this.program.height ** 2) * 10000 * 10) / 10
            return 0
        },
        weightCategory() {
            return this.weightCategoryList.find(obj => this.bmi >= obj.min_bmi && this.bmi <= obj.max_bmi);
        },
        messageBmi() {
            if (this.bmi > 0 && this.weightCategory != undefined) {
                return `Ваш ИМТ - ${this.bmi}. У вас ${this.weightCategory.name}.`
            }
            return "Индекс массы тела позволяет оценить является ли масса недостаточной, нормальной или избыточной."

        }
    },
    watch: {
        bmi() {
            this.program.bmi = this.bmi;
        },
        weightCategory() {
            if (this.weightCategory != undefined) {
                this.program.weightCategory = this.weightCategory.id;
            }
            
        },
        messageBmi() {
            this.message = this.messageBmi;
        }
    },

    methods: {
        ...mapActions(["showLifestyleList", "showWeightCategoryList", "createProgram", "checkActiveProgram", "initSchedule", "showProgram"]),
        
        async calculateProgram() {
            if (this.$refs.form.validate()) {
                this.initProgress = true;
                this.program.norm = this.pfc();
                this.program.height = parseInt(this.program.height);
                this.program.weight = parseInt(this.program.weight);

                this.createProgram(this.program).then(() => {
                    if (this.createProgramStatus === "Success") {
                        let prog = {
                            id: JSON.parse(localStorage.getItem("user")).id
                        };
                        this.showProgram(prog).then(() => {
                            
                            this.msg = {title: 'Программа успешно создана!', text: 'Программа рассчитана на 3 недели. По желанию вы можете сбросить текущую программу и начать новую.'},
                            this.dialog = true;
                        })
                        //console.log('created program: ', JSON.stringify(this.program))
                        //localStorage.setItem("program", JSON.stringify(this.program));
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
            let birthday = new Date(this.user.birthday);
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
        createScedule() {
            this.dialog = false;
            this.load = true;
            this.initSchedule().then(() => {
                this.$router.push({name: "main"});
            })
        }
    },
    mounted() {
        this.showLifestyleList();
        this.showWeightCategoryList();
    },
    created() {
        this.user = JSON.parse(localStorage.getItem("user"));
        
    },

}
</script>
	
<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.main-start {
    font-family: "Inter-Regular", sans-serif;

}
.label-font {
    color: #B5B5B8;
    font-size: 11pt;
}
.border {
    padding: 4%;
    border-left: solid #9196FF;
}
.headline {
    margin-bottom: 10px !important;
}
.flex-start {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}
.load {
    text-align: center;
    margin-top: 40vh !important;
}

</style>