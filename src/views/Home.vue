<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <SearchBar
          placeholder="Start Node"
          @clickSearchResultItm="clickStartSearchResultItm"
        />
      </ion-toolbar>
      <ion-toolbar>
        <SearchBar
          placeholder="Destination Node"
          @clickSearchResultItm="clickDestinationSearchResultItm"
        />
      </ion-toolbar>
      <ion-toolbar>
        <ion-button @click="findRoutes" shape="round">
          <ion-icon slot="start" :icon="search"></ion-icon>Find
          Routes</ion-button
        >
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="map-home" @click="addMarker"></div>

      <!-- Modal that displays available routes -->
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
  IonButton,
  alertController,
  IonIcon,
  modalController,
  toastController,
  onIonViewDidEnter,
} from "@ionic/vue";
import { search } from "ionicons/icons";
import { onMounted, computed, onUnmounted } from "vue";
import { Geolocation } from "@capacitor/geolocation";
import L from "leaflet";
import { createMapInstance } from "@/map";
// Imports other than leaflet
import SearchBar from "@/components/SearchBar.vue";
import Modal from "@/components/Modal.vue";

// Logic code starts
// map object for leaflet
let map;
onMounted(async () => {
  map = await createMapInstance("map-home");
});

onIonViewDidEnter(() => {
  if (map) map.invalidateSize();
});

// This function is run if the location permissions have not yet been granted. It is called inside onMounted.
// Once the user pressed OK on the alert, location permissions are requested.

// Logic other than leaflet go below this
let start, destination;
// This funcion is called when a search result item is clicked on
const clickStartSearchResultItm = (event) => {
  start = event;
  const marker = L.marker([
    event.geometry.coordinates[1],
    event.geometry.coordinates[0],
  ]).addTo(map);
  map.flyTo([event.geometry.coordinates[1], event.geometry.coordinates[0]], 17);
  console.log([event.geometry.coordinates[1], event.geometry.coordinates[0]]);
};
const clickDestinationSearchResultItm = (event) => {
  destination = event;
  const marker = L.marker([
    event.geometry.coordinates[1],
    event.geometry.coordinates[0],
  ]).addTo(map);
  map.flyTo([event.geometry.coordinates[1], event.geometry.coordinates[0]], 17);
  console.log([event.geometry.coordinates[1], event.geometry.coordinates[0]]);
};

// Modal Controller
const modalList = [1, 2, 3];
const findRoutes = async () => {
  if (start && destination) {
    console.log(start);
    const modal = await modalController.create({
      component: Modal,
      componentProps: { modalList },
      breakpoints: [0, 0.3],
      initialBreakpoint: 0.3,
    });
    modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // if (role === "confirm") {
    //   console.log("Dismiss");
    // }
  } else {
    presentToast("bottom", "Please select start and destination nodes!");
  }
};

// Toast Generator / Presentor
const presentToast = async (position: "top" | "middle" | "bottom", text) => {
  const toast = await toastController.create({
    message: text,
    duration: 1500,
    position: position,
  });

  await toast.present();
};
</script>

<style scoped>
#map-home {
  height: 100%;
}
</style>

<style>
.leaflet-control-locate-location-arrow {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 7px;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="black" d="M445 4 29 195c-48 23-32 93 19 93h176v176c0 51 70 67 93 19L508 67c16-38-25-79-63-63z"/></svg>');
}
</style>
