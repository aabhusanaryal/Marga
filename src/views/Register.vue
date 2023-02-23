<template>
    <ion-page>
        <div class="loadingSpinner" v-if="showLoadingSpinner">
      <ion-spinner color="primary"></ion-spinner>
    </div>
        <ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
    </ion-buttons>
    <ion-title>Register</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content>

  <form @submit.prevent="registerClicked">
    <ion-item lines="full">
      <ion-label position="floating" class="ion-padding">Full Name</ion-label>
      <ion-input type="text"  v-model="userInfo.full_name" required></ion-input>
    </ion-item>
    <ion-item lines="full">
      <ion-label position="floating" class="ion-padding">Username</ion-label>
      <ion-input type="text"  v-model="userInfo.username" required></ion-input>
    </ion-item>
    <ion-item lines="full">
      <ion-label position="floating" class="ion-padding">Email</ion-label>
      <ion-input type="text"  v-model="userInfo.email" required></ion-input>
    </ion-item>
    <ion-item lines="full">
      <ion-label position="floating" class="ion-padding">Password</ion-label>
      <ion-input type="password"  minlength="8" maxlength="15"  v-model="userInfo.password" required></ion-input>
    </ion-item>
  
  <ion-row>
      <ion-col>
        <ion-button type="submit"  expand="block">SUBMIT</ion-button>
      </ion-col>
    </ion-row>  
  </form>
  <ion-item v-if="authStore.incorrect">
  <h1 >User with this {{message}} already exixts</h1>
  </ion-item>
<!-- This is not working  -->
</ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import {Vue,ref} from 'vue'
     import {
        IonContent, IonHeader,IonPage, IonTitle, IonToolbar, IonItem, IonIcon,IonLabel,
        IonInput,IonList, IonFab,IonFabButton,IonButton, IonCol,IonRow,IonButtons, onIonViewDidEnter,
  } from "@ionic/vue";
    import {useRouter} from 'vue-router';
    import {useAuthStore} from "@/store/authStore"

    let showLoadingSpinner=ref(false)
    let email, password, full_name, username, message;
    const userInfo={
      email, password,full_name,username
    }

    const router=useRouter();
    const authStore=useAuthStore();

    if (authStore.userAuthenticated){
      router.push('/')
      console.log("Since user logged in,don't show register push to homepage.") 
    }
    
    const registerClicked= async ()=>{
      showLoadingSpinner.value=true
      console.log(JSON.stringify(userInfo))
        let userData= await fetch('https://marga-backend.onrender.com/register',{
            method:'POST',
             headers:{'content-type': 'application/json'},
            body:JSON.stringify(userInfo)
          })
      userData=await userData.json()
      console.log(userData)

      if(userData.detail==='Username already exists.'){
        console.log("Reached here--username")
        authStore.incorrect=true
        message="username"
      showLoadingSpinner.value=false

      }
      else if (userData.detail==="Email already exists."){
        console.log("Reached here--email")
        authStore.incorrect=true
        message="email"
        showLoadingSpinner.value=false
      }
      else{
        router.push('/')
        showLoadingSpinner.value=false
      }
    }

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