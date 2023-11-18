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
            <span class="q-ml-sm">nuevo scan-{{ dynamicSegment }}</span>
          </q-toolbar-title>

          <q-space />

          <q-btn flat icon="close" @click="goBack">
            <q-tooltip class="bg-white text-primary">Back</q-tooltip>
          </q-btn>
        </q-toolbar>
      </q-header>


      <q-page-container >
        <q-page class="q-pa-md">
          <router-view />
        </q-page>

        <!-- <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
          <div class="fit q-pt-xl q-px-sm column">
            <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="photo" />
              <div class="GPL__side-btn__label">Photos</div>
            </q-btn>

            <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="collections_bookmark" />
              <div class="GPL__side-btn__label">Albums</div>
            </q-btn>

            <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="assistant" />
              <div class="GPL__side-btn__label">Assistant</div>
              <q-badge floating color="red" text-color="white" style="top: 8px; right: 16px">
                1
              </q-badge>
            </q-btn>

            <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="group" />
              <div class="GPL__side-btn__label">Sharing</div>
            </q-btn>

            <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="import_contacts" />
              <div class="GPL__side-btn__label">Photo books</div>
            </q-btn>
          </div>
        </q-page-sticky> -->

      </q-page-container>
    </q-layout>
  </template>

  <script>
  import { computed, ref, onBeforeMount } from 'vue';

  export default {
    name: 'NewScans',
    setup () {
      const dynamicSegment = ref('');
      const setDynamicSegment = () => {
      const segments = window.location.pathname.split('/');
      dynamicSegment.value = segments[segments.length - 1];
    };

    onBeforeMount(() => {
      setDynamicSegment();
    });
    function goBack() {
        window.history.back();
    }
      return {
        goBack,
        dynamicSegment: computed(() => dynamicSegment.value),
      }

    }
  }
  </script>

  <style>

  </style>
