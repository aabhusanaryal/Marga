<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <img :src="gravatarURL" alt="Profile Image" id="profileImage" />
      <h2>
        {{ fullName }}
      </h2>
      <h6>@{{ username }}</h6>
      <ion-chip color="success" v-if="isAdmin">Admin</ion-chip><br />
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
  onIonViewWillEnter,
  IonChip,
} from "@ionic/vue";

import { useAuthStore } from "@/store/authStore";
import { ref, watch } from "vue";
import router from "@/router";
import md5 from "md5";
const authStore = useAuthStore();

let emailAddress = ref(authStore.emailAddress);
let fullName = ref(authStore.fullName);
let username = ref(authStore.username);
const imageHash = ref(md5(emailAddress.value));
const gravatarURL = ref(
  `https://www.gravatar.com/avatar/${imageHash.value}?s=200`
);
const isAdmin = ref(authStore.roles.includes("admin"));
console.log(emailAddress, imageHash, gravatarURL);

onIonViewWillEnter(() => {
  console.log("Will enter");
  fullName.value = authStore.fullName;
  username.value = authStore.username;
  emailAddress.value = authStore.emailAddress;
  imageHash.value = md5(emailAddress.value);
  isAdmin.value = authStore.roles.includes("admin");
  gravatarURL.value = `https://www.gravatar.com/avatar/${imageHash.value}?s=200`;
});

const logout = () => {
  authStore.accessToken = "";
  authStore.fullName = "";
  authStore.username = "";
  authStore.emailAddress = "";
  authStore.role = "";
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

<style scoped>
#profileImage {
  border-radius: 50%;
}

ion-content {
  text-align: center;
}
h2 {
  margin-bottom: 0;
}
h6 {
  margin-top: 0;
}
</style>
