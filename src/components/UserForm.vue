<template>
  <q-card>
    <q-bar>
      <q-space />

      <q-btn dense flat icon="close" v-close-popup @click="onReset">
        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
      </q-btn>

      </q-bar>

        <q-card-section>
          <div class="text-h6"> {{ formEditUser ? 'Editar' : 'Agregar'}} Paciente</div>
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
              mask="date"
              :rules="[
                (val) => !!val || 'Campo requerido Año/Mes/Dia', // Mensaje de error personalizado si el campo está vacío
                (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) || 'Formato de fecha inválido Año/Mes/Dia', // Mensaje de error personalizado si el formato es incorrecto
              ]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date style="border-radius: 20px;" v-model="dateOfBirth" @update:model-value="() => $refs.qDateProxy.hide()" />
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
              <q-btn label="Limpiar Formulario" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
            <div>
              <q-btn label="Guardar" type="submit" color="primary" push />
              <q-btn label="Cancelar" type="reset" color="negative" flat class="q-ml-sm" @click="onReset" v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
</template>
<script>
import { ref } from 'vue'

export default {
  name: 'UserForm',
  props: ['data', 'formEditUser'],
  setup (props, { emit }) {
    const name = ref(null)
    const dateOfBirth = ref(null)
    const email = ref(null)
    const formEditUser = props.formEditUser

    if (formEditUser) {
      name.value = props.data.value.info.name
      dateOfBirth.value = props.data.value.info.dateOfBirth
      email.value = props.data.value.info.email

    }

    return {
      formEditUser,
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
        emit("onReset");
      }
    }
  }
}
</script>
