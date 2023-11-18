<template>
  <div>
    <div class="q-gutter-y-md">
      <q-card flat>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="center"
          narrow-indicator
          @click="type === 'pre' ? drawChart() : ''"
        >
          <q-tab name="bar" label="Grafica de barras" />
          <q-tab v-if="type === 'pre'" name="line" label="Line Graph" />
        </q-tabs>
        <div v-if="mm" class="flex flex-center text-h7">{{ (mm / 10).toFixed() + " cm" }}</div>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="bar">
            <div class="row justify-center" v-for="(item, index) in data" :key="index">
              <div class="col-4">
                <q-linear-progress
                  reverse
                  size="100%"
                  :value="item.desfLft"
                  :color="stColor(item.desfLft, item.desfRig)"
                  :buffer="0.0"
                />
                <q-tooltip
                  anchor="center right"
                  self="center left"
                  :content-class="'bg-' + stColor(item.desfLft)"
                  content-style="font-size: 16px"
                  :offset="[10, 10]"
                >
                  {{ item.leftTemp }} /
                  {{ item.desfLft }}
                </q-tooltip>
              </div>
              <div class="col-3" style="height: 20px;">
                <q-img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT0sBFtdTd5b0ExW-GVCKQSsOs684SfTn-L3OIChZ-ROm1Td0gP"
                  spinner-color="white"
                  style="height: 100%; width: 100%;"
                >
                  <div class="row absolute-bottom" style="height: 100%; width: 100%;" :style="$q.screen.gt.sm ? '' : 'padding-left: 0px; padding-right: 0px;'">
                    <div
                      class="absolute-top text-center text-white"
                      style="background-color: rgba(255, 255, 255, 0); z-index:3; margin-top: 8px;"
                    >{{ whichVertebra(index) }}</div>
                    <div :style="$q.screen.gt.sm ? '' : 'font-size: 0.6rem;'" class="col text-left">{{ item.leftTemp }}</div>
                    <div :style="$q.screen.gt.sm ? '' : 'font-size: 0.6rem;'" class="col text-right">{{ item.rightTemp }}</div>
                  </div>
                </q-img>
              </div>
              <div class="col-4">
                <q-linear-progress
                  size="100%"
                  :value="item.desfRig"
                  :color="stColor(item.desfRig, item.desfLft)"
                  :buffer="0.0"
                ></q-linear-progress>
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  :content-class="'bg-' + stColor(item.desfRig)"
                  content-style="font-size: 16px"
                  :offset="[10, 10]"
                >
                  <!-- <div v-if="stColor(item.desfRig) != 'red'"> -->
                    {{ item.desfRig }} /
                    {{ item.rightTemp }}
                  <!-- </div> -->

                  <!-- <q-card v-else>
                    <q-card-section horizontal>
                      <q-card-section>
                        <div class="text-overline text-grey">Overline</div>
                        <div class="text-h5 q-mt-sm q-mb-xs text-grey">Title</div>
                        <div class="text-caption text-grey">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </div>
                      </q-card-section>

                      <q-card-section class="col-5 flex flex-center">
                        <q-img
                          class="rounded-borders"
                          src="https://cdn.quasar.dev/img/parallax2.jpg"
                        />
                      </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                      <q-btn class="text-grey" flat round icon="event" />
                      <q-btn class="text-grey" flat>7:30PM</q-btn>
                      <q-btn flat color="primary">Reserve</q-btn>
                    </q-card-actions>
                  </q-card> -->
                </q-tooltip>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="line">
            <q-layout view="lhh LpR lff" container style="height: 650px">
              <q-page-container>
                <q-page>
                  <div class="row">
                    <div class="col">
                      <div id="chart_lf"></div>
                    </div>
                    <div class="col">
                      <div id="chart_ct"></div>
                    </div>
                    <div class="col">
                      <div id="chart_rg"></div>
                    </div>
                  </div>
                  <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
                    <q-btn
                      fab
                      icon="add"
                      color="accent"
                      @click="(dialog = true), clickbtn(), drawChart()"
                    >
                      <q-tooltip
                        anchor="top middle"
                        self="bottom middle"
                        :offset="[10, 10]"
                      >
                        <strong>Tooltip</strong> on <em>top</em> (<q-icon
                          name="keyboard_arrow_up"
                        />)
                      </q-tooltip>
                    </q-btn>
                  </q-page-sticky>-->
                </q-page>
              </q-page-container>
            </q-layout>
            <q-dialog
              v-if="item"
              v-model="dialog"
              persistent
              maximized
              transition-show="slide-up"
              transition-hide="slide-down"
            >
              <q-card class="bg-primary text-white">
                <q-bar>
                  <q-chip dense color="secondary" text-color="white">
                    <q-avatar>
                      <img :src="item.info.photoURL" />
                    </q-avatar>
                    {{ item.info.displayName }}
                  </q-chip>
                  <q-space />

                  <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
                  </q-btn>
                </q-bar>

                <q-card-section>
                  <div class="text-h6">Alert</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <!-- <lineGraphs :typetab="typetab" :item="item" /> -->
                  <pre>
                  <!-- {{ item.info }} -->
                  </pre>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <div class="flex flex-center" v-if="btn">
      <q-btn rounded push color="primary" label="Guardar" class="q-ma-md" @click="btnGuardar()" />
    </div>
  </div>
