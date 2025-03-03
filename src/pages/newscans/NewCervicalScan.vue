<template>
  <q-page>
    <template v-if="showScannerStatusBanner">
      <q-banner style="border-radius: 20px" class="bg-orange -8 text-white">
        <template v-slot:avatar>
          <q-icon class="q-ml-md" name="warningf" />
        </template>
        Todavía no tienes un escáner registrado en tu cuenta. ¿Deseas registrar
        uno ahora?
        <template v-slot:action>
          <q-btn
            push
            color="light-green-3"
            label="Registrar Escáner"
            @click="registerScann()"
          />
          <q-btn
            push
            color="light-blue-3"
            label="Simular Escaneo"
            @click="simulateScanning()"
          />
        </template>
      </q-banner>
    </template>
    <template v-else>
      <template v-if="scanningComplete === false">
        <q-banner
          class="text-white text-center"
          :class="'bg-' + baner.color"
          style="border-radius: 20px"
        >
          {{ baner.info }}
          <br />
          <q-spinner-bars v-if="baner.spiner" size="5.5em" color="info" />
        </q-banner>
        <div class="flex flex-center">
          <q-circular-progress
            v-if="baner.spiner === false"
            show-value
            font-size="22px"
            :value="
              mmScanning >= 120 ? 100 : Math.min((mmScanning * 2.6) / 10, 100)
            "
            size="250px"
            color="teal"
            track-color="grey-3"
            class="q-ma-md"
          >
            {{ (mmScanning / 10).toFixed() }}cm
            <br />
          </q-circular-progress>
        </div>
      </template>
      <template v-if="scanningComplete">
        <!-- <graph
          :data="dataForGraph"
          :btn="true"
          :mm="mmScanning"
          @guardar="savedScans"
        /> -->
        <spineThermography
          :data="dataForGraph"
          :btn="true"
          :mm="mmScanning"
          @saveScan="savedScans"
        />
      </template>
    </template>
  </q-page>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useQuasar } from "quasar";
import graph from "components/ScannerGraphs.vue";
import spineThermography from "components/SpineThermography.vue";
import { useRouter } from "vue-router";
import {
  auth,
  provider,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  db,
  refDB,
  set,
  child,
  get,
  update,
  onValue,
  off,
  remove,
} from "boot/firebase";
import SpineThermographyVue from "src/components/SpineThermography.vue";
// import mqtt, { connect } from "mqtt";
import mqtt from "mqtt";

const dataSimulate = [
  {
    desfLft: 0.08,
    desfRig: 0.17,
    leftTemp: 34.35,
    rightTemp: 34.18,
  },
  {
    desfLft: 0.16,
    desfRig: 0.32,
    leftTemp: 34.07,
    rightTemp: 34.39,
  },
  {
    desfLft: 0.02,
    desfRig: 0.04,
    leftTemp: 34.31,
    rightTemp: 34.26,
  },
  {
    desfLft: 0.07,
    desfRig: 0.03,
    leftTemp: 34.37,
    rightTemp: 34.29,
  },
  {
    desfLft: 0.1,
    desfRig: 0.05,
    leftTemp: 34.4,
    rightTemp: 34.51,
  },
  {
    desfLft: 0.14,
    desfRig: 0.07,
    leftTemp: 34.29,
    rightTemp: 34.14,
  },
  {
    desfLft: 0.15,
    desfRig: 0.3,
    leftTemp: 34.34,
    rightTemp: 34.65,
  },
  {
    desfLft: 0.03,
    desfRig: 0.06,
    leftTemp: 34.52,
    rightTemp: 34.46,
  },
  {
    desfLft: 0.11,
    desfRig: 0.22,
    leftTemp: 34.23,
    rightTemp: 34,
  },
  {
    desfLft: 0.04,
    desfRig: 0.08,
    leftTemp: 31.61,
    rightTemp: 31.52,
  },
  {
    desfLft: 0.09,
    desfRig: 0.04,
    leftTemp: 34.63,
    rightTemp: 34.72,
  },
  {
    desfLft: 0.24,
    desfRig: 0.12,
    leftTemp: 34.57,
    rightTemp: 34.32,
  },
  {
    desfLft: 0.29,
    desfRig: 0.14,
    leftTemp: 34.37,
    rightTemp: 34.07,
  },
  {
    desfLft: 0.24,
    desfRig: 0.12,
    leftTemp: 34.32,
    rightTemp: 34.08,
  },
  {
    desfLft: 0,
    desfRig: 0,
    leftTemp: 34.23,
    rightTemp: 34.22,
  },
  {
    desfLft: 0.06,
    desfRig: 0.03,
    leftTemp: 34.23,
    rightTemp: 34.17,
  },
  {
    desfLft: 0.01,
    desfRig: 0.03,
    leftTemp: 34.44,
    rightTemp: 34.41,
  },
  {
    desfLft: 0.68,
    desfRig: 0.34,
    leftTemp: 33.14,
    rightTemp: 33.83,
  },
  {
    desfLft: 0.03,
    desfRig: 0.01,
    leftTemp: 31.69,
    rightTemp: 31.72,
  },
  {
    desfLft: 0.38,
    desfRig: 0.76,
    leftTemp: 34.13,
    rightTemp: 33.36,
  },
  {
    desfLft: 0.09,
    desfRig: 0.19,
    leftTemp: 34.44,
    rightTemp: 34.25,
  },
  {
    desfLft: 0.03,
    desfRig: 0.06,
    leftTemp: 34.32,
    rightTemp: 34.26,
  },
  {
    desfLft: 0.23,
    desfRig: 0.11,
    leftTemp: 34.17,
    rightTemp: 34.41,
  },
  {
    desfLft: 0.16,
    desfRig: 0.08,
    leftTemp: 34.37,
    rightTemp: 34.2,
  },
];

