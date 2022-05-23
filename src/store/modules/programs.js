import axios from "axios";
import url from "../../services/url";

export default {
    state: {
        lifestyles: [],
        weightCategories: [],
        statusCreateProgram: "",
        statusActiveProgram: "",
        program: {},
        foods: [],
        currentDateProgram: {day: 1, week: 1},
        scheduleProgram: {},
        diet: [],
    },

    actions: {
        async initSchedule(ctx) {
            console.log(JSON.stringify(ctx.state.program) );
            let weeks = {};
            for (let i = 0; i < 3; i++) {
                let days = {};
                ctx.state.week = i;
                console.log('1 day of program', ctx.state.program.date_start);
                for (let j = 0; j < 7; j++) {
                    let date = new Date(ctx.state.program.date_start);
                    date.setDate(date.getDate() + i * 7 + j);
                    console.log('schedule date',date);
                    days[`${j + 1}`] = {
                        id: j + 1,
                        date: date,
                        weekDay: date.getDay(),
                        eaten: {
                            calories: 0,
                            proteins: 0,
                            fats: 0,
                            carbohydrates: 0,
                            fibers: 0
                        }
                    }
                }
                weeks[`${i + 1}`] = {
                    id: i + 1,
                    days: days
                }
            }
            ctx.commit("updateSchedule", weeks);
        },

        async showProgramDiet(ctx, input) {
            await axios.post(`${url}/api/programs/get-program-diet`, input).then((res) => {
                ctx.commit(`updateProgramDiet`, res.data);
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
        async showFoods(ctx) {
            await axios.get(`${url}/api/programs/get-foods`).then((res) => {
                ctx.commit(`updateFoods`, res.data);
            });
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
            console.log('created schedule', JSON.stringify( schedule));
            localStorage.setItem("schedule", JSON.stringify( schedule));
        },
        
        updateProgramDiet(state, diet) {
            console.log('DIET ', JSON.stringify(diet));
            state.diet = diet;
        },
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
        }
    }
}