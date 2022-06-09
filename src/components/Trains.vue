<template>
  <div class="main-trains">

      <div class="weekviever">
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
          
          <div v-if="dailyTrain " class="pa-4">
            <div class="mb-4">
              Сегодня вы еще не назначали тренировки. Необходимо добавить программу из предложенных под вашу весовую категорию и уровень подготовки.
            </div> 
            <v-btn>Добавить</v-btn>
          </div>
        </div>
        
      </div>

  </div>
</template>

<script>
import WeeksViewer from '../components/WeeksViewer.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
  components: {WeeksViewer},
  data: () => ({
    trainStatus: 'load',
    currentDate: {},
    dailyTrain: {},

  }),
  computed: {
    ...mapGetters(["trainMods", "trainProgram"]),
    date() {
      let schedule = JSON.parse(localStorage.getItem('schedule'));
      console.log('!!!', this.currentDate.week, this.currentDate.day);

      console.log('!!!', JSON.stringify(schedule[this.currentDate.week].days[this.currentDate.day]))
      let todayDate = schedule[this.currentDate.week].days[this.currentDate.day]
      return this.formatDate(todayDate.date);
    },
  },
  methods: {
    ...mapActions(["showTrainMods", "showTrains", "showTrainProgram"]),

    setCurrData(day, week) {
        this.currentDate.day = day + 1;
        this.currentDate.week = week + 1;
        this.initTrains();
        this.updateTrains();
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

    initTrains() {
      let schedule = JSON.parse(localStorage.getItem('schedule'));
      this.dailyTrain = schedule[this.currentDate.week].days[this.currentDate.day].trains;
      //console.log(JSON.stringify(this.dailyTrain));
    },

    getTrainMods() {
      let programData = JSON.parse(localStorage.getItem('program'));
      let program = {
          aim: programData.aim,
          trainPrepare: programData.train_prepare
      }
      this.showTrainMods(program).then(() => {
        console.log('train mods ', JSON.stringify(this.trainMods));
        this.trainStatus = 'trains';
      })
    },
        
    async updateTrains() {
      let programData = JSON.parse(localStorage.getItem('program'));
        let program = {
            id: programData.id,
            date: this.date
        }

        await this.showTrainProgram(program).then(() => {
          console.log('train program ', JSON.stringify(this.trainProgram))
        })
    },
    

  },
  mounted() {
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
    height: 82%;
}
</style>