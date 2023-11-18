<template>
  <q-page>

    <q-list class="rounded-borders">
      <q-item-label header>Pasientes</q-item-label>
      <template v-for="(patient, i) in patients" :key="i" >
        <q-item clickable v-ripple @click="slectedPatiente(patient, i)">
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn1.iconfinder.com/data/icons/medical-health-care-thick-colored-version/33/male_patient-512.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">{{ patient.info.name}}</q-item-label>
            <q-item-label caption lines="2">
              {{ patient.info.email }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset="item" />
    </template>
    </q-list>

    <q-dialog v-model="dialogCarduser" >
      <UserCard
        :infoPatienteSelecte="infoPatienteSelecte"
        @deleteUser="deleteUser"
        />
    </q-dialog>
    <q-dialog
      v-model="dialogUserForm"
      persistent
      maximized
      full-height
    >
      <userForm @save="saveDataUser"/>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" @click="dialogUserForm = true"/>
    </q-page-sticky>
  </q-page>
</template>

<script >
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { auth, provider, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, db, refDB, set, child, get, update, onValue, off, remove } from "boot/firebase";
import UserCard from 'components/UserCard.vue'
import userForm from 'components/UserForm.vue'

export default {
  components: {
    UserCard,
    userForm
  },
  setup () {
    const $q = useQuasar()
    const dialogUserForm = ref(false)
    const localStorageUserUID = $q.localStorage.getItem('userUID')
    const patientsPath = `users/${localStorageUserUID}/patients`
    const patients = ref({})
    const infoPatienteSelecte = reactive({})
    const dialogCarduser = ref(false)

    const saveDataUser = (info) => {
      update(refDB(db, `${patientsPath}/${Date.now()}`), { info });
      getuserDB()
      dialogUserForm.value = false;
    };

    const deleteUser = (info) => {
      set(refDB(db, `${patientsPath}/${info}`), null);
      getuserDB()
      dialogCarduser.value = false;
    };

    const getuserDB = () => {
      const dbRef = refDB(db);
      get(child(dbRef, `${patientsPath}`)).then((snapshot) => {
        if (snapshot.exists()) {
          patients.value = snapshot.val()
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }

    const slectedPatiente = (item , key) => {
      infoPatienteSelecte.value = {info: item.info, key}
      dialogCarduser.value = true

    }

    onMounted(getuserDB)

    return {
      patients,
      dialogUserForm,
      dialogCarduser,
      infoPatienteSelecte,
      saveDataUser,
      slectedPatiente,
      deleteUser
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>