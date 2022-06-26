<template>
  <div class="diary-main">
    
    <v-overlay
      :color="'#000'"
      opacity=0.8
      v-model="overlay"
      style="z-index: 10"
    >
      <v-card
          style="background-color: #1A1A27;"
          max-width="90vw"
          class="px-5 py-6"
      >
          <div class="px-5 mb-7" style="text-align: center;">Дневник обновлен. Вы хотите перейти в статистику?</div>
          <div class="row-btn">
              <v-btn
                  style="background-color: #8f8f9a !important"
                  @click="overlay = !overlay"
                  class="mr-3 "
              >
                  Отменить</v-btn>
              <v-btn  
                @click="$router.push({ name: 'stat'}).catch(err => {})"                
              >Перейти</v-btn> 
          </div>
      </v-card>
    </v-overlay>
    
    <div class="weekviever">
      <weeks-viewer 
          @curr-data="setCurrData"
      ></weeks-viewer>
    </div>

    <div v-if="pageStatus === 'diary'" class="diary-body px-4 py-6">
      <v-form ref="form" lazy-validation>
        <div>
          <label>Вес (кг)</label>
          <v-text-field
              v-model="parameters.weight"
              type="number"
              :rules="rules.weight"
              hide-details="auto"
              outlined
          >
          </v-text-field>
        </div>
        <div style="font-size:14pt" class="mt-6">Параметры тела</div>
        <div class="d-flex my-4 justify-space-between">
          <div style="width:47%"><label>Обхват груди (см)</label>
            <v-text-field
                v-model="parameters.bust"
                type="number"
                :rules="rules.bust"
                hide-details="auto"
                outlined
            >
            </v-text-field>
          </div>
          <div style="width:47%">
            <label>Обхват талии (см)</label>
            <v-text-field
                v-model="parameters.waist"
                type="number"
                :rules="rules.waist"
                hide-details="auto"
                outlined
            >
            </v-text-field>
          </div>
        </div>
        <div class="d-flex my-4 justify-space-between">
          <div style="width:47%"><label>Обхват бедер (см)</label>
            <v-text-field
                v-model="parameters.hip"
                type="number"
                :rules="rules.hip"
                hide-details="auto"
                outlined
            >
            </v-text-field>
          </div>
          <div style="width:47%">
            <label>Обхват бицепса (см)</label>
            <v-text-field
                v-model="parameters.bicep"
                type="number"
                :rules="rules.bicep"
                hide-details="auto"
                outlined
            >
            </v-text-field>
          </div>
        </div>
        <div class="d-flex my-4 justify-space-between">
          <div style="width:47%"><label>Обхват голени (см)</label>
            <v-text-field
                v-model="parameters.shin"
                type="number"
                :rules="rules.shin"
                hide-details="auto"
                outlined
            >
            </v-text-field>
          </div>
          <div style="width:47%">
            <label>Обхват шеи (см)</label>
            <v-text-field
                v-model="parameters.neck"
                type="number"
                :rules="rules.neck"
                hide-details="auto"
                outlined
            >
            </v-text-field>
          </div>
        </div>
        <v-btn
            class="my-4"
            :loading="loadAddToDiary"
            @click="addToDiary"
        >
            Сохранить
        </v-btn>
      </v-form>
    </div>
    
    <div v-if="pageStatus === 'load'" class="load">
        <v-progress-circular 
            :width="4"
            :size="40"
            indeterminate
            color="#004BD7"
        ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/services/url";
import WeeksViewer from '../components/WeeksViewer.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
  components: {WeeksViewer},
   data: () => ({
    overlay: false,
    pageStatus: 'diary',
    currentDate: {},
    parameters: {
        weight: "",
        bust: "",
        hip: "",
        waist: "",
        bicep: "",
        shin: "",
        neck: "",
    },
    rules: {
        weight: [
            v => v > 0 || "Некорректное значение",
            v => v <= 600 || "Некорректное значение",
        ],
        bust: [
            v => (!v || v >= 10 && v <= 110) || "Некорректное значение",
        ],
        hip: [
            v => (!v || v >= 80 && v <= 140) || "Некорректное значение",
        ],
        waist: [
            v => (!v || v >= 50 && v <= 100) || "Некорректное значение",
        ],
        bicep: [
            v => (!v || v >= 20 && v <= 70) || "Некорректное значение",
        ],
        shin: [
            v => (!v || v >= 15 && v <= 70) || "Некорректное значение",
        ],
        neck: [
            v => (!v || v >= 25 && v <= 50) || "Некорректное значение",
        ],
    },
    loadAddToDiary: false,
  }),
  methods: {
    ...mapActions(["showDiary"]),
      async setCurrData(day, week) {
        this.currentDate.day = day + 1;
        this.currentDate.week = week + 1;
        this.getDiary();
      },

      async addToDiary() {
        if (this.$refs.form.validate()) {
          if (navigator.connection.type != "none") {
            this.pageStatus = 'load';
            this.parameters.idUser = JSON.parse(localStorage.getItem("user")).id;
            this.parameters.date = this.date();
            console.log(JSON.stringify(this.parameters))
            await axios.post(`${url}/api/programs/add-diary`, this.parameters).then((res) => {
                if (res.data.name === "Success") {
                  this.getDiary();
                }
            });
            this.overlay = true;
          }
        }
      },

      updateDiary() {
        let schedule = JSON.parse(localStorage.getItem('schedule'));
        this.parameters = schedule[this.currentDate.week].days[this.currentDate.day].diary;
        this.pageStatus = 'diary';
      },

      async getDiary() {
        if (navigator.connection.type != "none") {
          this.pageStatus = 'load';
          let parameters = {
              idUser: JSON.parse(localStorage.getItem("user")).id,
              date: this.date()
          }
          await this.showDiary(parameters).then(() => {
            let schedule = JSON.parse(localStorage.getItem('schedule'));
            schedule[this.currentDate.week].days[this.currentDate.day].diary = this.diary;
            localStorage.setItem('schedule', JSON.stringify(schedule));
          })
        } 
        this.updateDiary();
      },

      getScheduleDay() {
        let week = this.currentDate.week;
        let day = this.currentDate.day;
        let schedule = JSON.parse(localStorage.getItem('schedule'));
        if (schedule[week]) {
            return schedule[week].days[day].date;
        }
        return "";
      },

      date() {
        let date = new Date(this.getScheduleDay());
        date = date.getFullYear() + '-' +
        ('00' + (date.getMonth()+1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2);
        return date;
      },
  },
  computed: {
    ...mapGetters(['diary'])
  },
  mounted() {
  }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.load {
    text-align: center;
    margin-top: 40vh;
}
label {
    font-size: 10pt !important;
    color: #B5B5B8;
}
.diary-main {
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
.diary-body {
    overflow: auto;
    height: 82%;
}
</style>