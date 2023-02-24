<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button @click="logout">Log Out</ion-button>
      <ion-button @click="showTutorial"
        >Show Tutorial on Next Launch</ion-button
      >
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonButton,
  toastController,
} from "@ionic/vue";

import { useAuthStore } from "@/store/authStore";
import router from "@/router";
const authStore = useAuthStore();

const logout = () => {
  authStore.accessToken = "";
  authStore.userAuthenticated = false;
  router.push("/");
};

const showTutorial = async () => {
  authStore.firstUse = true;

  const toast = await toastController.create({
    message: "OK! Will show tutorial on next launch.",
    duration: 1500,
    // position: position,
  });

  await toast.present();
};
</script>
