<template>
  <q-page class="row justify-center q-gutter-sm">
    <template v-if="scans">
      <q-intersection
        v-for="(item, index) in scans"
        :key="index"
        transition="scale"
        class="example-item"
      >
        <scan-info-card
          :item="item"
          :index="index"
          :key="index"
          :patientIdURL="patientIdURL"
          @deleteScan="deleteScan"
        />
      </q-intersection>
    </template>
    <template v-else>
      <no-scans-message page="cervical" />
    </template>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        push
        style="border-radius: 18px; background-color: #d9e7cb"
        icon="add"
        :to="'/new-scans/' + $route.params.patientId + '/cervical'"
      />
    </q-page-sticky>
  </q-page>
</template>

  <script >
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import NoScansMessage from "src/components/NoScansMessage.vue";
import { useRouter } from "vue-router";
import { db, refDB, get, child, remove } from "boot/firebase";
import { useQuasar } from "quasar";
import ScanInfoCard from "src/components/ScanInfoCard.vue";

export default {
  name: "CervicalScan",
  components: {
    NoScansMessage,
    ScanInfoCard,
  },
  setup() {
    const router = useRouter();
    const patientIdURL = ref(null);
    const $q = useQuasar();
    const localStorageUserUID = $q.localStorage.getItem("userUID");
    const scans = ref(null);

    const obtenerPatientId = () => {
      patientIdURL.value = router.currentRoute.value.params.patientId;
    };

    const getScansDB = () => {
      get(
        child(
          refDB(db),
          `users/${localStorageUserUID}/patients/${patientIdURL.value}/scans/cervical`
        )
      )
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            scans.value = snapshot.val();
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const deleteScan = (payload) => {
      console.log("se va a eliminar algunascaneo ");
      console.log(payload);
      const type = payload.type === "all" ? "" : payload.type;
      remove(
        child(
          refDB(db),
          `users/${localStorageUserUID}/patients/${patientIdURL.value}/scans/cervical/${payload.index}/${type}`
        )
      )
        .then(() => {
          console.log("Remove succeeded.");
          $q.notify({
            color: "positive",
            position: "center",
            message: "Scan deleted",
          });
        })
        .catch((error) => {
          console.log("Remove failed: " + error.message);
          $q.notify({
            color: "negative",
            position: "center",
            message: "Error deleting scan",
          });
        });
      getScansDB();
    };

    onMounted(() => {
      obtenerPatientId();
      getScansDB();
    });
    return {
      scans,
      patientIdURL,
      deleteScan,
    };
  },
};
</script>


<style scoped>
.example-item {
  height: 360px;
  width: 290px;
}
.full {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  top: -60px;
}
.posii {
  position: absolute;
  top: 130px;
  left: 8px;
}

.delet {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  /* Puedes ajustar el margen superior según sea necesario */
  margin-top: -40px;
}
.delet .q-btn__content {
  display: flex;
  align-items: center;
}
.posii2 {
  position: absolute;
  z-index: 0;
  top: 130px;
  right: 8px;
}
.positfech {
  position: inherit;
  top: -40px;
}
.hcard {
  border-radius: 20px;
  height: 345px;
}
</style>

