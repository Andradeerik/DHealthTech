<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        Escaneo {{ typeScan }}-{{ type === 'compare' ? '' : type }} Guardado
        <q-space />
        <q-btn flat icon="close" @click="goBack">
          <q-tooltip class="bg-white text-primary">Back</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container class="GPL__page-container">
      <q-page class="q-pa-md">

        <template v-if="type === 'compare'">
          <q-splitter
            v-model="splitterModel"
            style="height: 100%"
          >

            <template v-slot:before>
              <div class="q-pa-md">
                <div class="text-h4 q-mb-md">pre</div>
                <spineThermography
                  v-if="dataForGraphPre"
                  :data="dataForGraphPre"
                  :btn="false"
                  :mm="mmScanningPre"
                />
              </div>
            </template>

            <template v-slot:separator>
              <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
            </template>

            <template v-slot:after>
              <div class="q-pa-md">
                <div class="text-h4 q-mb-md">Post</div>
                <spineThermography
                  v-if="dataForGraphPost"
                  :data="dataForGraphPost"
                  :btn="false"
                  :mm="mmScanningPost"
                />
              </div>
            </template>

          </q-splitter>
        </template>
        <template v-else>
          {{  formattedString }}
          <spineThermography
          v-if="dataForGraph"
          :data="dataForGraph"
          :btn="false"
          :mm="mmScanning"
          @saveScan="savedScans"
          />
        </template>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { auth, provider, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, db, refDB, set, child, get, update, onValue, off, remove } from "boot/firebase";
import { useQuasar, date } from 'quasar'
import spineThermography from "components/SpineThermography.vue";


export default {
  name: "ViewScans",
  components: { spineThermography },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar()
    const idScan = route.params.idScan;
    const patientId = route.params.patientId;
    const typeScan = route.params.typeScan;
    const type = route.params.type;
    const localStorageUserUID = $q.localStorage.getItem('userUID')
    let formattedString = ref(null)
    let mmScanning = ref(null)
    let dataForGraph = ref(null)
    let dataForGraphPre = ref(null)
    let dataForGraphPost = ref(null)
    let mmScanningPre = ref(null)
    let mmScanningPost = ref(null)
    let formattedStringPre = ref(null)
    let formattedStringPost = ref(null)

    const getScanInfo = () => {
      get(child(refDB(db), `users/${localStorageUserUID}/patients/${patientId}/scans/${typeScan}/${idScan}/${type}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log('snap => ', snapshot.val());
          // infoPatienteSelecte.value = snapshot.val()
          formattedString.value = date.formatDate( snapshot.val().timeUnix, 'dddd DD MMMM YYYY hh:mm a')
          mmScanning.value = snapshot.val().mmScanning
          dataForGraph.value = snapshot.val().dataForGraph
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }

    const getScansInfo = () => {
      console.log('getScansInfo vamos a obtener los datos de los 2 escaneos (pre y post)');
      get(child(refDB(db), `users/${localStorageUserUID}/patients/${patientId}/scans/${typeScan}/${idScan}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log('snap => ', snapshot.val());
          dataForGraphPre.value = snapshot.val().pre.dataForGraph
          mmScanningPre.value = snapshot.val().pre.mmScanning
          formattedStringPre.value = date.formatDate( snapshot.val().pre.timeUnix, 'dddd DD MMMM YYYY hh:mm a')
          dataForGraphPost.value = snapshot.val().post.dataForGraph
          mmScanningPost.value = snapshot.val().post.mmScanning
          formattedStringPost.value = date.formatDate( snapshot.val().post.timeUnix, 'dddd DD MMMM YYYY hh:mm a')
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }


    onMounted(() => {
      type === 'compare' ? getScansInfo() : getScanInfo()
    })


    function goBack() {
      router.back();
    }


    return {
      formattedString,
      mmScanning,
      dataForGraph,
      typeScan,
      type,
      goBack,
      splitterModel: ref(50),
      formattedStringPre,
      formattedStringPost,
      mmScanningPre,
      mmScanningPost,
      dataForGraphPre,
      dataForGraphPost
    };
  },
};
</script>

<style>

</style>
