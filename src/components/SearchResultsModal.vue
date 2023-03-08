<template>
  <ion-content class="ion-padding">
    <ion-slides :options="slideOptions">
      <ion-slide v-for="(route, idx) in routeSwitches" :key="idx">
        <ion-card>
          <ion-card-header>
            <ion-card-title
              >{{ route[0][0].stopName }} -
              {{
                route[route.length - 1][route[0].length - 1].stopName
              }}</ion-card-title
            >
            <ion-card-subtitle>
              <ion-chip>
                <ion-icon :icon="bus" color="primary"></ion-icon>
                <ion-label>{{ routeSwitches.length + 1 }} buses</ion-label>
              </ion-chip>
            </ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="(bus, idx) in route" :key="idx"
                >Bus {{ idx + 1 }}. {{ bus[0].stopName }} -
                {{ bus[bus.length - 1].stopName }}</ion-item
              >
            </ion-list>
          </ion-card-content>
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
  IonItem,
  IonList,
  IonIcon,
  IonLabel,
  IonChip,
} from "@ionic/vue";
import { bus } from "ionicons/icons";

import { defineComponent } from "vue";

const props = defineProps(["routeSwitches"]);

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
