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
                    {{infoPatienteSelecte.name}}
                    <q-tooltip>
                      Correo electronico: {{infoPatienteSelecte.email}}
                      <br>
                      Fecha de nacimiento: {{infoPatienteSelecte.dateOfBirth}}
                    </q-tooltip>
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
            <!-- <q-route-tab
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
            /> -->
          </q-tabs>
        </q-footer>


      <q-page-container class="GPL__page-container">
        <q-page class="q-pa-md">
          <router-view />
        </q-page>

        <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
          <div class="fit q-pt-xl q-px-sm column">
            <q-btn :to="'/scans/' + $route.params.patientId + '/total'" round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="fa-solid fa-user" />
              <div class="GPL__side-btn__label">Total</div>
            </q-btn>

            <!-- <q-btn :to="'/scans/' + $route.params.patientId + '/cervical'" round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="fa-solid fa-chevron-up" />
              <div class="GPL__side-btn__label">Cervical</div>
            </q-btn>

            <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="fa-solid fa-chevron-down" />
              <div class="GPL__side-btn__label">Lumbar</div> -->
              <!-- <q-badge floating color="red" text-color="white" style="top: 8px; right: 16px">
                1
              </q-badge> -->
            <!-- </q-btn> -->

            <!-- <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
              <q-icon size="22px" name="fa-solid fa-columns" />
              <div class="GPL__side-btn__label">Fosas</div>
            </q-btn> -->

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
  import { ref, onMounted } from 'vue'
  import { auth, provider, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, db, refDB, set, child, get, update, onValue, off, remove } from "boot/firebase";
  import { useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'

  export default {
    name: 'Scans',
    setup () {
      const infoPatienteSelecte = ref({
        name: '',
        email: '',
        dateOfBirth: ''
      })
      const $q = useQuasar()
      const localStorageUserUID = $q.localStorage.getItem('userUID')
      const patientIdURL = ref(null)
      const router = useRouter()
      patientIdURL.value = router.currentRoute.value.params.patientId

      const getPatieInfo = () => {
        get(child(refDB(db), `users/${localStorageUserUID}/patients/${patientIdURL.value}/info`)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log('snap => ', snapshot.val());
            infoPatienteSelecte.value = snapshot.val()
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
      }
      onMounted(() => {
        // obtenerPatientId()
        getPatieInfo()
      })
      return {
        infoPatienteSelecte
      }

    }
  }
  </script>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 35%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368

    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
