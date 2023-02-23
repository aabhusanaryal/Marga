<template>
  <ion-content class="ion-padding">
    <ion-slides :options="slideOptions">
      <ion-slide v-for="(itm, idx) in modalList" :key="idx">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ itm }}</ion-card-title>
            <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            Here's a small text description for the card content. Nothing more,
            nothing less.
          </ion-card-content>
        </ion-card>
      </ion-slide>
      ...
    </ion-slides>
    <!--     
    <ion-card>
      <ion-card-header>
        <ion-card-title>Card Title</ion-card-title>
        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        Here's a small text description for the card content. Nothing more,
        nothing less.
      </ion-card-content>
    </ion-card>
    <ion-card>
      <ion-card-header>
        <ion-card-title>Card Title</ion-card-title>
        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        Here's a small text description for the card content. Nothing more,
        nothing less.
      </ion-card-content>
    </ion-card>
    <ion-card>
      <ion-card-header>
        <ion-card-title>Card Title</ion-card-title>
        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        Here's a small text description for the card content. Nothing more,
        nothing less.
      </ion-card-content>
    </ion-card> -->
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
} from "@ionic/vue";
import { defineComponent } from "vue";
// import { register } from "swiper/element/bundle";

// register();

const props = defineProps(["modalList"]);
console.log(props.modalList);

const slideOptions = {
  slidesPerView: 1.2,
  autoHeight: true,
};
// function cancel() {
//   return modalController.dismiss(null, "cancel");
// }
// function confirm() {
//   return modalController.dismiss(name, "confirm");
// }
</script>
