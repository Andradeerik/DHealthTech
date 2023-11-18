<template>
    <q-page>
      <h4>CervicalScan</h4>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="secondary" :to="'/new-scans/' + $route.params.patientId + '/cervical'" />
        </q-page-sticky>
    </q-page>
  </template>

  <script >
  import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'

  export default {
    name: 'CervicalScan',
    components: {

    },
    setup () {


      return {
      }
    }
  }
  </script>

  <style scoped>
  </style>