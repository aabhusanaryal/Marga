<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button @click="logout">Log Out</ion-button>
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
} from "@ionic/vue";

import { useAuthStore } from "@/store/authStore";
import router from "@/router";
const authStore = useAuthStore();

const logout = () => {
  authStore.accessToken = "";
  authStore.userAuthenticated = false;
  router.push("/");
};
</script>
