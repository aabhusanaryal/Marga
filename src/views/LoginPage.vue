<template>
    <ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
            </ion-buttons>
            <ion-title>Log In</ion-title>
          </ion-toolbar>
      </ion-header>

  <ion-content>
  <form @submit.prevent="submitLoginForm">
    <ion-item lines="full">
      <ion-label position="floating" class="ion-padding">Username</ion-label>
      <ion-input type="text" name="username" v-model="username" required></ion-input>
    </ion-item>
    <ion-item lines="full">
      <ion-label position="floating" class="ion-padding">Password</ion-label>
      <ion-input type="password" name="password"   v-model="password" required></ion-input>
    </ion-item>
    <ion-button type="submit"  expand="block" >Sign In</ion-button>

  </form>
    <ion-row>
      <ion-col>
        <br/>
        <a  class="small-text" >Forgot Password?</a>
        <br/>
        <a  class="small-text" href="/register">Sign up</a>
      </ion-col>
    </ion-row>
</ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import {Vue,ref} from 'vue'
     import {
        IonContent, IonHeader,IonPage,IonTitle,IonToolbar, IonItem, IonIcon,
        IonLabel,IonInput,IonList, IonFab,IonFabButton,IonButton, IonCol, IonRow,IonButtons,
  } from "@ionic/vue";

    let username, password;
    const submitLoginForm = async (e) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    
    let data = await fetch(`https://marga-backend.onrender.com/token`,{
        method:'POST',
        body: formData
      })
      data = await data.json()
      console.log(data.access_token)
  }

</script>

<style>

</style>