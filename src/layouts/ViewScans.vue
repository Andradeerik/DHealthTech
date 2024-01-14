<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-space />
        <q-btn flat icon="close" @click="goBack">
            <q-tooltip class="bg-white text-primary">Back</q-tooltip>
          </q-btn>
      </q-toolbar>
    </q-header>


    <q-page-container class="GPL__page-container">
      <q-page class="q-pa-md">
        oko
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
  name: 'ViewScans',
  setup () {
    const router = useRouter();
    console.log('ViewScans')
    function goBack() {
      router.back();
    }
    return {
      goBack,
    }
  }

}
</script>

<style>

</style>
