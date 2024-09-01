<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          DHealthTech
        </q-toolbar-title>
        <div>
          <q-btn
            no-caps
            rounded
            outline
            class="btn-fixed-width full-width q-ma-sm"
            @click="redirectToDashboardOrLogin()"
          >
          <q-tooltip v-if="userInfo.photoURL" >
            Cuenta
            <br />
            {{ userInfo.displayName }}
            <br />
            {{ userInfo.email }}
          </q-tooltip>
          <div v-if="userInfo.photoURL">Mi cuenta</div>
          <div v-else> Iniciar sesión </div>
            <q-avatar size="22px" class="q-ml-sm">
              <img v-if="userInfo.photoURL" :src="userInfo.photoURL"/>
              <img v-else src="https://www.gstatic.com/images/branding/product/1x/googleg_96dp.png" />
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { auth, provider, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, db, refDB, set, child, get } from "boot/firebase";
import { useStore } from 'stores/store'


export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup () {
    const store = useStore()
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()
    let userInfo = ref({})

    onAuthStateChanged(auth, (user) => {
      if (user) {
        userInfo.value = user
      } else {
      }
    });

    function redirectToDashboardOrLogin() {
      if (userInfo.value.photoURL) {
        // this.$router.push("dashboard");
        this.$router.push('/dashboard/patients')
      }else{
        this.loginGoogle()
      }
    }

    function loginGoogle(params) {
      signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result)
        // this.$router.push("dashboard");
        this.$router.push('/dashboard/patients')
        setUserDB(result.user)
      }).catch((error) => {
        console.log('error => ', error)
      });
    }

    function setUserDB(params) {
      console.log('setUserDB params => ', params)
      const userId = params.uid
      store.userUID = userId
      $q.localStorage.set('userUID', userId)
      const dbRef = refDB(db);
      const { displayName, email } = params
      get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
        } else {
          console.log("No data available");
          set(refDB(db, `users/${userId}/info`), {
            username: displayName,
            email: email
          });
        }
      }).catch((error) => {
        console.error(error);
      });

    }

    return {
      userInfo,
      leftDrawerOpen,
      loginGoogle,
      redirectToDashboardOrLogin,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
