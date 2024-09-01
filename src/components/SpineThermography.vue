<template>
  <model-viewer
    style="width: 100%; height: 100vh"
    src="/src/assets/ColumnaVertebral.glb"
    camera-orbit="89.41deg 61.95deg 10m"
    camera-controls
  >
  <q-item >
    <q-item-section v-if="btn" side>
      <q-btn rounded push color="primary" label="Guardar" @click="saveScan()" />
    </q-item-section>
    <!-- <q-item-section >
      <q-item-section>
        <q-item-label>Dato Guardado</q-item-label>
        <q-item-label caption>pre-04/08/2024 11:08 p.m.</q-item-label>
      </q-item-section>
    </q-item-section> -->
      <q-item-section>
        <q-item-label>Dimension vertebral</q-item-label>
        <q-item-label caption>{{ (mm/10).toFixed() }} cm</q-item-label>
      </q-item-section>
    </q-item>
    <!-- eslint-disable vue/no-deprecated-slot-attribute -->
    <div
      v-for="(hotspot, index) in mergeDataResult"
      :slot="hotspot.slot"
      :data-position="hotspot.position"
      :data-normal="hotspot.normal"
      data-visibility-attribute="visible"
      class="hotspot"
      :style="getTransformStyle(hotspot)"
      :key="index"
    >
      <progress
        class="custom-progress"
        max="100"
        :value="getValue(hotspot)"
        :style="getProgressStyle(hotspot)"
      ></progress>
      <div class="progress-text">
        {{ hotspot.name }}
      </div>
      <q-tooltip>
        <div class="text-center">
          <p>{{ hotspot.name }}</p>
          <p>{{ hotspot.side }}</p>
          <p>{{ hotspot.desfLft }}</p>
          <p>{{ hotspot.desfRig }}</p>
          <p>{{ hotspot.leftTemp }}</p>
          <p>{{ hotspot.rightTemp }}</p>
        </div>
      </q-tooltip>
    </div>


  </model-viewer>
</template>