</template>

<script>
// import lineGraphs from "./LineGraphs";
export default {
  name: "graph",
  components: {
    // lineGraphs
  },
  props: ["data", "mm", "btn", "type", "actTyke", "item", "typetab"],
  data() {
    return {
      showing: false,
      tab: "bar",
      dialog: false
    };
  },
  created() {
    console.log("this.data :>> ", this.data);

    if (this.type === "pre") {
      google.charts.load("current", { packages: ["line", "corechart"] });
      google.charts.setOnLoadCallback(this.drawChart);
    }
  },
  methods: {
    whichVertebra(item) {
      switch (item) {
        case 0:
          return "C1";
        case 1:
          return "C2";
        case 2:
          return "C3";
        case 3:
          return "C4";
        case 4:
          return "C5";
        case 5:
          return "C6";
        case 6:
          return "C7";
        case 7:
          return "T1";
        case 8:
          return "T2";
        case 9:
          return "T3";
        case 10:
          return "T4";
        case 11:
          return "T5";
        case 12:
          return "T6";
        case 13:
          return "T7";
        case 14:
          return "T8";
        case 15:
          return "T9";
        case 16:
          return "T10";
        case 17:
          return "T11";
        case 18:
          return "T12";
        case 19:
          return "L1";
        case 20:
          return "L2";
        case 21:
          return "L3";
        case 22:
          return "L4";
        case 23:
          return "L5";
      }
    },
    clickbtn() {
      // console.clear();
      console.log("btn in =>");
      console.log(this.data);
      console.log(this.cm);
      console.log(this.btn);
      console.log(this.type);
      console.log(this.actTyke);
      console.log(this.item);
    },
    drawChart() {
      console.log(this.data);
      let lfdat = [];
      let rgdat = [];
      let ctdat = [];
      this.data.forEach((element, index) => {
        // console.log("sacando data central");
        // console.log(element.rightTemp);
        // console.log(element.leftTemp);
        // console.log(element.leftTemp - element.rightTemp);
        ctdat.push(element.leftTemp - element.rightTemp);
        rgdat.push(element.rightTemp);
        lfdat.push(element.leftTemp);
      });
      let sumct = ctdat.reduce((previous, current) => (current += previous));
      let sumlf = lfdat.reduce((previous, current) => (current += previous));
      let sumrg = rgdat.reduce((previous, current) => (current += previous));
      let avgct = sumct / ctdat.length;
      let avglf = sumlf / lfdat.length;
      let avgrg = sumrg / rgdat.length;
      var datalf = google.visualization.arrayToDataTable([
        ["CM", "TM"],
        [0, 0]
      ]);
      this.data.forEach((element, index) => {
        datalf.addRows([[index, element.leftTemp]]);
      });
      datalf.removeRow(0);
      var datarg = google.visualization.arrayToDataTable([
        ["CM", "TM"],
        [0, 0]
      ]);
      this.data.forEach((element, index) => {
        datarg.addRows([[index, element.rightTemp]]);
      });
      datarg.removeRow(0);
      var datact = google.visualization.arrayToDataTable([
        ["CM", "TM"],
        [0, 0]
      ]);
      ctdat.forEach((element, index) => {
        datact.addRows([[index, element]]);
      });
      datact.removeRow(0);
      var optionslf = {
        backgroundColor: "#000000",
        chartArea: { left: 25, top: 15, width: "92%", height: "90%" },
        curveType: "function",
        legend: {
          position: "bottom",
          textStyle: { color: "white" }
        },
        orientation: "vertical",
        height: 600,
        hAxis: {
          baselineColor: "#0BEB22",
          baseline: 30,
          textStyle: {
            color: "white"
          },
          minValue: avglf - 3,
          maxValue: avglf + 3
        },
        animation: {
          duration: 1000,
          startup: true,
          easing: "out"
        },
        vAxis: {
          textStyle: {
            color: "white"
          }
        }
      };
      var optionsrg = {
        backgroundColor: "#000000",
        chartArea: { left: 25, top: 15, width: "92%", height: "90%" },
        curveType: "function",
        legend: { position: "bottom", textStyle: { color: "white" } },
        orientation: "vertical",
        height: 600,
        hAxis: {
          baselineColor: "#0BEB22",
          baseline: 30,
          textStyle: {
            color: "white"
          },
          minValue: avgrg - 3,
          maxValue: avgrg + 3
        },
        animation: {
          duration: 1000,
          startup: true,
          easing: "inAndOut"
        },
        selectionMode: "multiple",
        tooltip: { trigger: "selection" },
        aggregationTarget: "category",
        crosshair: { color: "red", trigger: "both" },
        axes: {
          x: {
            0: { side: "top" }
          },
          y: {
            0: { side: "right" }
          }
        },
        vAxis: {
          textPosition: "none"
        }
        // hAxis: { textPosition: "in", ticks: [5, 10, 15, 20] }
      };
      var optionsct = {
        backgroundColor: "#000000",
        chartArea: { left: 25, top: 15, width: "92%", height: "90%" },
        curveType: "function",
        legend: { position: "bottom", textStyle: { color: "white" } },
        orientation: "vertical",
        height: 600,

        hAxis: {
          baselineColor: "#0BEB22",
          textStyle: {
            color: "white"
          },
          minValue: -2,
          maxValue: 2
        },
        vAxis: {
          textPosition: "none"
        }
      };
      var chartlf = new google.visualization.LineChart(
        document.getElementById("chart_lf")
      );
      chartlf.draw(datalf, optionslf);
      var chartrg = new google.visualization.LineChart(
        document.getElementById("chart_rg")
      );
      chartrg.draw(datarg, optionsrg);
      var chartct = new google.visualization.LineChart(
        document.getElementById("chart_ct")
      );
      chartct.draw(datact, optionsct);
    },
    stColor(num, num2) {
      // console.log("num :>> ", num);
      // console.log("num2 :>> ", num2);
      // if (num2 < num) {
      if (num <= 0.3) {
        return "green";
      } else if (num <= 0.5) {
        return "yellow-8";
      } else if (num <= 0.8) {
        return "orange";
      } else {
        return "red";
      }
      // } else {
      //   return "green";
      // }
    },
    btnGuardar() {
      this.$emit("guardar");
    }
  }
};
</script>

<style scoped>
/* .my-card
  width: 100%
  max-width: 350px */
</style>
