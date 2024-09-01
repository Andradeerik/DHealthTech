<template>
    <q-card class="my-card" style="border-radius: 20px;">
        <q-card-section>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn1.iconfinder.com/data/icons/medical-health-care-thick-colored-version/33/male_patient-512.png">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{infoPatienteSelecte.value.info.name}}</q-item-label>
              <q-item-label caption>{{infoPatienteSelecte.value.info.email}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Fecha de nacimiento</q-item-label>
                <q-item-label caption>
                  {{infoPatienteSelecte.value.info.dateOfBirth}}
                </q-item-label>
              </q-item-section>
            </q-item>

            <!-- <q-item>
              <q-item-section>
                <q-item-label>Password</q-item-label>
                <q-item-label caption>
                  Require password for purchase or use
                  password to restrict purchase
                </q-item-label>
              </q-item-section>
            </q-item> -->
            <q-item >
              <q-item-section>
                <q-btn push color="primary" label="Escaneos" :to="`/scans/${infoPatienteSelecte.value.key}/total`"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="positive" round icon="edit" />
          <q-btn flat color="negative" round icon="delete" @click="deleteUser()" />
        </q-card-actions>
      </q-card>
</template>
<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'UserCerd',
  props: {
    infoPatienteSelecte: Object
  },
  setup(props, { emit }) {
    const $q = useQuasar()
    const data = props.infoPatienteSelecte.value.key

    return {
      deleteUser () {
        $q.dialog({
          title: 'Confirmación de Eliminación',
          message: '¿Estás seguro de que deseas eliminar a este paciente? Esta acción no se puede deshacer y todos los datos relacionados con el paciente se perderán de forma permanente.',
          ok: {
            push: true,
            color: 'negative'
          },
          cancel: {
            push: true,
          },
          style: 'border-radius: 20px; background-color: #ffffcc;',
          persistent: true
        }).onOk(() => {
          console.log('props dentro del hijo', props.infoPatienteSelecte.value.key)

          emit("deleteUser", data);
        })
      },
    }
  }
}
</script>
