<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <!-- <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        /> -->

        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">
          <!-- <img src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg"> -->
          <span class="q-ml-sm">DHealthTech</span>
        </q-toolbar-title>

        <q-space />

        <!-- <q-input class="GPL__toolbar-input" dense standout="bg-primary" v-model="search" placeholder="Search">
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input> -->

        <!-- <q-btn v-if="$q.screen.gt.xs" flat dense no-wrap color="primary" icon="add" no-caps label="Create" class="q-ml-sm q-px-md">
          <q-menu anchor="top end" self="top end">
            <q-list class="text-grey-8" style="min-width: 100px">
              <q-item aria-hidden="true">
                <q-item-section class="text-uppercase text-grey-7" style="font-size: 0.7rem">Create New</q-item-section>
              </q-item>
              <q-item v-for="menu in createMenu" :key="menu.text" clickable v-close-popup aria-hidden="true">
                <q-item-section avatar>
                  <q-icon :name="menu.icon" />
                </q-item-section>
                <q-item-section>{{ menu.text }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn> -->

        <!-- <q-btn v-if="$q.screen.gt.xs" flat dense no-wrap color="primary" icon="cloud_upload" no-caps label="Upload" class="q-ml-sm q-px-md" /> -->

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <q-btn round dense flat color="text-grey-7" icon="apps">
            <q-tooltip>Google Apps</q-tooltip>
          </q-btn> -->
          <!-- <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn> -->

          <q-btn round push dense class="q-ma-sm" @click="showing = !showing">
          <q-avatar size="35px">
            <img v-if="userInfo.photoURL" :src="userInfo.photoURL"/>
          </q-avatar>
          <q-tooltip v-if="!showing">
            Cuenta
            <br />
            {{userInfo.displayName}}
            <br />
            {{userInfo.email}}
          </q-tooltip>
          <q-menu style="border-radius: 20px;">
            <div class="row no-wrap q-pa-md">
              <!-- <div class="column">
                <div class="text-h6 text-center">settings</div>
                <div class="text-h7 text-center">Info</div>
                <div class="text-center">Rol: </div>
              </div>
              <q-separator vertical inset class="q-mx-lg" /> -->
              <div class="column items-center">
                <q-avatar size="72px">
                  <img v-if="userInfo.photoURL" :src="userInfo.photoURL"/>
                </q-avatar>
                <div class="q-my-xs text-center">{{userInfo.displayName}}</div>
                <div class="text-caption q-my-xs text-center">
                  {{userInfo.email}}
                </div>
                <q-btn
                  class="q-my-md"
                  color="primary"
                  label="Cerrar sesión"
                  push
                  size="sm"
                  @click="logout()"
                  v-close-popup
                  to="/"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer v-if="!$q.screen.gt.sm" reveal elevated bordered class="bg-white text-primary">
        <q-tabs no-caps active-color="primary" indicator-color="transparent" class="text-grey-8">
          <!-- <q-route-tab
            icon="home"
            to="/dashboard"
            exact
          /> -->
          <q-route-tab
            icon="contact_mail"
            to="/dashboard/patients"
            exact
          />
          <!-- <q-route-tab
            icon="widgets"
            to="/dashboard/albums"
            exact
          /> -->
        </q-tabs>
      </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center text-grey-8">
            <!-- <img class="q-pl-md" src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"> -->
            <span class="q-ml-sm">DHealthTech</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <q-item v-for="link in links1" :key="link.text" clickable class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item v-for="link in links2" :key="link.text" clickable class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item v-for="link in links3" :key="link.text" clickable class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item clickable class="GPL__drawer-item GPL__drawer-item--storage">
            <q-item-section avatar>
              <q-icon name="cloud" />
            </q-item-section>
            <q-item-section top>
              <q-item-label>Storage</q-item-label>
              <q-linear-progress :value="storage" class="q-my-sm" />
              <q-item-label caption>2.6 GB of 15 GB</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="GPL__page-container">

      <q-page class="q-pa-md">

      <!-- <div>
    <q-btn label="Conectar" @click="connectToDevice" />
    <q-input v-model="messageToSend" label="Mensaje a enviar" />
    <q-btn label="Enviar" @click="sendMessage" />
    <div v-if="deviceConnected">
      Mensaje recibido: {{ receivedMessage }}
    </div>
  </div> -->
        <router-view />
      </q-page>


      <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
        <div class="fit q-pt-xl q-px-sm column">
          <q-btn exact to="/dashboard/patients" round flat color="primary" stack no-caps size="26px" class="GPL__side-btn">
            <q-icon size="22px" name="contact_mail" />
            <div class="GPL__side-btn__label">Pasientes</div>
          </q-btn>

          <!-- <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn">
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
          </q-btn> -->
        </div>
      </q-page-sticky>

    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { auth, signOut, onAuthStateChanged } from "boot/firebase";

export default {
  name: 'Dashboards',
  setup () {
    let userInfo = ref({})
    const leftDrawerOpen = ref(false)
    const search = ref('')
    const storage = ref(0.26)
    const showing = ref(false)

    const deviceConnected = ref(false);
    const messageToSend = ref('');
    const receivedMessage = ref('');
    let characteristic;


    onAuthStateChanged(auth, (user) => {
      if (user) {
        userInfo.value = user
      } else {
      }
    });

    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    function logout() {
      signOut(auth).then(() => {
        this.$router.go(-1)
      }).catch((error) => {
        console.log('An error happened. => ', error)
      });
    }

    async function connectToDevice() {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }] // Asegúrate de que el UUID esté en minúsculas y en el formato correcto
        });
        // Conectar al dispositivo y manejar la conexión
      } catch (error) {
        console.error('Error al conectar:', error);
      }
    }

    const sendMessage = async () => {
      if (characteristic) {
        await characteristic.writeValue(new TextEncoder().encode(messageToSend.value));
      } else {
        console.error('No hay conexión con el dispositivo');
      }
    };


    return {
      deviceConnected,
      messageToSend,
      receivedMessage,
      connectToDevice,
      sendMessage,
      leftDrawerOpen,
      search,
      storage,
      showing,
      userInfo,
      links1: [
        { icon: 'photo', text: 'Photos' },
        { icon: 'photo_album', text: 'Albums' },
        { icon: 'assistant', text: 'Assistant' },
        { icon: 'people', text: 'Sharing' },
        { icon: 'book', text: 'Photo books' }
      ],
      links2: [
        { icon: 'archive', text: 'Archive' },
        { icon: 'delete', text: 'Trash' }
      ],
      links3: [
        { icon: 'settings', text: 'Settings' },
        { icon: 'help', text: 'Help & Feedback' },
        { icon: 'get_app', text: 'App Downloads' }
      ],
      createMenu: [
        { icon: 'photo_album', text: 'Album' },
        { icon: 'people', text: 'Shared Album' },
        { icon: 'movie', text: 'Movie' },
        { icon: 'library_books', text: 'Animation' },
        { icon: 'dashboard', text: 'Collage' },
        { icon: 'book', text: 'Photo book' }
      ],
      logout,
      toggleLeftDrawer
    }

  }
}
</script>

<style>
.custome {
  display: flex;
      align-items: center;
      width: 100%;
      max-width: 500px;
      border: 1px solid #444;
      border-radius: 12px;
      background-color: #2e2e3e;
      padding: 0.5rem;
}
</style>

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
