<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Add Route</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div id="map-add"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonTitle,
  IonToolbar,
  IonHeader,
  onIonViewDidEnter,
} from "@ionic/vue";
import { onMounted } from "vue";
import L from "leaflet";
import { createMapInstance } from "@/map";

// map object for leaflet
let map;
onMounted(async () => {
  map = await createMapInstance("map-add");
});
onIonViewDidEnter(() => {
  if (map) map.invalidateSize();
});
</script>

<style scoped>
#map-add {
  height: 100%;
}
</style>
