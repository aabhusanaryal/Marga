<template>
  <ion-page>
    <div class="loadingSpinner" v-if="showLoadingSpinner">
      <ion-spinner color="primary"></ion-spinner>
    </div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"> </ion-buttons>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form @submit.prevent="registerClicked">
        <ion-item lines="full">
          <ion-label position="floating">Full Name</ion-label>
          <ion-input type="text" v-model="userInfo.full_name" required></ion-input> </ion-item><br />
        <ion-item lines="full">
          <ion-label position="floating">Username</ion-label>
          <ion-input type="text" v-model="userInfo.username" required></ion-input> </ion-item><br />
        <ion-item lines="full">
          <ion-label position="floating">Email</ion-label>
          <ion-input type="email" v-model="userInfo.email" required></ion-input> </ion-item><br />
        <ion-item lines="full">
          <ion-label position="floating">Password</ion-label>
          <ion-input type="password" minlength="8" maxlength="15" v-model="userInfo.password" :clearOnEdit="false"
            required></ion-input> </ion-item><br />
        <ion-button type="submit" expand="block">SUBMIT</ion-button>
      </form>
      <br />
      <router-link class="small-text" to="/tabs/login">Already have an account? Log in.</router-link>
      <ion-item v-if="error" color="danger">
        <h3>{{ errorMessage }}</h3>
      </ion-item>
      <!-- This is not working  -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonSpinner,
  IonButton,
  IonButtons,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

let showLoadingSpinner = ref(false);
let email, password, full_name, username;
let error = false,
  errorMessage;
const userInfo = {
  email,
  password,
  full_name,
  username,
};

const router = useRouter();
const authStore = useAuthStore();
if (authStore.userAuthenticated) {
  router.push("/");
  console.log("Since user authenticated,don't show register push to homepage.");
}
let userData;
const registerClicked = async () => {
  showLoadingSpinner.value = true;
  // console.log(JSON.stringify(userInfo));
  try {
    userData = await fetch(
      "https://marga-backend.aabhusanaryal.com.np/register",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(userInfo),
      }
    );
    userData = await fetch("https://marga-backend.aabhusanaryal.com.np/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userInfo),
    });
    userData = await userData.json();
    console.log(userData);
  } catch (err) {
    console.log(err);
  }
  showLoadingSpinner.value = false;

  if (userData.detail === "Username already exists.") {
    // console.log("Reached here--username");
    error = true;
    errorMessage = "This username already exists.";
  } else if (userData.detail === "Email already exists.") {
    // console.log("Reached here--email");
    error = true;
    errorMessage = "This username already exists.";
  } else {
    router.push("/tabs/login");
  }
};
</script>

<style>
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