<template>
  <ion-content class="ion-padding">
    <ion-slides :options="slideOptions">
      <ion-slide v-for="(itm, idx) in modalList" :key="idx">
        <ion-card @click="displayRoute">
          <ion-card-header>
            <ion-card-title>{{ itm.name }}</ion-card-title>
            <ion-card-subtitle ></ion-card-subtitle>
          </ion-card-header>
          <ion-buttons >
            <ion-button @click="confirm(idx)">Confirm</ion-button>
          </ion-buttons>
        </ion-card>
      </ion-slide>
    </ion-slides>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  modalController,
  IonCardHeader,
  IonSlides,
  IonSlide,
  IonButtons,
  IonButton
} from "@ionic/vue";
import { defineComponent } from "vue";

const props = defineProps(["modalList"]);

console.log("From search results modal: ")
console.log(props.modalList);

const slideOptions = {
  slidesPerView: 1.2,
  autoHeight: true,
};

const confirm = (idx:number) => {
  console.log("Confirm button has been clicked and the id is: ",idx)
  return modalController.dismiss( idx,"confirm");
};
</script>
