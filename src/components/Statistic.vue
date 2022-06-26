<template>
  <div>
    <v-card class="pt-6 px-2"
    style="background-color: #000"
    >
    <v-select
        v-model="selectedStat"
        :append-icon="'mdi-chevron-down'"
        outlined
        :items="menu"
        :item-text="'name'"
        :item-value="'id'"
        hide-details="auto"
    ></v-select>
    </v-card>
    
    <div>
        <div v-if="selectedStat === 0">
            <div v-if="datasets.weight.labels.length > 1" class="name">
                Вес (кг)
                <chart :chart-data="datasets.weight" />
            </div>
            
            <div class="empty" v-else>
                {{ textEmpty }}
            </div>
        </div>
        <div v-if="selectedStat === 1">
            <div class="name" v-if="datasets.bust.labels.length > 1">
                Обхват груди (см)
                <chart :chart-data="datasets.bust" />
            </div>
            
            <div class="empty" v-else>
                {{ textEmpty }}
            </div>
        </div>
        <div v-if="selectedStat === 2">
            <div class="name" v-if="datasets.waist.labels.length > 1">
                Обхват талии (см)
                <chart :chart-data="datasets.waist" />
            </div>
            
            <div class="empty" v-else>
                {{ textEmpty }}
            </div>
        </div>
        <div v-if="selectedStat === 3">
            <div class="name" v-if="datasets.hip.labels.length > 1">
                Обхват бедер (см)
                <chart :chart-data="datasets.hip" />
            </div>
            
            <div class="empty" v-else>
                {{ textEmpty }}
            </div>
        </div>
        <div v-if="selectedStat === 4">
            <div class="name" v-if="datasets.bicep.labels.length > 1">
                Обхват бицепса (см)
                <chart :chart-data="datasets.bicep" />
            </div>
            
            <div class="empty" v-else>
                {{ textEmpty }}
            </div>
        </div>
        <div v-if="selectedStat === 5">
            <div class="name" v-if="datasets.shin.labels.length > 1">
                Обхват голени (см)
                <chart :chart-data="datasets.shin" />
            </div>
            
            <div class="empty" v-else>
                {{ textEmpty }}
            </div>
        </div>
        <div v-if="selectedStat === 6">
            <div class="name" v-if="datasets.neck.labels.length > 1">
                Обхват шеи (см)
                <chart :chart-data="datasets.neck" />
            </div>
            
            <div class="empty" v-else>
                {{ textEmpty }}
            </div>
        </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import axios from "axios";
import url from "@/services/url";
import Chart from '../components/Chart.vue';
export default {
    components: { Chart },
    data: () => ({
        diary: [],
        //diaryLoc: [],
        selectedStat: 0,
        textEmpty: "Для вывода графика необходимо заполнить дневник как минимум на два дня.",
        menu: [
            {id: 0, name: "Вес"},
            {id: 1, name: "Грудь"},
            {id: 2, name: "Талия"},
            {id: 3, name: "Бедра"},
            {id: 4, name: "Бицепс"},
            {id: 5, name: "Голень"},
            {id: 6, name: "Шея"},
        ],
    }),
    methods: {
        allDiary() {
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            for (let i = 1; i <= 3; i++) {
                for (let j = 1; j <= 7; j++) {
                    if (schedule[i].days[j].diary.weight !== '') {
                        let diaryItem = schedule[i].days[j].diary;
                        diaryItem.date = schedule[i].days[j].date;
                        this.diary.push(diaryItem);
                    }
                    
                }
            }
            console.log('LOCAL', JSON.stringify(this.diary))
            //this.dailyMeals = schedule[this.currentDate.week].days[this.currentDate.day];
        },
        async getDiary() {
            if (navigator.connection.type != "none") {
                let user = JSON.parse(localStorage.getItem("user"));
                await axios.post(`${url}/api/programs/get-user-diary`, user).then((res) => {
                    if (res.data.name === "Success") {
                        //this.diary = res.data.diary;
                        console.log('SERVER', JSON.stringify(res.data.diary))
                    }
                })
            }
        },
        formatDate(date) {
            if (date) {
                let d = new Date(date);
                let day = d.getDate();
                let month = d.getMonth() + 1;
                let year = d.getFullYear();
                return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
            }
            return "";
        },
    },
    computed: {
        datasets() {
            let obj = {
                weight: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Вес (кг)',
                            data: []
                        }
                    ]
                },
                bust: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват груди (см)',
                            data: []
                        }
                    ]
                },
                hip: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват бедер (см)',
                            data: []
                        }
                    ]
                },
                waist: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват талии (см)',
                            data: []
                        }
                    ]
                },
                bicep: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват бицепса (см)',
                            data: []
                        }
                    ]
                },
                shin: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват голени (см)',
                            data: []
                        }
                    ]
                },
                neck: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Обхват шеи (см)',
                            data: []
                        }
                    ]
                }
            };
            if (this.diary.length) {
                for (let key in obj) {
                    obj[key].datasets[0].backgroundColor = '#9196FF';
                    obj[key].datasets[0].borderColor = '#9196FF';
                }
                for (let i = 0; i < this.diary.length; i++) {
                    obj.weight.datasets[0].data.push(this.diary[i].weight);
                    let labe = this.formatDate(this.diary[i].date).split('.');
                    obj.weight.labels.push(labe[0]+'.'+labe[1]);

                    if (this.diary[i].bust) {
                        obj.bust.datasets[0].data.push(this.diary[i].bust);
                        let labe = this.formatDate(this.diary[i].date).split('.');
                        obj.bust.labels.push(labe[0]+'.'+labe[1]);
                    }
                    if (this.diary[i].hip) {
                        obj.hip.datasets[0].data.push(this.diary[i].hip);
                        let labe = this.formatDate(this.diary[i].date).split('.');
                        obj.hip.labels.push(labe[0]+'.'+labe[1]);
                    }
                    if (this.diary[i].waist) {
                        obj.waist.datasets[0].data.push(this.diary[i].waist);
                        let labe = this.formatDate(this.diary[i].date).split('.');
                        obj.waist.labels.push(labe[0]+'.'+labe[1]);
                    }
                    if (this.diary[i].bicep) {
                        obj.bicep.datasets[0].data.push(this.diary[i].bicep);
                        let labe = this.formatDate(this.diary[i].date).split('.');
                        obj.bicep.labels.push(labe[0]+'.'+labe[1]);
                    }
                    if (this.diary[i].shin) {
                        obj.shin.datasets[0].data.push(this.diary[i].shin);
                        let labe = this.formatDate(this.diary[i].date).split('.');
                        obj.shin.labels.push(labe[0]+'.'+labe[1]);
                    }
                    if (this.diary[i].neck) {
                        obj.neck.datasets[0].data.push(this.diary[i].neck);
                        let labe = this.formatDate(this.diary[i].date).split('.');
                        obj.neck.labels.push(labe[0]+'.'+labe[1]);
                    }
                }
            }
            return obj;
        },
    },
    mounted() {
        this.getDiary();
        this.allDiary();
    }

}
</script>

<style>
.v-list .v-list-item { 
  background-color: #1A1A27 !important; 
}
.name {
    margin: 16px 0;
    text-align: center;
}
.empty {
    margin: 16px 8px;
}
</style>