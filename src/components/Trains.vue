<template>
  <div>

    <div v-if="addTrainMode" class="main-add-trains">


      <div class="pa-4 trains-add-head">
        <img
            class="my-2  ml-2" 
            :width=54
            @click="addTrainMode = false"
            :src="require('@/assets/img/png/arrow-back--white1.png')">
        <div class="d-flex align-center my-4 view-date">
          <div>{{aim[userProgram.aim]}}</div>
            <v-divider color="white" class="mx-2"></v-divider>
          <div>{{trainPrepare[userProgram.train_prepare]}}</div>
        </div>
        <v-text-field
            class="my-4"
            label="Название программы..."
            outlined
            hide-details
            :append-icon="'mdi-magnify'"
        ></v-text-field>
        <div class="d-flex justify-space-between">
            <div style="width:45%">
                <v-select
                    label="Все категории"
                    :append-icon="'mdi-chevron-down'"
                    outlined
                ></v-select>
            </div>
        </div>
      </div>
      <div class="pa-4 trains-add-body">
        <div v-for="train in trains"
          :key="train.id" 
          >
          <train-tab-list @add-train="addUserTrain" :trainList="train"></train-tab-list>
        </div>
      </div>
      
    </div>

    <div v-else class="main-trains">
      <div class="weekviever mb-2">
        <weeks-viewer 
            @curr-data="setCurrData"
        ></weeks-viewer>
      </div>

      <div class="main-content">
        
        <div v-if="trainStatus === 'load'" class="load">
          <v-progress-circular 
              :width="4"
              :size="40"
              indeterminate
              color="#004BD7"
          ></v-progress-circular>
        </div>

        <div v-if="trainStatus === 'trains'" >
          <div v-if="dailyTrain && Object.keys(dailyTrain).length === 0" class="pa-4">
            <div class="mb-4">
              Сегодня вы еще не назначали тренировки. Необходимо добавить программу из предложенных под вашу весовую категорию и уровень подготовки.
            </div> 
            <v-btn
              @click="addTrain">Добавить</v-btn>
          </div>

          <div v-else>
            <train-tab :train="dailyTrain[0]"></train-tab>
            <div
                class="mt-2 mb-10 mx-4"
                @click="overlay = true">
                <v-img
                    class="mr-2"
                    style="display:inline-block"
                    src="@/assets/img/png/icon-reset-program--white.png"
                    width=16px 
                    height=auto
                ></v-img>
                <div style="display:inline-block"
                  @click="resetTrain"
                >Сбросить тренировку</div>
            </div>
          </div>
        </div>
        
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import url from "@/services/url";
import TrainTabList from './TrainTabList.vue';
import WeeksViewer from '../components/WeeksViewer.vue';
import TrainTab from '../components/TrainTab.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
  components: {WeeksViewer, TrainTab, TrainTabList},
  data: () => ({
    trainStatus: 'load',
    addTrainMode: false,
    userProgram: {},
    currentDate: {},
    dailyTrain: {},
    aim: [    
      'поддержание веса',
      'сброс веса',
      'набор веса'
    ],
    trainPrepare: [
      'новичок',
      'проффессионал'
    ]

  }),
  computed: {
    ...mapGetters(["trainMods", "trainProgram", "trains"]),
    

  },
  methods: {
    ...mapActions(["showTrainMods", "showTrains", "showTrainProgram"]),

    date() {
      let schedule = JSON.parse(localStorage.getItem('schedule'));
      let todayDate = schedule[this.currentDate.week].days[this.currentDate.day];
      return this.formatDate(todayDate.date);
    },

    setCurrData(day, week) {
        this.currentDate.day = day + 1;
        this.currentDate.week = week + 1;
        this.getUserTrains();
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
    async addUserTrain(id) {
      if (navigator.connection.type != "none") {
        this.trainStatus = 'load';
        this.addTrainMode = false;
        let program = {
            idProgram: this.userProgram.id,
            date: this.date(),
            idTrainExample: id,
        }
        console.log(JSON.stringify(program));
        await axios.post(`${url}/api/programs/add-train-program`, program).then((res) => {
            if (res.data.name === "Success") {
              this.getUserTrains();
            }
        })
      }
        
    },

    addTrain() {
      this.addTrainMode = true;
    },

    updateTrains() {
      let schedule = JSON.parse(localStorage.getItem('schedule'));
      this.dailyTrain = schedule[this.currentDate.week].days[this.currentDate.day].trains;
      this.trainStatus = 'trains';
    },
    
    async getUserTrains() {
      if (navigator.connection.type != "none") {
        this.trainStatus = 'load';
          let programData = JSON.parse(localStorage.getItem('program'));
          let program = {
              id: programData.id,
              date: this.date()
          }
          await this.showTrainProgram(program).then(() => {
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            schedule[this.currentDate.week].days[this.currentDate.day].trains = this.trainProgram;
            localStorage.setItem('schedule', JSON.stringify(schedule));
            this.updateTrains();
          })
      }
    },

    async getTrainMods() {
      let programData = JSON.parse(localStorage.getItem('program'));
      let program = {
          aim: programData.aim,
          trainPrepare: programData.train_prepare
      }
      this.showTrainMods(program)
    },
      
    async getAllTrains() {
      let programData = JSON.parse(localStorage.getItem('program'));
      let program = {
          aim: programData.aim,
          trainPrepare: programData.train_prepare
      }
        this.showTrains(program).then(() => {
          console.log('all trains', JSON.stringify(this.trains))
        })
    },

    async resetTrain() {
      if (navigator.connection.type != "none") {
        this.trainStatus = 'load';
        let programData = JSON.parse(localStorage.getItem('program'));
        let program = {
            idProgram: programData.id,
            date: this.date()
        }
        await axios.post(`${url}/api/programs/delete-train-program`, program).then((res) => {
            if (res.data.name === "Success") {
                this.getUserTrains()
            }
        })
      }
      
    },
    

  },
  mounted() {
    this.userProgram = JSON.parse(localStorage.getItem('program'));
    this.getAllTrains()
    this.getTrainMods();
    
  }

}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.main-trains {
    overflow: auto;
    height: 92vh;
    position: relative;
}
.weekviever {
    position: relative;
    height: 18%;
    background-color: #1A1A27;
    z-index: 6;
}
.main-content {
    overflow: auto;
    height: 79%;
}
.load {
    text-align: center;
    margin-top: 20vh;
}

.main-add-trains {
    overflow: auto;
    height: 92vh;
    position: relative;
}
.trains-add-head {
  position: relative;
    height: 40%;
    background-color: #1A1A27;
    z-index: 6;
}
.trains-add-body {
    overflow: auto;
    height: 60%;
}
</style>