<template>
    <q-layout view="lHh Lpr fff" class="bg-grey-1">
      <q-header class="bg-white text-grey-8" height-hint="64">
        <q-toolbar class="GPL__toolbar" style="height: 64px">

          <div style="max-width: 30%">
                <q-chip

                color="primary"
                text-color="white"
                >
                <q-avatar size="27px">
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
                <div class="ellipsis">
                    Erik daniel andrade peralrta
                    <q-tooltip>cookiesLabel</q-tooltip>
                </div>
            </q-chip>
        </div>

        <q-space />

          <q-toolbar-title shrink class="row items-center no-wrap">
            <span class="q-ml-sm">Editscan-{{ type }}</span>
          </q-toolbar-title>

          <q-space />

          <q-btn flat icon="close" @click="goBack">
            <q-tooltip class="bg-white text-primary">Back</q-tooltip>
          </q-btn>
        </q-toolbar>
      </q-header>


      <q-page-container >
        <q-page class="q-pa-md">
          <!-- {{ idScan }}
          {{ patientId }}
          {{ typeScan }}
          {{ type }}
          <router-view /> -->
          <ScanCreation
            :idScan="idScan"
            :patientId="patientId"
            :typeScan="typeScan"
            :type="type"
          />
        </q-page>
      </q-page-container>
    </q-layout>
</template>
<script>
import { useRouter } from 'vue-router';
import ScanCreation from 'src/components/ScanCreation.vue';
export default {
  name: 'EditScans',
  components: {
    ScanCreation
  },
  setup () {
    const router = useRouter();
    const idScan = router.currentRoute.value.params.idScan;
    const patientId = router.currentRoute.value.params.patientId;
    const typeScan = router.currentRoute.value.params.typeScan;
    const type = router.currentRoute.value.params.type;


    function goBack() {
        router.back();
    }
    return {
      goBack,
      idScan,
      patientId,
      typeScan,
      type,
    }
  }

}
</script>
<style>

</style>
