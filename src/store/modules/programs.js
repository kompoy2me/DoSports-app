import axios from "axios";
import url from "../../services/url";

export default {
    state: {
        lifestyles: [],
        weightCategories: [],
        foodCategories: [],
        statusCreateProgram: "",
        statusActiveProgram: "",
        program: {},
        foods: [],
        currentDateProgram: {day: 1, week: 1},
        scheduleProgram: {},
        diet: [],
        formDate: '',
        currMeal: null,
        currDate: null,
    },

    actions: {
        
        async initSchedule(ctx) {
            let weeks = {};
            // задать недели
            for (let w = 0; w < 3; w++) {
                let days = {};
                // задать дни
                for (let d = 0; d < 7; d++) {
                    let date = new Date(ctx.state.program.date_start);
                    date.setDate(date.getDate() + w * 7 + d);
                    days[`${d + 1}`] = {
                        id: d + 1,
                        date: date,
                        weekDay: date.getDay(),
                        diet: {}
                    }
                    let month = date.getMonth() + 1;
                    let date_input = `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}.${month < 10 ? '0' + month : month}.${date.getFullYear()}`;
                    let input = {
                        idProgram: ctx.state.program.id,
                        date: date_input,
                    }
                    await ctx.dispatch('showProgramDiet', input).then(() => {
                        days[`${d + 1}`].diet = ctx.state.diet;
                    });
                }
                weeks[`${w + 1}`] = {
                    id: w + 1,
                    days: days
                }
            }
            ctx.commit("updateSchedule", weeks);
        },

        /*eslint-disable*/
        async showProgramDiet(ctx, input) {
            let calcParams = (ratio, grams) => {
                let value = ratio * grams / 100;
                return (+value.toFixed(1));
            }
            let round = (value) => {
                return (+value.toFixed(1));
            }
             // получить все приемы пищи на день
             await axios.post(`${url}/api/programs/get-program-diet`, input).then(async (res) => {
                let diet = Array.from(res.data);
                // свойства на весь день
                diet.proteins = 0;
                diet.fats = 0;
                diet.carbohydrates = 0;
                diet.calories = 0;
                diet.fibers = 0;
                for (let i = 0; i < diet.length; i++) {
                    // на каждый прием пищи получить продукты
                    await axios.get(`${url}/api/programs/get-meal-foods/${diet[i].id}`).then((res) => {
                        diet[i].foods = res.data;
                        // свойства на прием пищи
                        diet[i].proteins = 0;
                        diet[i].fats = 0;
                        diet[i].carbohydrates = 0;
                        diet[i].calories = 0;
                        diet[i].fibers = 0;

                        for (let j = 0; j < diet[i].foods.length; j++) {
                            // относительные свойства, зависящие от граммовки
                            diet[i].foods[j].proteinsCalc = calcParams(diet[i].foods[j].proteins, diet[i].foods[j].amount);
                            diet[i].foods[j].fatsCalc = calcParams(diet[i].foods[j].fats, diet[i].foods[j].amount);
                            diet[i].foods[j].carbohydratesCalc = calcParams(diet[i].foods[j].carbohydrates, diet[i].foods[j].amount);
                            diet[i].foods[j].caloriesCalc = calcParams(diet[i].foods[j].calories, diet[i].foods[j].amount);
                            diet[i].foods[j].fibersCalc = calcParams(diet[i].foods[j].fibers, diet[i].foods[j].amount);

                            diet[i].proteins += diet[i].foods[j].proteinsCalc;
                            diet[i].fats += diet[i].foods[j].fatsCalc;
                            diet[i].carbohydrates += diet[i].foods[j].carbohydratesCalc;
                            diet[i].calories += diet[i].foods[j].caloriesCalc;
                            diet[i].fibers += diet[i].foods[j].fibersCalc;
                        }

                        diet[i].proteins = round(diet[i].proteins);
                        diet[i].fats = round(diet[i].fats);
                        diet[i].carbohydrates = round(diet[i].carbohydrates);
                        diet[i].calories = round(diet[i].calories);
                        diet[i].fibers = round(diet[i].fibers);

                        diet.proteins += diet[i].proteins;
                        diet.fats += diet[i].fats;
                        diet.carbohydrates += diet[i].carbohydrates;
                        diet.calories += diet[i].calories;
                        diet.fibers += diet[i].fibers;
                    });
                    diet.proteins = round(diet.proteins);
                    diet.fats = round(diet.fats);
                    diet.carbohydrates = round(diet.carbohydrates);
                    diet.calories = round(diet.calories);
                    diet.fibers = round(diet.fibers);
                }
                ctx.commit(`updateProgramDiet`, diet);
            });
        },

        async updateDietSchedule(ctx, date) {
            let schedule = JSON.parse( localStorage.getItem('schedule'));
            let program = JSON.parse( localStorage.getItem('program'));
            let date_input = new Date(program.date_start);
            date_input.setDate(date_input.getDate() + (date.week - 1) * 7 + (date.day - 1));
            ctx.commit(`formatDate`, date_input);
            let input = {
                idProgram: program.id,
                date: ctx.state.formDate,
            }            
            await ctx.dispatch('showProgramDiet', input).then( () => {
                schedule[date.week].days[date.day].diet = ctx.state.diet;
                localStorage.setItem('schedule', JSON.stringify(schedule));
                console.log('new diet in schedule ', JSON.parse(localStorage.getItem('schedule'))[date.week].days[date.day].diet);
            }); 
        },

        async setCurrentWeek(ctx, week) {
            ctx.commit("updateCurrentWeek", week);
        },

        async setCurrentDay(ctx, day) {
            ctx.commit("updateCurrentDay", day);
        },

        async showLifestyleList(ctx) {
            await axios.get(`${url}/api/programs/get-lifestyles`).then((res) => {
                ctx.commit(`updateLifestyleList`, res.data);
            });
        },

        async showWeightCategoryList(ctx) {
            await axios.get(`${url}/api/programs/get-weight-categories`).then((res) => {
                ctx.commit(`updateWeightCategoryList`, res.data);
            })
        },

        async createProgram(ctx, program) {
            await axios.post(`${url}/api/programs/create-program`, program).then((res) => {
                ctx.commit(`updateCreateProgramStatus`, res.data.name);
            })
        },

        async checkActiveProgram(ctx, id) {
            await axios.get(`${url}/api/programs/user-has-active-program/${id}`).then((res) => {
                if (res.data.name === "Success") {
                    ctx.commit(`updateActiveProgramStatus`, res.data.text);
                }
            })
        },

        async closeProgram(ctx, user) {
            await axios.post(`${url}/api/programs/deactivate-program`, user);
        },

        async showProgram(ctx, user) {
            await axios.post(`${url}/api/programs/get-program`, user).then((res) => {
                if (res.data.name === "Success") {
                    ctx.commit("updateProgramData", res.data.program);
                }
            });
        },

        async showFoodCategories(ctx) {
            await axios.get(`${url}/api/programs/get-food-categories`).then((res) => {
                    ctx.commit("updateFoodCategories", res.data); 
            });
        },

        async showFoods(ctx) {
            await axios.get(`${url}/api/programs/get-foods`).then((res) => {
                ctx.commit(`updateFoods`, res.data);
            });
        },

        setCurrMeal(ctx, meal) {
            ctx.commit('updateCurrMeal', meal)
        },
        
        setCurrDate(ctx, date) {
            ctx.commit('updateCurrDate', date)
        }
      
    },

    mutations: {
        updateLifestyleList(state, lifestyles) {
            state.lifestyles = lifestyles;
        },

        updateWeightCategoryList(state, weightCategories) {
            state.weightCategories = weightCategories;
        },

        updateCreateProgramStatus(state, value) {
            state.statusCreateProgram = value;
        },

        updateActiveProgramStatus(state, value) {
            state.statusActiveProgram = value;
        },

        updateProgramData(state, program) {
            state.program = program;
        },

        updateFoods(state, foods) {
            state.foods = foods;
        },

        updateCurrentWeek(state, week) {
            state.currentDateProgram.week = week;
        },

        updateCurrentDay(state, day) {
            state.currentDateProgram.day = day;
        },

        updateSchedule(state, schedule) {
            state.scheduleProgram = schedule;
            console.log('created schedule', JSON.stringify(schedule));
            localStorage.setItem("schedule", JSON.stringify(schedule));
        },
        
        updateProgramDiet(state, diet) {
            console.log('created diet ', JSON.stringify(diet));
            localStorage.setItem("diet", JSON.stringify(diet));
            state.diet = diet;
        },

        formatDate(state, date) {
            let d = new Date(date);
            let day = d.getDate();
            let month = d.getMonth() + 1;
            let year = d.getFullYear();
            state.formDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
        },
        updateCurrMeal(state, meal) {
            state.currMeal = meal;
        },
        updateCurrDate(state, date) {
            state.currDate = date;
        },
        updateFoodCategories(state, data) {
            state.foodCategories = data;
        }
    },

    getters: {
        schedule(state) {
            return state.scheduleProgram;
        },

        currentDate(state) {
            return state.currentDateProgram;
        },

        lifestyleList(state) {
            return state.lifestyles;
        },

        weightCategoryList(state) {
            return state.weightCategories;
        },

        createProgramStatus(state) {
            return state.statusCreateProgram;
        },

        activeProgramStatus(state) {
            return state.statusActiveProgram;
        },

        programData(state) {
            return state.program;
        },

        getFoods(state) {
            return state.foods;
        },

        programDiet(state) {
            return state.diet;
        },
        currMeal(state) {
            return state.currMeal;
        },
        currDate(state) {
            return state.currDate;
        },
        foodCategories(state) {
            return state.foodCategories;
        }
    }
}