<script>
export default {
  name: 'SpineThermography',
  props: ['btn', 'mm', 'data'],
  emits: ['saveScan'],
  setup(props, { emit }) {

    console.log(props.data);

    const hotspots = [
      {
        slot: "hotspot-0",
        position:
          "0.017939598618758268m 1.2161244663795732m 0.05835591620737818m",
        normal: "0.422649554615166m 0.1957150178240743m 0.8849084618093129m",
        name: "C1",
        side: "L",
      },
      {
        slot: "hotspot-1",
        position:
          "0.018076015355966923m 1.2214933999886808m -0.05734101967567033m",
        normal: "0.3892995163140531m 0.4476906525381853m -0.8049962523065421m",
        name: "C1",
        side: "R",
      },
      {
        slot: "hotspot-2",
        position:
          "0.02903291903151617m 1.1745955181421397m 0.06047104060194056m",
        normal: "0.438778070551184m 0.021007485635943242m 0.8983498707912391m",
        name: "C2",
        side: "L",
      },
      {
        slot: "hotspot-3",
        position:
          "0.029790755814189218m 1.175709777028217m -0.06000738347576798m",
        normal:
          "0.38834729493243086m 0.000510221016618627m -0.9215129506377965m",
        name: "C2",
        side: "R",
      },
      {
        slot: "hotspot-4",
        position: "0.02849295846898281m 1.128306324301948m 0.0635464623774846m",
        normal:
          "0.35607874098759124m -0.26443345370866717m 0.8962604971638537m",
        name: "C3",
        side: "L",
      },
      {
        slot: "hotspot-5",
        position:
          "0.030039043280778444m 1.129747858478862m -0.06229783622462334m",
        normal:
          "0.48114395385210545m -0.14544608907256568m -0.8644917182050146m",
        name: "C3",
        side: "R",
      },
      {
        slot: "hotspot-6",
        position:
          "0.025527293239356652m 1.0813243210051262m 0.0662558865557768m",
        normal: "0.32786526935919674m -0.3328720849051284m 0.8841383037958115m",
        name: "C4",
        side: "L",
      },
      {
        slot: "hotspot-7",
        position:
          "0.02895622397374531m 1.083957552025727m -0.06506964356268063m",
        normal: "0.511800565139498m -0.17949289091266551m -0.8401443230985403m",
        name: "C4",
        side: "R",
      },
      {
        slot: "hotspot-8",
        position:
          "0.033752018476486345m 1.0325129688265209m 0.0663108335321268m",
        normal: "0.6476008054720651m 0.23598581722938575m 0.7245163150809728m",
        name: "C5",
        side: "L",
      },
      {
        slot: "hotspot-9",
        position:
          "0.034737685107763205m 1.0336233183100096m -0.06536719990030065m",
        normal: "0.599364489153494m 0.24079753607782847m -0.7633994732514676m",
        name: "C5",
        side: "R",
      },
      {
        slot: "hotspot-10",
        position:
          "0.033425335756517516m 0.982181676194572m 0.0679250967590144m",
        normal: "0.4215071071912245m 0.24665702047797136m 0.872635131561992m",
        name: "C6",
        side: "L",
      },
      {
        slot: "hotspot-11",
        position:
          "0.033159123179074435m 0.9876169258397494m -0.06767573783630382m",
        normal: "0.6237386690183835m 0.21253155455423806m -0.7521837615170476m",
        name: "C6",
        side: "R",
      },
      {
        slot: "hotspot-12",
        position:
          "0.04059376123009484m 0.9273631599570367m 0.06703695643862495m",
        normal: "0.4000678965125267m -0.16276875111646447m 0.9019157454219482m",
        name: "C7",
        side: "L",
      },
      {
        slot: "hotspot-13",
        position:
          "0.04278027815776131m 0.9307624105430683m -0.06612100317012146m",
        normal:
          "0.33015771468015376m 0.11497773755364771m -0.9368970078424964m",
        name: "C7",
        side: "R",
      },
      {
        slot: "hotspot-14",
        position:
          "0.07196486246710876m 0.8896037305924205m 0.08060483902207197m",
        normal: "0.9086243024218427m 0.2321853092703796m 0.34711937313759667m",
        name: "T1",
        side: "L",
      },
      {
        slot: "hotspot-15",
        position:
          "0.07267322073406257m 0.8876374241325987m -0.07863550527520105m",
        normal:
          "0.9508626436866436m -0.2086730382877456m -0.22872646530956606m",
        name: "T1",
        side: "R",
      },
      {
        slot: "hotspot-16",
        position:
          "0.10648057176049708m 0.8220897496794912m 0.08509461760171966m",
        normal: "0.9026828455184838m 0.3743219275608455m -0.21224225534465704m",
        name: "T2",
        side: "L",
      },
      {
        slot: "hotspot-17",
        position:
          "0.10735015095828881m 0.8191811881647679m -0.08528672286702746m",
        normal: "0.9277904272425994m 0.3513918807307451m 0.12541399153804442m",
        name: "T2",
        side: "R",
      },
      {
        slot: "hotspot-18",
        position:
          "0.15367771204523883m 0.7559382912468804m 0.09326632736979115m",
        normal: "0.8783157312317262m 0.26504620409303814m 0.3978843876891247m",
        name: "T3",
        side: "L",
      },
      {
        slot: "hotspot-19",
        position:
          "0.15321540821323865m 0.7560104339572882m -0.09193099930316881m",
        normal: "0.9357931069222252m 0.3498898418204392m -0.04322452576624564m",
        name: "T3",
        side: "R",
      },
      {
        slot: "hotspot-20",
        position:
          "0.18757856826159802m 0.646282934365268m 0.09372296714775277m",
        normal: "0.9594242996653807m 0.2743474682075874m 0.06510360896049357m",
        name: "T4",
        side: "L",
      },
      {
        slot: "hotspot-21",
        position:
          "0.1882514415730676m 0.6452112643841509m -0.09053216057669514m",
        normal:
          "0.9877010592891233m 0.13752821441676616m -0.07438150118463466m",
        name: "T4",
        side: "R",
      },
      {
        slot: "hotspot-22",
        position:
          "0.22258438654727986m 0.5426177155422489m 0.10032872352215624m",
        normal: "0.9754472265993491m 0.18499763843668995m 0.11949302026681637m",
        name: "T5",
        side: "L",
      },
      {
        slot: "hotspot-23",
        position:
          "0.22286443904731845m 0.5422034361051151m -0.09898422184721781m",
        normal:
          "0.9766610873473951m 0.18932838157215529m -0.10142920877475403m",
        name: "T5",
        side: "R",
      },
      {
        slot: "hotspot-24",
        position: "0.2418716157923404m 0.434808799814619m 0.10289702407204973m",
        normal: "0.9193470952036069m 0.2281756910110667m 0.3205257752074122m",
        name: "T6",
        side: "L",
      },
      {
        slot: "hotspot-25",
        position:
          "0.2394153644545325m 0.4336094947463529m -0.10126570451489444m",
        normal:
          "0.9705831482439792m 0.23689619830521716m 0.042994692385704955m",
        name: "T6",
        side: "R",
      },
      {
        slot: "hotspot-26",
        position:
          "0.2441195951568611m 0.31946417455132115m 0.10400613013359924m",
        normal:
          "0.9425945488159029m -0.06908527562994846m 0.32671507653256326m",
        name: "T7",
        side: "L",
      },
      {
        slot: "hotspot-27",
        position:
          "0.24398488018971243m 0.318349075702417m -0.10529571324469753m",
        normal:
          "0.9891982006163853m -0.046912090841356995m -0.1388746759859341m",
        name: "T7",
        side: "R",
      },
      {
        slot: "hotspot-28",
        position:
          "0.2254216852638371m 0.2171972698159439m 0.10982867999480042m",
        normal:
          "0.9649973405612182m 0.20058745877090217m -0.16895207632227588m",
        name: "T8",
        side: "L",
      },
      {
        slot: "hotspot-29",
        position:
          "0.22577952462295636m 0.21665745143378176m -0.11008407935509071m",
        normal: "0.9764166863226571m 0.2058650278792972m 0.06503879586014978m",
        name: "T8",
        side: "R",
      },
      {
        slot: "hotspot-30",
        position:
          "0.1906984808142198m 0.1272133839625516m 0.11928449302930474m",
        normal:
          "0.9859174725252321m -0.13642376700185027m -0.09672276446878071m",
        name: "T9",
        side: "L",
      },
      {
        slot: "hotspot-31",
        position:
          "0.19171682149153835m 0.12653711950276067m -0.12157902494939046m",
        normal:
          "0.9877882630070429m -0.14544016562625073m -0.05587043662025611m",
        name: "T9",
        side: "R",
      },
      {
        slot: "hotspot-32",
        position:
          "0.1588689139947581m 0.03068530299398703m 0.12536242443442894m",
        normal:
          "0.9367963160224639m -0.06854789986284143m -0.3430945171685695m",
        name: "T10",
        side: "L",
      },
      {
        slot: "hotspot-33",
        position:
          "0.1605222927056884m 0.026983828655904124m -0.13072237385216165m",
        normal:
          "0.8926229882259549m -0.42986100938561245m -0.13580763417624642m",
        name: "T10",
        side: "R",
      },
      {
        slot: "hotspot-34",
        position:
          "0.12333234319403319m -0.07481918774747351m 0.1277637789682011m",
        normal: "0.8430027353722594m 0.2348918051340968m -0.48391345097623983m",
        name: "T11",
        side: "L",
      },
      {
        slot: "hotspot-35",
        position:
          "0.12471781283186623m -0.07629733070959491m -0.13017307782871534m",
        normal: "0.9966793388932882m 0.07997486515534868m 0.01530739581450077m",
        name: "T11",
        side: "R",
      },
      {
        slot: "hotspot-36",
        position:
          "0.115240153648132m -0.18041956426489852m 0.1327402437651113m",
        normal: "0.8967382830185137m 0.238610388037392m -0.3727271582399828m",
        name: "T12",
        side: "L",
      },
      {
        slot: "hotspot-37",
        position:
          "0.1160030494543638m -0.18301343143440407m -0.13436601657295272m",
        normal: "0.923288631114487m 0.12568005871312174m 0.36296367104243804m",
        name: "T12",
        side: "R",
      },
      {
        slot: "hotspot-38",
        position:
          "0.06180885361207844m -0.268039938664028m 0.12849846530952946m",
        normal: "0.9129325345171662m 0.10725209579049336m -0.3937653811200397m",
        name: "L1",
        side: "L",
      },
      {
        slot: "hotspot-39",
        position:
          "0.06180965250358961m -0.2636286183174691m -0.1310447293399421m",
        normal: "0.928864439581018m 0.325108950561359m 0.1775247113692439m",
        name: "L1",
        side: "R",
      },
      {
        slot: "hotspot-40",
        position:
          "0.046854806017047945m -0.36388842363476287m 0.1253685806654266m",
        normal:
          "0.9126778075270544m 0.40692428030705496m -0.037839790488249814m",
        name: "L2",
        side: "L",
      },
      {
        slot: "hotspot-41",
        position:
          "0.046674288273989006m -0.36489298667251896m -0.125114264829215m",
        normal: "0.9849961005767857m 0.03108110602805078m -0.1697546661997839m",
        name: "L2",
        side: "R",
      },
      {
        slot: "hotspot-42",
        position:
          "0.040807390012634226m -0.46473380076483184m 0.13023111053940634m",
        normal:
          "0.9763143333424231m 0.08560471623373611m -0.19870117027506803m",
        name: "L3",
        side: "L",
      },
      {
        slot: "hotspot-43",
        position:
          "0.040309673475348085m -0.46292846259433473m -0.12833724008809994m",
        normal: "0.7888867847059646m 0.27010179106464294m 0.5519987892921115m",
        name: "L3",
        side: "R",
      },
      {
        slot: "hotspot-44",
        position:
          "0.05883317799342924m -0.5565913324027791m 0.12926492635755643m",
        normal:
          "0.8906942326734199m 0.18954719076498924m -0.41320170178184007m",
        name: "L4",
        side: "L",
      },
      {
        slot: "hotspot-45",
        position:
          "0.06012072639542643m -0.5541928429087517m -0.1304149272956059m",
        normal: "0.7250575095514562m 0.43005574550962555m 0.5379067424723363m",
        name: "L4",
        side: "R",
      },
      {
        slot: "hotspot-46",
        position:
          "0.09914042854630623m -0.6339416973590631m 0.13532616836576378m",
        normal: "0.7735815250918543m 0.383563092148448m -0.5044313415897964m",
        name: "L5",
        side: "L",
      },
      {
        slot: "hotspot-47",
        position:
          "0.09961294910147211m -0.6325557050588156m -0.13686348603998716m",
        normal: "0.8800783860456727m 0.3432798680459444m 0.328056346699165m",
        name: "L5",
        side: "R",
      },
    ];

    function mergeData(dataForGraph, hotspots) {
      const data3D = [];
      for (let i = 0; i < dataForGraph.length; i++) {
        const vertebra = dataForGraph[i];
        const leftHotspotIndex = i * 2;
        const rightHotspotIndex = leftHotspotIndex + 1;

        const leftHotspot = {
          ...hotspots[leftHotspotIndex],
          desfLft: vertebra.desfLft,
          leftTemp: vertebra.leftTemp,
        };

        const rightHotspot = {
          ...hotspots[rightHotspotIndex],
          desfRig: vertebra.desfRig,
          rightTemp: vertebra.rightTemp,
        };

        data3D.push(leftHotspot, rightHotspot);
      }
      return data3D;
    }
    const mergeDataResult = mergeData(props.data, hotspots);
    console.log('mergeDataResult');
    console.log(mergeDataResult);
    // const router = useRouter();

    function goBack() {
      // router.back();
    }

    function getProgressStyle(hotspot) {
      const progress = hotspot.side === "L" ? hotspot.desfLft : hotspot.desfRig;
      const invert = hotspot.side === "L";
      let color;
      if (progress <= 0.3) {
        color = "green";
      } else if (progress <= 0.5) {
        color = "yellow";
      } else if (progress <= 0.8) {
        color = "orange";
      } else {
        color = "red";
      }
      return {
        "--progress-color": color,
        transform: invert ? "scaleX(-1)" : "scaleX(1)",
      };
    }

    function getValue(hotspot) {
      return hotspot.side === "L"
        ? hotspot.desfLft * 100
        : hotspot.desfRig * 100;
    }

    function getTransformStyle(hotspot) {
      let transform =
        hotspot.side === "L" ? "translateX(-50px)" : "translateX(50px)";
      return { transform };
    }

    function saveScan() {
      console.log("Scan saved");
      emit('saveScan');
    }

    return {
      goBack,
      getProgressStyle,
      getValue,
      getTransformStyle,
      saveScan,
      mergeDataResult,
      btn: props.btn,
    };
  },
};
</script>

<style>
.hotspot {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.custom-progress {
  width: 70px;
  height: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  appearance: none;
}

.custom-progress::-webkit-progress-value {
  background-color: var(--progress-color);
  border-radius: 10px 0 0 10px;
}

.custom-progress::-webkit-progress-bar {
  background-color: rgba(255, 254, 254, 0.23);
  border-radius: 10px;
}

.custom-progress::-moz-progress-bar {
  background-color: var(--progress-color);
  border-radius: 10px 0 0 10px;
}
.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.29);
}
</style>
