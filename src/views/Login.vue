<template>
  <ion-page>
    <div class="loadingSpinner" v-if="showLoadingSpinner">
      <ion-spinner color="primary"></ion-spinner>
    </div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"> </ion-buttons>
        <ion-title>Log In</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form @submit.prevent="submitLoginForm">
        <ion-item lines="full">
          <ion-label position="floating" class="ion-padding"
            >Username</ion-label
          >
          <ion-input
            type="text"
            name="username"
            v-model="username"
            required
          ></ion-input>
        </ion-item>
        <ion-item lines="full">
          <ion-label position="floating" class="ion-padding"
            >Password</ion-label
          >
          <ion-input
            type="password"
            name="password"
            v-model="password"
            required
          ></ion-input>
        </ion-item>
        <ion-button type="submit" expand="block">Sign In</ion-button>
      </form>
      <h3 v-if="authStore.incorrect">Incorrect username or password.</h3>

      <ion-row>
        <ion-col>
          <br />
          <a class="small-text" href="/register">Sign up</a>
        </ion-col>
      </ion-row>
      <ion-button @click="backButtonClicked"> BACK </ion-button>
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
  IonCol,
  IonRow,
  IonSpinner,
} from "@ionic/vue";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "vue-router";

let username, password;
let showLoadingSpinner = ref(false);
const authStore = useAuthStore();
const router = useRouter();

if (authStore.userAuthenticated) {
  router.push("/");
  console.log("Since user logged in,son't show login push to homepage.");
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
  console.log("Acess token: ", data.access_token);
  showLoadingSpinner.value = false;

  if (data.detail === "Incorrect username or password") {
    console.log("incorrect");
    authStore.incorrect = true;
  } else {
    authStore.incorrect = false;
    authStore.accessToken = data.access_token;
    authStore.userAuthenticated = true;
    router.push(authStore.returnURL || "/tabs/home");
  }
  // const backButtonClicked=()=>{
  //     console.log("button clicked")
  //     router.push('/tabs/home')
  //   }
  function backButtonClicked() {
    console.log("Back button clicked.");
    router.push("/");
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
