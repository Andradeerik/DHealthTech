<template>
  <div>
    <template v-if="showScannerStatusBanner">
      <q-banner style="border-radius: 20px" class="bg-orange -8 text-white">
        <template v-slot:avatar>
          <q-icon class="q-ml-md" name="warningf" />
        </template>
        Todavía no tienes un escáner registrado en tu cuenta. ¿Deseas registrar
        uno ahora?
        <template v-slot:action>
          <q-btn push color="light-green-3" label="Registrar Escáner" @click="registerScann()" />
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
            :value="mmScanning >= 400 ? 100 : Math.min((mmScanning * 2.6) / 10, 100)"
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
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { useQuasar } from 'quasar'
import graph from "components/ScannerGraphs.vue";
import spineThermography from "components/SpineThermography.vue";
import { useRouter } from 'vue-router'
import { auth, provider, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, db, refDB, set, child, get, update, onValue, off, remove } from "boot/firebase";


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
  name: "NewTotalScan",
  components: { graph, spineThermography },
  props: {
    idScan: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    typeScan: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const $q = useQuasar()
    const patientIdURL = ref(null)
    const showScannerStatusBanner = ref(true);

    console.log(props.idScan)
    const baner = ref({
      info: "Presiona el botón de tu escáner para comenzar.",
      color: "info",
    });
    let mmScanning = ref(0);
    const scanningComplete = ref(false);
    const incrementAmount = 1;
    const dataForGraph = ref([])

    const resetValues = () => {
    showScannerStatusBanner.value = true;
    baner.value = {
      info: "Presiona el botón de tu escáner para comenzar.",
      color: "info",
    };
    mmScanning.value = 0;
    scanningComplete.value = false;
    dataForGraph.value = [];
  };

  function registerScann () {
    console.log("registerScann");
    $q.dialog({
        title: 'Asociar Scanner a Cuenta',
        message: 'Introduce el ID del scanner:',
        prompt: {
          model: '',
          type: 'number'
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        console.log('>>>> OK, received', data)
        const scanID = data
        const userUID = $q.localStorage.getItem('userUID')
        console.log(userUID)
        const pathScan = `gadgets/scanners/${scanID}`
        console.log(pathScan)
        get(refDB(db, pathScan)).then((snapshot)=>{
          if (snapshot.exists()) {
            const scannerData = snapshot.val()
            console.log(scannerData)
            const pathUser = `users/${userUID}/scanners`
            console.log(pathUser)
            if(snapshot.val().userUID){
              $q.notify({
                position:'center',
                type: 'negative',
                message: 'El escáner ya está asociado a otra cuenta.'
              })
              return
            }

            update(refDB(db, pathUser), {
              scanID: scanID
            }).then(() => {
              update(refDB(db, pathScan), {
                userUID: userUID
              }).then(() => {
                $q.notify({
                  position:'center',
                  type: 'positive',
                  message: 'Escáner asociado exitosamente.'
                })
                showScannerStatusBanner.value = false;
              })

            })
            .catch((error) => {
              // The write failed...
            });
          } else {
            $q.notify({
              position:'center',
              type: 'negative',
              message: 'El escáner no existe.'
            })
          }
        })

      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        console.log('I am triggered on both OK and Cancel')
      })
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
            if (mmScanning.value >= 400) {
              clearInterval(interval);
              dataForGraph.value = dataSimulate
              scanningComplete.value = true;
            }
          }, 30);
        }, 2000);
      }, 2000);
    };


    const savedScans = () => {
      const userUID = $q.localStorage.getItem('userUID')
      const patientUID = patientIdURL.value
      const timeUnix = Date.now()
      let keyToScan = ''
      if (props.type === 'post') {
        keyToScan = props.idScan
      } else {
        keyToScan = timeUnix
      }
      const path = `users/${userUID}/patients/${patientUID}/scans/${props.typeScan}/${keyToScan}/${props.type}`
      console.log(path)
      update(refDB(db, path), {
        timeUnix: timeUnix,
        mmScanning: mmScanning.value,
        dataForGraph: dataForGraph.value,
      }).then(() => {
        $q.notify({
          position:'center',
          type: 'positive',
          message: 'Escaneo guardado exitosamente.'
        })
        resetValues()
      })
      .catch((error) => {
        // The write failed...
      });

    };
    const obtenerPatientId = () => {
      const patientId = router.currentRoute.value.params.patientId
      patientIdURL.value = patientId
    }

    function getShowScannerStatusBanner() {
      const userUID = $q.localStorage.getItem('userUID')
      const path = `users/${userUID}/scanners`
      get(refDB(db, path)).then((snapshot) => {
        if (snapshot.exists()) {
          showScannerStatusBanner.value = false;
        } else {
          showScannerStatusBanner.value = true;
        }
      }).catch((error) => {
        console.error(error);
        showScannerStatusBanner.value = true;
      });
    }

    onMounted(() => {
      obtenerPatientId()
      getShowScannerStatusBanner()
    })

    return {
      baner,
      showScannerStatusBanner,
      scanningComplete,
      mmScanning,
      dataForGraph,
      simulateScanning,
      savedScans,
      registerScann,
    };
  },
};
</script>
<style>

</style>
