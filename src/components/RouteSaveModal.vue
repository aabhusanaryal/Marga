<template>
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
      <ion-label position="floating"
        >Enter the name of vehicles that run in this route</ion-label
      >
      <ion-input
        placeholder="e.g. Nepal Yatayat, Safa Tempo etc."
        v-model="yatayat"
        @ionInput="onInput"
      ></ion-input>
    </ion-item>
    <br />
    <ion-item>
      <ion-label position="floating">Source of information</ion-label>
      <ion-input
        placeholder="e.g. Self, Yatayat Karyalaya etc."
        v-model="yatayat"
        @ionInput="onInput"
      ></ion-input>
    </ion-item>
    <br />
    <ion-item>The stops you entered are:</ion-item>
    <ion-list>
      <ion-item v-for="(stop, idx) in busStops" :key="idx">
        {{ stop.lat }}, {{ stop.lng }}
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
} from "@ionic/vue";
import { closeCircle } from "ionicons/icons";

import { ref } from "vue";
const props = defineProps(["busStops"]);

let name;
let yatayatList = ref([]);
let yatayat = ref("");

const onInput = (e) => {
  if (e.target.value[e.target.value.length - 1] == ",") {
    yatayatList.value.push(yatayat.value);
    yatayat.value = "";
    console.log(yatayatList.value);
  }
};

const removeYatayat = (idx) => {
  yatayatList.value.splice(idx, idx);
};

const cancel = () => {
  return modalController.dismiss(null, "cancel");
  //send the user back to the add route page with the markers as it was when they enered the page
};

const confirm = () => {
  // console.log("From the router save modal",yatayatList.value)

  return modalController.dismiss(yatayatList.value, "confirm");
  //fetch the data about loongitude and latitue

};
</script>
