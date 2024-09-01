<template>
  <q-card>
    <q-bar>
      <q-space />

      <q-btn dense flat icon="close" v-close-popup>
        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
      </q-btn>

      </q-bar>

        <q-card-section>
          <div class="text-h6">Agregar Paciente</div>
        </q-card-section>

        <q-card-section >
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">

            <q-input
              v-model="name"
              rounded
              standout="bg-primary text-white"
              label="Nombre completo del paciente *"
              hint="Nombre y apellidos"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Por favor, ingrese su nombre']"
            />

            <q-input
              v-model="dateOfBirth"
              rounded
              standout="bg-primary text-white"
              label="Fecha de nacimiento del paciente *"
              hint="Año/Mes/Dia"
              mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date style="border-radius: 20px;" v-model="dateOfBirth"  @update:model-value="() => $refs.qDateProxy.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              v-model="email"
              rounded
              standout="bg-primary text-white"
              label="Correo electrónico del paciente *"
              hint="Email"
              type="email"
            />
            <div>
              <q-btn label="Guardar" type="submit" color="primary" push />
              <q-btn label="Limpiar Formulario" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
</template>
<script>
import { ref } from 'vue'

export default {
  name: 'UserForm',

  setup (props, { emit }) {
    const name = ref(null)
    const dateOfBirth = ref(null)
    const email = ref(null)

    return {
      name,
      dateOfBirth,
      email,
      onSubmit () {
        const dataUser = {
          name: name.value,
          dateOfBirth: dateOfBirth.value,
          email: email.value
        }
        emit("save", dataUser);
      },
      onReset () {
        name.value = ""
        dateOfBirth.value = ""
        email.value = ""
      }
    }
  }
}
</script>
