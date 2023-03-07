<template>
  <ion-page>
    <div class="loadingSpinner" v-if="showLoadingSpinner">
      <ion-spinner color="primary"></ion-spinner>
    </div>
    <ion-header>
      <ion-toolbar>
        <ion-title>Log In</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form @submit.prevent="submitLoginForm">
        <ion-item lines="full">
          <ion-label position="floating">Username</ion-label>
          <ion-input
            type="text"
            name="username"
            v-model="username"
            required
          ></ion-input>
        </ion-item>
        <br />
        <ion-item lines="full">
          <ion-label position="floating">Password</ion-label>
          <ion-input
            type="password"
            name="password"
            v-model="password"
            required
            :clearOnEdit="false"
          ></ion-input>
        </ion-item>
        <br />
        <ion-button type="submit" expand="block">Sign In</ion-button>
        <!-- <button type="submit">Sign In</ -->
      </form>
      <ion-item v-if="error" color="danger">
        <h3>{{ errorMessage }}</h3>
      </ion-item>
      <br />
      <router-link class="small-text" to="/tabs/register"
        >Don't have an account? Register.</router-link
      >
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
  IonButton,
  IonSpinner,
} from "@ionic/vue";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
let username, password;
let showLoadingSpinner = ref(false);
let error = false,
  errorMessage = "";

if (authStore.userAuthenticated) {
  router.push("/");
  console.log("Since user authenticated,son't show login push to homepage.");
}

const submitLoginForm = async (e) => {
  showLoadingSpinner.value = true;
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  let data = await fetch(`https://marga-backend.onrender.com/token`, {
    method: "POST",
    body: formData,
  });
  data = await data.json();
  // console.log(data);
  // console.log("Acess token: ", data.access_token);
  showLoadingSpinner.value = false;

  if (data.detail === "Incorrect username or password") {
    console.log("incorrect");
    error = true;
    errorMessage = "Incorrect username or password.";
  } else {
    console.log("Data", data);
    authStore.accessToken = data.access_token;
    authStore.fullName = data.full_name;
    authStore.username = data.username;
    authStore.emailAddress = data.email_address;
    authStore.userAuthenticated = true;
    router.push(authStore.returnURL || "/tabs/home");
  }
};
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