export default {
  name: "NewCervicalScan",
  components: { graph, spineThermography },
  setup() {
    let avgScanner = ref([]);
    const router = useRouter();
    const $q = useQuasar();
    const patientIdURL = ref(null);
    const showScannerStatusBanner = ref(true);
    const baner = ref({
      info: "1. Coloque el escáner en la primera vértebra (atlas). 2. Presione el botón para calibrar.",
      color: "info",
    });
    let mmScanning = ref(0);
    const scanningComplete = ref(false);
    const incrementAmount = 1;
    const dataForGraph = ref([]);
    const dataMqtt = ref([]);

    const isConnected = ref(false);
    const client = ref(null);
    const message = ref(null);
    const messageToSend = ref("");

    const connect = (scanID) => {
      console.log("Conectando al broker MQTT...");
      const options = {
        host: "broker.emqx.io",
        port: 8084,
        endpoint: "/mqtt",
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 5000,
        // Certification Information
        clientId:
          "web_" + "client_id_" + Math.floor(Math.random() * 1000000 + 1),
        username: "",
        password: "",
      };

      let timeoutId;

      const connectUrl =
        "wss://" + options.host + ":" + options.port + options.endpoint;

      client.value = mqtt.connect(connectUrl, options); // Reemplaza con la URL de tu broker

      client.value.on("connect", () => {
        console.log("Conectado al broker MQTT");
        isConnected.value = true;

        // Suscríbete a los temas que necesites
        console.log(`scanID: ${scanID}`);
        client.value.subscribe(
          `r2GqN8hAWxyFoGh/scanners/${scanID}/#`,
          { qos: 0 },
          (error) => {
            if (error) {
              console.error("Error al suscribirse:", error);
            } else {
              console.log(
                "Suscripción exitosa al tema r2GqN8hAWxyFoGh/scanners/${scanID}/#"
              );
              client.value.publish(
                `r2GqN8hAWxyFoGh/scanners/${scanID}/input`,
                "status"
              );
              timeoutId = setTimeout(() => {
                // this.$q.loading.hide();
                $q.notify({
                  message: "No se pudo establecer conexión con el scanner",
                  type: "negative",
                  position: "center",
                  timeout: 500,
                });
                baner.value = {
                  info: "No se pudo establecer conexión con el scanner",
                  color: "negative",
                };
                // this.statusScann = false;
              }, 1500);
            }
          }
        );
      });

      client.value.on("error", (error) => {
        console.error("Error MQTT:", error);
        isConnected.value = false;
      });

      client.value.on("message", (topic, message) => {
        console.log(`Mensaje recibido en ${topic}: ${message.toString()}`);
        message.value = message.toString(); // Guarda el último mensaje recibido

        if (topic === `r2GqN8hAWxyFoGh/scanners/${scanID}/btn`) {
          if (message.toString() === "true") {
            // if (this.tab === "fosas") {
            // }
            // if (this.listo) {
            //   this.restar();
            // }
            // this.baner.color = "indigo";
            // this.baner.info = "Espere";
            // this.baner.spiner = true;
            baner.value = {
              info: "Calibrando sensores para una medición precisa. Por favor, espere.",
              color: "indigo",
              spiner: true,
            };
          }
          if (message.toString() === "false") {
            //   if (this.tab === "fosas") {
            //     if (this.rData) {
            //       const trunc = (x, posit = 0) => {
            //         return Number(
            //           x
            //             .toString()
            //             .substr(0, x.toString().indexOf(".") + 1 + posit)
            //         );
            //       };
            //       // console.log(this.leftData);
            //       // console.log(this.rData);
            //       let ladLef = null;
            //       let lagR = null;
            //       let lagLeft = null;
            //       let lagRight = null;
            //       this.leftData[0] > this.rData[0]
            //         ? ((lagLeft = this.leftData[0] - this.rData[0]),
            //           (lagRight = (this.leftData[0] - this.rData[0]) / 2))
            //         : ((lagRight = this.rData[0] - this.leftData[0]),
            //           (lagLeft = (this.rData[0] - this.leftData[0]) / 2));

            //       this.data2 = [
            //         {
            //           leftTemp: trunc(this.leftData[0], 2),
            //           rightTemp: trunc(this.rData[0], 2),
            //           desfLft: trunc(lagLeft, 2),
            //           desfRig: trunc(lagRight, 2),
            //         },
            //       ];
            //       this.listo = true;
            //       // console.log("okokokokok");
            //     } else {
            //       // console.log("btnfalse fosas");
            //       this.baner = {
            //         color: "purple-6",
            //         info: "el sensor iaz en fos der",
            //         bansbtn: true,
            //       };
            //     }
            //   } else {
            // baner.value = { info: "presionbtn", color: "info" };
            // if (this.tab === "cervical") {
            //   if (mmScanning.value < 60 || mmScanning.value > 120) {
            //     this.$q.notify({
            //       message: mmScanning.value < 60 ? "cm min 6" : "cm max 12",
            //       color: "negative",
            //       multiLine: true,
            //       timeout: 3500,
            //       position: "center",
            //       badgeClass: "shadow-3 glossy my-badge-class",
            //       icon: "warning",
            //     });
            //   } else {
            //     this.ofGraph();
            //   }
            // }
            // if (this.tab === "total") {
            if (mmScanning.value < 60 || mmScanning.value > 120) {
              $q.notify({
                message: mmScanning.value < 60 ? "cm min 6" : "cm max 12",
                color: "negative",
                multiLine: true,
                timeout: 3500,
                position: "center",
                badgeClass: "shadow-3 glossy my-badge-class",
                icon: "warning",
              });
            } else {
              ofGraph(dataMqtt.value, 24, avgScanner.value);
            }
            // }
            // if (this.tab === "lumbar") {
            //   if (mmScanning.value < 150 || mmScanning.value > 180) {
            //     this.$q.notify({
            //       message: mmScanning.value < 150 ? "cm min 15" : "cm max 18",
            //       color: "negative",
            //       multiLine: true,
            //       timeout: 3500,
            //       position: "center",
            //       badgeClass: "shadow-3 glossy my-badge-class",
            //       icon: "warning",
            //     });
            //   } else {
            //     this.ofGraph();
            //   }
            // } else {
            //   dataMqtt.value = [];
            // }
            // }
          }
        }

        if (topic === `r2GqN8hAWxyFoGh/scanners/${scanID}/avg`) {
          // console.log("avg");
          // console.log(message.toString());
          if (message.toString() === "btnOff") {
            $q.notify({
              message:
                "Has soltado el botón antes de tiempo. La medición ha sido cancelada.",
              color: "info",
              multiLine: true,
              timeout: 2500,
              position: "center",
              badgeClass: "shadow-3 glossy my-badge-class",
              icon: "warning",
            });
          } else {
            // if (this.tab === "fosas") {
            //   if (this.baner.bansbtn) {
            //     this.rData = message.toString().split(",");
            //     // console.log(this.rData[0]);
            //     this.baner = { color: "green", info: "suelta btn list" };
            //   } else {
            //     // console.log(message.toString().split(","));
            //     // console.log(message.toString().split(","));
            //     this.leftData = message.toString().split(",");
            //     // console.log(this.leftData[0]);
            //     this.baner = { color: "green", info: "suelta btn " };
            //   }
            // } else {
            avgScanner.value = message.toString().split(",");
            // this.baner.color = "purple";
            // this.baner.info = "Comience con el escaneo de la zona ";
            // this.baner.spiner = false;

            baner.value = {
              info: "Deslice el escáner hasta la vértebra lumbar L5",
              color: "purple",
              spiner: false,
            };

            // }
          }
        }

        if (topic === `r2GqN8hAWxyFoGh/scanners/${scanID}/output`) {
          dataMqtt.value.push(message.toString().split(","));
          const wheelDiameter = 34.27;
          mmScanning.value =
            ((Math.PI * wheelDiameter) / 80) *
            parseInt(dataMqtt.value[dataMqtt.value.length - 1][0]);
        }

        if (topic === `r2GqN8hAWxyFoGh/scanners/${scanID}/status`) {
          console.log("hola vamos a ver");
          console.log(message.toString());

          if (message.toString() === "on") {
            clearTimeout(timeoutId);
            // this.$q.loading.hide();
            // this.statusScann = true;
            $q.notify({
              message: "Conexión establecida con el scanner",
              type: "positive",
              position: "center",
              timeout: 500,
            });
            client.value.publish(
              `r2GqN8hAWxyFoGh/scanners/${scanID}/input`,
              "cervical"
            );
          }
        }
      });
    };

    const disconnect = () => {
      if (client.value) {
        client.value.end();
        isConnected.value = false;
        console.log("Desconectado del broker MQTT");
      }
    };

    const toggleConnection = () => {
      if (isConnected.value) {
        disconnect();
      } else {
        connect();
      }
    };

    const sendMessage = () => {
      if (client.value && isConnected.value) {
        client.value.publish(
          "tema/ejemplo",
          messageToSend.value,
          { qos: 0 },
          (error) => {
            if (error) {
              console.error("Error al enviar mensaje:", error);
            } else {
              console.log("Mensaje enviado correctamente");
              messageToSend.value = ""; // Limpia el input después de enviar el mensaje
            }
          }
        );
      }
    };

    const resetValues = () => {
      showScannerStatusBanner.value = true;
      baner.value = {
        info: "1. Coloque el escáner en la primera vértebra (atlas). 2. Presione el botón para calibrar.",
        color: "info",
      };
      mmScanning.value = 0;
      scanningComplete.value = false;
      dataForGraph.value = [];
    };

    const simulateScanning = () => {
      showScannerStatusBanner.value = false;
      setTimeout(() => {
        baner.value.color = "indigo";
        baner.value.info = "Espere";
        baner.value.spiner = true;
        setTimeout(() => {
          baner.value.color = "purple";
          baner.value.info = "Comience con el escaneo de la zona ";
          baner.value.spiner = false;
          const interval = setInterval(() => {
            mmScanning.value += incrementAmount;
            console.log(`mmScanning: ${mmScanning.value} mm`);
            if (mmScanning.value >= 120) {
              clearInterval(interval);
              dataForGraph.value = dataSimulate;
              scanningComplete.value = true;
            }
          }, 30);
        }, 2000);
      }, 2000);
    };

    const savedScans = () => {
      const userUID = $q.localStorage.getItem("userUID");
      const patientUID = patientIdURL.value;
      const timeUnix = Date.now();
      update(
        refDB(
          db,
          `users/${userUID}/patients/${patientUID}/scans/cervical/${timeUnix}/pre`
        ),
        {
          timeUnix: timeUnix,
          mmScanning: mmScanning.value,
          dataForGraph: dataForGraph.value,
        }
      )
        .then(() => {
          $q.notify({
            position: "top-right",
            type: "positive",
            message: "Escaneo guardado exitosamente.",
          });
          resetValues();
        })
        .catch((error) => {
          // The write failed...
        });
    };
    const obtenerPatientId = () => {
      const patientId = router.currentRoute.value.params.patientId;
      patientIdURL.value = patientId;
    };

    function ofGraph(dataMqtt, numberOfVertebrae, avgScanner) {
      console.log("ofGraph");
      // showScannerStatusBanner.value = false;
      // console.log("mmScanning", mmScanning.value);
      // dataForGraph.value = dataMqtt.value;
      // console.log("dataForGraph", dataForGraph.value);
      // scanningComplete.value = true;

      console.log("para la grafica ");
      // console.log("actTyke", this.actTyke);
      const avgTemp = (x1, x2, typ) => {
        let x = [];
        while (x1 < x2) {
          typ === "temp1"
            ? x.push(parseFloat(dataMqtt[x1][1]))
            : x.push(parseFloat(dataMqtt[x2][2]));
          x1++;
        }
        return (
          x.reduce((previous, current) => (current += previous)) / x.length
        );
      };
      const trunc = (x, posit = 0) => {
        return Number(
          x.toString().substr(0, x.toString().indexOf(".") + 1 + posit)
        );
      };
      let n = 0;
      let dtv = Math.trunc((dataMqtt.length - 1) / numberOfVertebrae);
      console.log(dataMqtt.length);
      console.log(numberOfVertebrae);
      console.log(dtv);
      let n1 = 0;
      let n2 = 0;
      let sensorOffset = 0;
      avgScanner[0] > avgScanner[1]
        ? (sensorOffset = avgScanner[0] - avgScanner[1])
        : (sensorOffset = avgScanner[1] - avgScanner[0]);
      let dataForGraphOfGraph = [];
      while (n < numberOfVertebrae) {
        n++;
        n2 += dtv;
        let rightSensor = avgTemp(n1, n2, "temp1");
        let leftSensor = avgTemp(n1, n2, "temp2");
        let lagLeft = null;
        let lagRight = null;
        leftSensor > rightSensor
          ? (leftSensor -= sensorOffset)
          : (rightSensor -= sensorOffset);
        leftSensor > rightSensor
          ? ((lagLeft = leftSensor - rightSensor),
            (lagRight = (leftSensor - rightSensor) / 2))
          : ((lagRight = rightSensor - leftSensor),
            (lagLeft = (rightSensor - leftSensor) / 2));

        // if (this.actTyke) {
        //   // console.log("ok tenemos datos ");
        //   // console.log("data", this.actTyke.dataItem.pre.data);
        //   // console.log("n :>> ", n);
        //   // console.log("n1 :>> ", n1);
        //   // console.log("n2 :>> ", n2);
        //   // console.log("leftSensor :>> ", leftSensor);
        //   // console.log("trunc(leftSensor, 2) :>> ", trunc(leftSensor, 2));
        //   // console.log("trunc(lagLeft, 2) :>> ", trunc(lagLeft, 2));
        //   // console.log("trunc(lagRight, 2) :>> ", trunc(lagRight, 2));
        //   // console.log(
        //   //   "this.actTyke.dataItem.pre.data[n - 1].desfLft :>> ",
        //   //   this.actTyke.dataItem.pre.data[n - 1].desfLft
        //   // );
        //   // console.log(
        //   //   "this.actTyke.dataItem.pre.data[n - 1].desfRgt :>> ",
        //   //   this.actTyke.dataItem.pre.data[n - 1].desfRig
        //   // );

        //   // console.log(this.actTyke.dataItem.pre.data[n - 1].leftTemp);

        //   let desfLftCustome;
        //   let desfRgtCustome;
        //   let leftTempCustome;
        //   let rightTempCustome;

        //   if (
        //     this.actTyke.dataItem.pre.data[n - 1].desfRig >
        //     this.actTyke.dataItem.pre.data[n - 1].desfLft
        //   ) {
        //     console.log("gano el lado rigth");
        //     if (trunc(lagRight, 2) > trunc(lagLeft, 2)) {
        //       if (
        //         this.actTyke.dataItem.pre.data[n - 1].desfRig >
        //         trunc(lagRight, 2)
        //       ) {
        //         desfRgtCustome = trunc(lagRight, 2);
        //         rightTempCustome = trunc(leftSensor, 2);
        //         desfLftCustome = trunc(lagLeft, 2);
        //         leftTempCustome = trunc(rightSensor, 2);
        //       } else {
        //         desfRgtCustome = this.actTyke.dataItem.pre.data[n - 1].desfRig;
        //         rightTempCustome =
        //           this.actTyke.dataItem.pre.data[n - 1].rightTemp;
        //         desfLftCustome = this.actTyke.dataItem.pre.data[n - 1].desfLft;
        //         leftTempCustome =
        //           this.actTyke.dataItem.pre.data[n - 1].leftTemp;
        //       }
        //     } else {
        //       if (
        //         this.actTyke.dataItem.pre.data[n - 1].desfLft >
        //         trunc(lagLeft, 2)
        //       ) {
        //         desfLftCustome = trunc(lagLeft, 2);
        //         leftTempCustome = trunc(rightSensor, 2);
        //         desfRgtCustome = trunc(lagRight, 2);
        //         rightTempCustome = trunc(leftSensor, 2);
        //       } else {
        //         desfLftCustome = this.actTyke.dataItem.pre.data[n - 1].desfLft;
        //         leftTempCustome =
        //           this.actTyke.dataItem.pre.data[n - 1].leftTemp;
        //         desfRgtCustome = this.actTyke.dataItem.pre.data[n - 1].desfRig;
        //         rightTempCustome =
        //           this.actTyke.dataItem.pre.data[n - 1].rightTemp;
        //       }
        //     }
        //   } else {
        //     console.log("gano el lado left");
        //     if (trunc(lagLeft, 2) > trunc(lagRight, 2)) {
        //       if (
        //         this.actTyke.dataItem.pre.data[n - 1].desfLft >
        //         trunc(lagLeft, 2)
        //       ) {
        //         desfLftCustome = trunc(lagLeft, 2);
        //         leftTempCustome = trunc(rightSensor, 2);
        //         desfRgtCustome = trunc(lagRight, 2);
        //         rightTempCustome = trunc(leftSensor, 2);
        //       } else {
        //         desfLftCustome = this.actTyke.dataItem.pre.data[n - 1].desfLft;
        //         leftTempCustome =
        //           this.actTyke.dataItem.pre.data[n - 1].leftTemp;
        //         desfRgtCustome = this.actTyke.dataItem.pre.data[n - 1].desfRig;
        //         rightTempCustome =
        //           this.actTyke.dataItem.pre.data[n - 1].rightTemp;
        //       }
        //     } else {
        //       if (
        //         this.actTyke.dataItem.pre.data[n - 1].desfRig >
        //         trunc(lagRight, 2)
        //       ) {
        //         desfRgtCustome = trunc(lagRight, 2);
        //         rightTempCustome = trunc(leftSensor, 2);
        //         desfLftCustome = trunc(lagLeft, 2);
        //         leftTempCustome = trunc(rightSensor, 2);
        //       } else {
        //         desfRgtCustome = this.actTyke.dataItem.pre.data[n - 1].desfRig;
        //         rightTempCustome =
        //           this.actTyke.dataItem.pre.data[n - 1].rightTemp;
        //         desfLftCustome = this.actTyke.dataItem.pre.data[n - 1].desfLft;
        //         leftTempCustome =
        //           this.actTyke.dataItem.pre.data[n - 1].leftTemp;
        //       }
        //     }
        //   }

        //   this.data2.push({
        //     rightTemp: rightTempCustome,
        //     leftTemp: leftTempCustome,
        //     desfRig: desfRgtCustome,
        //     desfLft: desfLftCustome,
        //   });

        //   // this.data2.push({
        //   //   // leftTemp: trunc(leftSensor, 2),
        //   //   // rightTemp: trunc(rightSensor, 2),
        //   //   // desfLft: trunc(lagLeft, 2),
        //   //   // desfRig: trunc(lagRight, 2)
        //   //   rightTemp: trunc(leftSensor, 2),
        //   //   leftTemp: trunc(rightSensor, 2),
        //   //   desfRig: trunc(lagLeft, 2),
        //   //   desfLft: trunc(lagRight, 2)
        //   // });
        // } else {
        // console.log("no tenemos datos ");
        dataForGraphOfGraph.push({
          // leftTemp: trunc(leftSensor, 2),
          // rightTemp: trunc(rightSensor, 2),
          // desfLft: trunc(lagLeft, 2),
          // desfRig: trunc(lagRight, 2)
          rightTemp: trunc(leftSensor, 2),
          leftTemp: trunc(rightSensor, 2),
          desfRig: trunc(lagLeft, 2),
          desfLft: trunc(lagRight, 2),
        });
        // }
        n1 += dtv;
      }
      // this.listo = true;
      // console.log(this.data2);
      showScannerStatusBanner.value = false;

      dataForGraph.value = dataForGraphOfGraph;
      console.log("dataForGraph", dataForGraph.value);
      console.log("dataForGraphOfGraph", dataForGraphOfGraph);
      scanningComplete.value = true;
      console.log("se termina de crear la grafica ");
    }

    onMounted(() => {
      getShowScannerStatusBanner();
      obtenerPatientId();
    });

    onUnmounted(() => {
      disconnect(); // Desconecta al desmontar el componente
    });

    function registerScann() {
      console.log("registerScann");
      $q.dialog({
        title: "Asociar Scanner a Cuenta",
        message: "Introduce el ID del scanner:",
        prompt: {
          model: "",
          type: "number",
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          console.log(">>>> OK, received", data);
          const scanID = data;
          const userUID = $q.localStorage.getItem("userUID");
          console.log(userUID);
          const pathScan = `gadgets/scanners/${scanID}`;
          console.log(pathScan);
          get(refDB(db, pathScan)).then((snapshot) => {
            if (snapshot.exists()) {
              const scannerData = snapshot.val();
              console.log(scannerData);
              const pathUser = `users/${userUID}/scanners`;
              console.log(pathUser);
              if (snapshot.val().userUID) {
                $q.notify({
                  position: "center",
                  type: "negative",
                  message: "El escáner ya está asociado a otra cuenta.",
                });
                return;
              }

              update(refDB(db, pathUser), {
                scanID: scanID,
              })
                .then(() => {
                  update(refDB(db, pathScan), {
                    userUID: userUID,
                  }).then(() => {
                    $q.notify({
                      position: "center",
                      type: "positive",
                      message: "Escáner asociado exitosamente.",
                    });
                    showScannerStatusBanner.value = false;
                  });
                })
                .catch((error) => {
                  // The write failed...
                });
            } else {
              $q.notify({
                position: "center",
                type: "negative",
                message: "El escáner no existe.",
              });
            }
          });
        })
        .onCancel(() => {
          console.log(">>>> Cancel");
        })
        .onDismiss(() => {
          console.log("I am triggered on both OK and Cancel");
        });
    }

    function getShowScannerStatusBanner() {
      console.log("getShowScannerStatusBanner-NewCervicalScan");
      const userUID = $q.localStorage.getItem("userUID");
      const path = `users/${userUID}/scanners`;
      get(refDB(db, path))
        .then((snapshot) => {
          if (snapshot.exists()) {
            showScannerStatusBanner.value = false;
            console.log("snapshot", snapshot.val().scanID);
            connect(snapshot.val().scanID); // Conecta al broker al montar el componente
          } else {
            showScannerStatusBanner.value = true;
          }
        })
        .catch((error) => {
          console.error(error);
          showScannerStatusBanner.value = true;
        });
    }

    return {
      isConnected,
      message,
      messageToSend,
      toggleConnection,
      sendMessage,

      registerScann,
      baner,
      showScannerStatusBanner,
      scanningComplete,
      mmScanning,
      dataForGraph,
      simulateScanning,
      savedScans,
    };
  },
};
</script>

<style scoped></style>
