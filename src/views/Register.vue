<template>
  <ion-page>
    <!-- <div class="login-section ion-padding">

        </div> -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"> </ion-buttons>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form @submit.prevent="registerClicked">
        <ion-item lines="full">
          <ion-label position="floating" class="ion-padding"
            >Full Name</ion-label
          >
          <ion-input
            type="text"
            v-model="userInfo.full_name"
            required
          ></ion-input>
        </ion-item>
        <ion-item lines="full">
          <ion-label position="floating" class="ion-padding"
            >Username</ion-label
          >
          <ion-input
            type="text"
            v-model="userInfo.username"
            required
          ></ion-input>
        </ion-item>
        <ion-item lines="full">
          <ion-label position="floating" class="ion-padding">Email</ion-label>
          <ion-input type="text" v-model="userInfo.email" required></ion-input>
        </ion-item>
        <ion-item lines="full">
          <ion-label position="floating" class="ion-padding"
            >Password</ion-label
          >
          <ion-input
            type="password"
            minlength="8"
            maxlength="15"
            v-model="userInfo.password"
            required
          ></ion-input>
        </ion-item>
        <ion-row>
          <ion-col>
            <ion-button type="submit" expand="block">SUBMIT</ion-button>
          </ion-col>
        </ion-row>
      </form>
      <h1 v-if="errorRegistering">
        User with this {{ message }} already exixts
      </h1>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Vue, ref } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonIcon,
  IonLabel,
  IonInput,
  IonList,
  IonFab,
  IonFabButton,
  IonButton,
  IonCol,
  IonRow,
  IonButtons,
  onIonViewDidEnter,
} from "@ionic/vue";

let email, password, full_name, username;
const userInfo = {
  email,
  password,
  full_name,
  username,
};

const registerClicked = async () => {
  console.log(JSON.stringify(userInfo));
  let userData = await fetch("https://marga-backend.onrender.com/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(userInfo),
  });
  // userData=await userData.json()
  userData = await userData;
  console.log(userData);
};
</script>

<style></style>
