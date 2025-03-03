<template>
  <q-page>
    <template v-if="!patients">
      <h6>
        No hay pacientes registrados. Haz clic en el botón
        <q-btn
          fab
          flat
          @click="dialogUserForm = true"
          class="bg-primary shadow-3"
          style="border-radius: 16px"
        >
          <q-icon name="add" size="28px" color="white" />
        </q-btn>
        para agregar uno.
      </h6>
      <img
        style="height: 100%; max-width: 100%"
        src="/img/undraw_add_friends_re_3xte.svg"
        alt="Undraw Add Friends"
      />
    </template>

    <q-list v-else class="rounded-borders">
      <q-input
        v-model="search"
        label="Buscar paciente"
        rounded
        standout="bg-primary text-white"
        clearable
      />
      <q-item-label header>Pacientes</q-item-label>

      <template v-for="(patient, i) in filteredPatients" :key="i">
        <q-item clickable v-ripple @click="slectedPatiente(patient, i)">
          <q-item-section avatar>
            <q-avatar>
              <img
                src="https://cdn1.iconfinder.com/data/icons/medical-health-care-thick-colored-version/33/male_patient-512.png"
              />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">{{ patient.info.name }}</q-item-label>
            <q-item-label caption lines="2">
              {{ patient.info.email }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset="item" />
      </template>
    </q-list>

    <q-dialog v-model="dialogCarduser">
      <UserCard
        :infoPatienteSelecte="infoPatienteSelecte"
        @deleteUser="deleteUser"
        @editUser="editUser"
      />
    </q-dialog>
    <q-dialog v-model="dialogUserForm" persistent maximized full-height>
      <userForm
        :formEditUser="formEditUser"
        :data="infoPatienteSelecte"
        @save="saveDataUser"
        @onReset="userFormOnReset"
      />
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        push
        @click="dialogUserForm = true"
        class="bg-primary shadow-24 text-white"
        style="border-radius: 16px"
        icon="add"
      >
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { ref, onMounted, reactive, computed } from "vue";
import { useQuasar } from "quasar";
import { db, refDB, set, child, get, update } from "boot/firebase";
import UserCard from "components/UserCard.vue";
import userForm from "components/UserForm.vue";

export default {
  components: {
    UserCard,
    userForm,
  },
  setup() {
    const $q = useQuasar();
    const dialogUserForm = ref(false);
    const localStorageUserUID = $q.localStorage.getItem("userUID");
    const patientsPath = `users/${localStorageUserUID}/patients`;
    const patients = ref(null);
    const infoPatienteSelecte = reactive({});
    const dialogCarduser = ref(false);
    const formEditUser = ref(false);
    const search = ref("");

    const filteredPatients = computed(() => {
      if (!patients.value) return {};

      const searchTerm = search.value?.toLowerCase().trim();
      if (!searchTerm) return patients.value;

      return Object.fromEntries(
        Object.entries(patients.value).filter(([, patient]) =>
          patient.info?.name?.toLowerCase().includes(searchTerm)
        )
      );
    });

    const saveDataUser = (info) => {
      if (formEditUser.value) {
        update(refDB(db, `${patientsPath}/${infoPatienteSelecte.value.key}`), {
          info,
        });
        getuserDB();
        formEditUser.value = false;
        infoPatienteSelecte.value = {};
        dialogUserForm.value = false;
        return;
      }
      update(refDB(db, `${patientsPath}/${Date.now()}`), { info });
      getuserDB();
      dialogUserForm.value = false;
    };

    const deleteUser = (info) => {
      set(refDB(db, `${patientsPath}/${info}`), null);
      getuserDB();
      dialogCarduser.value = false;
    };

    const getuserDB = () => {
      const dbRef = refDB(db);
      get(child(dbRef, `${patientsPath}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            patients.value = snapshot.val();
          } else {
            patients.value = null;
          }
        })
        .catch((error) => {
          console.error(error);
          patients.value = null;
        });
    };

    const slectedPatiente = (item, key) => {
      console.log("slectedPatiente", item, key);
      infoPatienteSelecte.value = { info: item.info, key };
      dialogCarduser.value = true;
    };

    onMounted(getuserDB);

    function editUser(info) {
      formEditUser.value = true;
      dialogUserForm.value = true;
    }

    function userFormOnReset() {
      formEditUser.value = false;
      infoPatienteSelecte.value = {};
    }

    return {
      userFormOnReset,
      formEditUser,
      editUser,
      patients,
      dialogUserForm,
      dialogCarduser,
      infoPatienteSelecte,
      saveDataUser,
      slectedPatiente,
      deleteUser,
      search,
      filteredPatients,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
