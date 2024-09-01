<template>
  <q-card class="q-ma-sm hcard">
    <div class="row">
      <div class="col-6">
        <q-img
          style="height: 140px; border-radius: 20px 0px"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT0sBFtdTd5b0ExW-GVCKQSsOs684SfTn-L3OIChZ-ROm1Td0gP"
        >
          <div class="text-subtitle2 absolute-top text-center">
            <q-btn
              push
              size="13px"
              color="primary"
              no-caps
              label="Pre"
              :disable="!item.pre || item.pre === 'delet'"
              :to="`/view-scans/${index}/${patientIdURL}/total/pre`"
            >
              <q-tooltip>full Pre</q-tooltip>
            </q-btn>
          </div>
        </q-img>
      </div>
      <div class="col-6">
        <q-img
          style="height: 140px; border-radius: 0px 20px"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT0sBFtdTd5b0ExW-GVCKQSsOs684SfTn-L3OIChZ-ROm1Td0gP"
        >
          <div class="text-subtitle2 absolute-top text-center">
            <q-btn
              push
              size="13px"
              color="primary"
              no-caps
              label="Post"
              :disable="!item.post || item.post === 'delet'"
              :to="`/view-scans/${index}/${patientIdURL}/total/post`"
            >
              <q-tooltip>full Post</q-tooltip>
            </q-btn>
          </div>
        </q-img>
      </div>
    </div>
    <q-btn
      class="full"
      push
      round
      size="20px"
      color="white"
      text-color="primary"
      :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
      :disable="!item.pre || !item.post"
      :to="`/view-scans/${index}/${patientIdURL}/total/compare`"
    >
      <q-tooltip
        content-class="bg-purple"
        content-style="font-size: 16px"
        :offset="[10, 10]"
      >compare</q-tooltip>
    </q-btn>
    <q-fab
      class="posii"
      color="secondary"
      push
      icon="fas fa-plus"
      direction="right"
      padding="9px"
    >
      <q-fab-action
        color="positive"
        icon="edit"
        :to="`/edit-scans/${index}/${patientIdURL}/total/pre`"
      />
      <q-fab-action
        color="negative"
        icon="delete_sweep"
        :disable="!item.pre || item.pre === 'delet'"
        @click="deleteScan(item, index, 'pre')"
      />
    </q-fab>
    <q-fab
      class="posii2"
      color="secondary"
      icon="fas fa-plus"
      direction="left"
      padding="9px"
    >
      <q-fab-action
        color="positive"
        icon="edit"
        :to="`/edit-scans/${index}/${patientIdURL}/total/post`"
      />
      <q-fab-action
        color="negative"
        icon="delete_sweep"
        :disable="!item.post || item.post === 'delet'"
        @click="deleteScan(item, index, 'post')"
      />
    </q-fab>
    <div class="row items-start text-center positfech">
      <div class="col">
        <q-card-section v-if="!item.pre || item.pre === 'delet'">
          <!-- <q-card-section> -->
          <div class="text-h6">
            fecha
            <br />--/--/----
          </div>
          <div class="text-subtitle2">
            hora:
            <br />--:-- -.-.
          </div>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-h6">
            fecha:
            <br />
            {{ formatDateForDisplay(item.pre.timeUnix) }}
          </div>
          <div class="text-subtitle2">
            hora:
            <br />
            {{ formatTimeForDisplay(item.pre.timeUnix) }}
          </div>
        </q-card-section>
      </div>
      <q-separator vertical inset />
      <div class="col">
        <q-card-section v-if="!item.post || item.post === 'delet'">
          <!-- <q-card-section> -->
          <div class="text-h6">
            fecha:
            <br />--/--/----
          </div>
          <div class="text-subtitle2">
            hora:
            <br />--:-- -.-.
          </div>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-h6">
            fecha:
            <br />
            {{ formatDateForDisplay(item.post.timeUnix) }}
          </div>
          <div class="text-subtitle2">
            hora:
            <br />
            {{ formatTimeForDisplay(item.post.timeUnix) }}
          </div>
        </q-card-section>
      </div>
    </div>
    <q-btn
      class="delet"
      push
      round
      dense
      color="negative"
      icon="delete_forever"
      @click="deleteScan(item, index, 'all')"
    >
      <q-tooltip
        anchor="top middle"
        self="bottom middle"
        content-class="bg-negative"
        content-style="font-size: 16px"
        :offset="[10, 10]"
      >Delet all</q-tooltip>
    </q-btn>
  </q-card>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, reactive, computed  } from 'vue'
import { date } from 'quasar'
import { useQuasar } from 'quasar'
export default {
  name: 'ScanInfoCard',
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: String,
      required: true
    },
    patientIdURL: {
      type: String,
      required: true
    },
  },
  setup(props, { emit }) {
    const $q = useQuasar()
    const fullscreen = ref(false)

    const formatDateForDisplay = (item) => {
      return date.formatDate(item, "DD/MM/YYYY");
    }
    const formatTimeForDisplay = (item) => {
      return date.formatDate(item, "hh:mm aa");
    }

    const deleteScan = (item, index, type) => {
      console.log(item)
      console.log(index)
      console.log(type)
      $q.dialog({
          title: 'Confirmación de Eliminación',
          message: '¿Estás seguro de que deseas eliminar este Escaneo? Esta acción no se puede deshacer y todos los datos relacionados con el Escaneo se perderán de forma permanente.',
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
          const data = {
            item,
            index,
            type
          }
          emit("deleteScan", data);

        })
    }
    console.log(props.item)
    console.log(props.index)
    return {
      fullscreen,
      formatDateForDisplay,
      formatTimeForDisplay,
      deleteScan
    }
  }

}
</script>

<style scoped>
.example-item {
  height: 360px;
  width: 290px;
}
.full {
  display:flex;
  margin-left: 38%;
  margin-right: 50%;
  top: -60px;
}
.posii {
  position: absolute;
  top: 130px;
  left: 8px;
}

.delet {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: -40px;
}
.delet .q-btn__content {
  display: flex;
  align-items: center;
}
.posii2 {
  position: absolute;
  z-index: 0;
  top: 130px;
  right: 8px;
}
.positfech {
  position: inherit;
  top: -40px;
}
.hcard {
  border-radius: 20px;
  height: 345px;
}

</style>
