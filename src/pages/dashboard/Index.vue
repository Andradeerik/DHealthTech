<template>
  <q-page>
    <q-card class="q-mb-md">
            <q-card-section class="row items-center">
              <div class="q-ml-md text-h6">
                Pacientes Registrados
              </div>
              <div class="q-mr-md">
                <q-badge color="primary">2</q-badge>
              </div>
            </q-card-section>
          </q-card>
          <q-card class="q-mb-md">
            <q-card-section class="row items-center justify-between">
              <div class="text-h6 text-weight-medium">
                Estado del Escáner
              </div>
              <div class="q-mr-md">
                <q-badge  text-color="white">estadoEscáner</q-badge>
              </div>
              <q-btn  icon="settings" flat round dense />
            </q-card-section>
          </q-card>

          <q-card class="q-mb-md">
  <q-card-section class="row items-center justify-between">
    <div class="text-h6 text-weight-medium">
      Estado de la Cuenta
    </div>
    <div class="q-mr-md">
      <q-badge  text-color="white">estadoCuenta</q-badge>
    </div>
    <q-btn icon="account_circle" flat round dense />
  </q-card-section>
</q-card>
  </q-page>
</template>

<script>
export default {
  // ...
  methods: {
    myTweak (offset) {
      // "offset" is a Number (pixels) that refers to the total
      // height of header + footer that occupies on screen,
      // based on the QLayout "view" prop configuration

      // this is actually what the default style-fn does in Quasar
      // return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
    }
  }
}
</script>
