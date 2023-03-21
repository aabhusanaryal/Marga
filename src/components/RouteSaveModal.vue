<template>
  <div class="loadingSpinner" v-if="showLoadingSpinner">
    <ion-spinner color="primary"></ion-spinner>
  </div>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">Cancel</ion-button>
      </ion-buttons>
      <ion-title>Details</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="confirm">Confirm</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-item>
      <ion-label position="floating">Enter a name for this rotue</ion-label>
      <ion-input placeholder="e.g. Naxal - Pulchowk"></ion-input>
    </ion-item>
    <br />
    <ion-chip v-for="(yatayat, idx) in yatayatList" :key="idx">
      <ion-label>{{ yatayat }}</ion-label>
      <ion-icon :icon="closeCircle" @click="removeYatayat(idx)"></ion-icon>
    </ion-chip>
    <ion-item>
      <!-- <ion-label position="floating"
        >Enter the name of vehicles that run in this route</ion-label
      > -->
       <ion-label position="floating"
          >Enter yatayats that run in this route</ion-label
        >
      <ion-input
        placeholder="e.g. Nepal Yatayat, Safa Tempo etc."
        v-model="yatayat"
        @keyup.enter="onInputYatayat"
        enterkeyhint="enter"
      ></ion-input>
    </ion-item>
    <br />
    <!-- <ion-chip v-for="(vehicleType, idx) in vehicleTypeList" :key="idx">
      <ion-label>{{ vehicleType }}</ion-label>
      <ion-icon :icon="closeCircle" @click="removeVehicleType(idx)"></ion-icon>
    </ion-chip> -->
    <ion-label position="floating"
          >Select the types of vehicles that run in this route</ion-label
        >
    <ion-item>
      <!-- <ion-label position="floating"
        >Enter the types of vehicles that run in this route</ion-label
      > -->
    <div>
      <ion-item v-for="vehicle, idx in allVehicles" :key="idx">
        <ion-checkbox slot="start" class="vehicleCheckbox" :name="vehicle"></ion-checkbox>
        <ion-label>{{vehicle}}</ion-label>
      </ion-item>

      <ion-item>
        <ion-checkbox slot="start" v-model="other"></ion-checkbox>
        <ion-label>Other</ion-label>
        <!-- <ion-input 
          placeholder="Enter the vehicle type"
          v-if="other"
          v-model="vehicle">
        </ion-input> -->
      </ion-item>

      <ion-item v-if="other">
        <ion-label position="floating">Enter the vehicle type:</ion-label>
        <ion-input
          placeholder="Enter the vehicle type"
          v-model="vehicle"
        ></ion-input>
      </ion-item>

    </div>
      <!-- <ion-input
        placeholder="e.g. Micro, Tempo, Bus, etc."
        v-model="vehicleType"
        @keyup.enter="onInputVehicleType"
        enterkeyhint="enter"
      ></ion-input> -->
    </ion-item>
    <br />
    <ion-item>
      <ion-label position="floating">Source of information</ion-label>
      <ion-input
        placeholder="e.g. Self, Yatayat Karyalaya etc."
        v-model="dataSource"
      ></ion-input>
    </ion-item>
    <br />
    <ion-item>The stops you entered are:</ion-item>
    <ion-list>
      <ion-item v-for="(stop, idx) in busStops" :key="idx">
        {{ idx + 1 }}. {{ stop.stopName }}
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  modalController,
  IonList,
  IonIcon,
  toastController,
  IonSpinner,
  IonChip,
  IonCheckbox
} from "@ionic/vue";
import { closeCircle } from "ionicons/icons";

import { ref, defineEmits } from "vue";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const props = defineProps(["busStops"]);

let showLoadingSpinner = ref(false);

const cancel = () => {
  return modalController.dismiss(null, "cancel");
  //send the user back to the add route page with the markers as it was when they enered the page
};

let name, dataSource;
let yatayatList = ref([]);
let yatayat = ref("");
let vehicleTypeList = ref([]);
let vehicleType = ref("");
const allVehicles=['Bus', 'Micro', 'Tempo', 'Minibus']
let other=ref(false)
let vehicle

const onInputYatayat = () => {
  yatayatList.value.push(yatayat.value);
  yatayat.value = "";
  console.log(yatayatList.value);
};

// const onInputVehicleType = () => {
//   vehicleTypeList.value.push(vehicleType.value);
//   vehicleType.value = "";
//   console.log(vehicleTypeList.value);
// };

const removeYatayat = (idx) => {
  if (idx == 0) yatayatList.value = yatayatList.value.splice(1);
  yatayatList.value.splice(idx, idx);
};
// const removeVehicleType = (idx) => {
//   if (idx == 0) vehicleTypeList.value = vehicleTypeList.value.splice(1);
//   vehicleTypeList.value.splice(idx, idx);
// };

const bodyData = {
  name: name || "",
  yatayat: yatayatList.value,
  vehicleTypes: vehicleTypeList.value,
  route: props.busStops.map(({ marker, ...keepAttrs }) => keepAttrs),
  geoJSON: "",
};

let message = "";
let geoJSON = "";
const confirm = async () => {
  console.log("Value of other: ",other.value)
  if(other.value){
      vehicleTypeList.value.push(vehicle);
  }
  if (yatayat.value) {
    yatayatList.value.push(yatayat.value);
    yatayat.value = "";
  }
  if (vehicleType.value) {
    vehicleTypeList.value.push(vehicleType.value);
    vehicleType.value = "";
  }

  document.querySelectorAll(".vehicleCheckbox").forEach((vehicle)=>{
    if(vehicle.checked){
      vehicleTypeList.value.push(vehicle.name);
    }
    console.log("Complete vehicle list: ",vehicleTypeList.value);
  })

  showLoadingSpinner.value = true;
  try {
    geoJSON = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          Authorization: `${process.env.VUE_APP_ORS_API}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          coordinates: props.busStops.map((stop) => [stop.lng, stop.lat]),
        }),
      }
    );
    geoJSON = await geoJSON.json();

    bodyData.geoJSON = JSON.stringify(geoJSON);
    const req = await fetch(
      "https://marga-backend.aabhusanaryal.com.np/addroute/",
      {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    message = "Route added for review!";
  } catch {
    message = "There was an error. Please try again later!";
  }
  const toast = await toastController.create({
    message: message,
    duration: 1500,
    position: "bottom",
  });

  showLoadingSpinner.value = false;
  await toast.present();
  return modalController.dismiss(geoJSON, "confirm");
};

//fetch the data about loongitude and latitue
//remove all the markers(if the langitude and latitude are stored in the local storage)
// authStore.addRouteStops=[]
</script>

<style scoped>
.loadingSpinner {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
}

</style>
