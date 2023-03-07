<template>
  <ion-content class="ion-padding">
    <ion-slides :options="slideOptions">
      <ion-slide v-for="(itm, idx) in busRouteList" :key="idx">
        <ion-card mode="ios">
          <ion-card-header>
            <!-- <ion-card-title>{{ itm.name }}</ion-card-title> -->
            <ion-card-content v-for="(route, idx) in itm.route" :key="idx">
              <p>{{ route.stopName }}<br /></p>
            </ion-card-content>
            <ion-card-subtitle></ion-card-subtitle>
          </ion-card-header>
          <p>
            <b
              >Number of bus changes:{{ itm.details.change }} <br />Distance(in
              km): {{ itm.details.km }}</b
            >
          </p>
          <ion-buttons>
            <ion-button @click="confirm(idx)">Select</ion-button>
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
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";

const props = defineProps(["busRouteList"]);

// console.log("From search results modal: ")
// console.log(props.modalList1);

const slideOptions = {
  slidesPerView: 1.2,
  autoHeight: true,
};

const confirm = (idx: number) => {
  // console.log("Confirm button has been clicked and the id is: ",idx)
  return modalController.dismiss(idx, "confirm");
};
</script>

<style scoped></style>
