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
            <!-- <q-chip dense color="secondary" text-color="white">
                <q-avatar><img src="https://cdn1.iconfinder.com/data/icons/medical-health-care-thick-colored-version/33/male_patient-512.png"></q-avatar>
                name
            </q-chip> -->

          <q-toolbar-title shrink class="row items-center no-wrap">
            <span class="q-ml-sm">Escanneos</span>
          </q-toolbar-title>

          <q-space />

          <q-btn dense flat icon="close" to="/dashboard/patients">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-footer v-if="!$q.screen.gt.sm" reveal elevated bordered class="bg-white text-primary">
          <q-tabs no-caps active-color="primary" indicator-color="transparent" class="text-grey-8">
            <q-route-tab
            label="Total"
            :to="'/scans/' + $route.params.patientId + '/total'"
              exact
            />
            <q-route-tab
            label="Cervical"
            :to="'/scans/' + $route.params.patientId + '/cervical'"
              exact
            />
            <q-route-tab
            label="Lumbar"
            :to="'/scans/' + $route.params.patientId + '/lumbar'"
              exact
            />

            <q-route-tab
            label="Fosas"
            :to="'/scans/' + $route.params.patientId + '/fosas'"
              exact
            />
          </q-tabs>
        </q-footer>


      <q-page-container >
        <q-page class="q-pa-md">
          <router-view />
        </q-page>

        <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
          <div class="fit q-pt-xl q-px-sm column">
            <q-btn :to="'/scans/' + $route.params.patientId + '/total'" round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="fa-solid fa-user" />
              <div class="GPL__side-btn__label">Total</div>
            </q-btn>

            <q-btn :to="'/scans/' + $route.params.patientId + '/cervical'" round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="fa-solid fa-chevron-up" />
              <div class="GPL__side-btn__label">Cervical</div>
            </q-btn>

            <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="fa-solid fa-chevron-down" />
              <div class="GPL__side-btn__label">Lumbar</div>
              <!-- <q-badge floating color="red" text-color="white" style="top: 8px; right: 16px">
                1
              </q-badge> -->
            </q-btn>

            <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="fa-solid fa-columns" />
              <div class="GPL__side-btn__label">Fosas</div>
            </q-btn>

            <!-- <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="import_contacts" />
              <div class="GPL__side-btn__label">Photo books</div>
            </q-btn> -->
          </div>
        </q-page-sticky>



      </q-page-container>
    </q-layout>
  </template>

  <script>
  import { ref } from 'vue'

  export default {
    name: 'Scans',
    setup () {

      return {
      }

    }
  }
  </script>

  <style>

  </style>
