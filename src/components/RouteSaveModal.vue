<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">Cancel</ion-button>
      </ion-buttons>
      <ion-title>Modal</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="confirm">Confirm</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-item>
      <ion-label position="stacked">Your name</ion-label>
      <ion-input v-model="name" placeholder="Your name"></ion-input>
    </ion-item>
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
} from "@ionic/vue";
import { useAuthStore } from "../store/authStore";
const authStore = useAuthStore();

const cancel = () => {
  return modalController.dismiss(null, "cancel");
  //send the user back to the add route page with the markers as it was when they enered the page
};

let name;

const confirm = () => {
  return modalController.dismiss(name, "confirm");

  //fetch the data about loongitude and latitue
  //remove all the markers(if the langitude and latitude are stored in the local storage)
  // authStore.addRouteStops=[]
};
</script>
