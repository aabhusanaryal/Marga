<template>
  <ion-page>
    <div class="loadingSpinner" v-if="showLoadingSpinner">
      <ion-spinner color="primary"></ion-spinner>
    </div>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Add Route</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <SearchBar
          placeholder="Search"
          @clickSearchResultItm="clickSearchResultItm"
        />
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div id="map-add"></div>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button>
          <ion-icon :icon="chevronUp"></ion-icon>
        </ion-fab-button>

        <ion-fab-list side="top">
          <ion-fab-button @click="saveData">
            <ion-icon :icon="save"></ion-icon>
          </ion-fab-button>
          <ion-fab-button @click="deleteMarkers">
            <ion-icon :icon="trashBin"></ion-icon>
          </ion-fab-button>
          <ion-fab-button @click="undoMarker">
            <ion-icon :icon="arrowUndo"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
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
  modalController,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonSpinner,
} from "@ionic/vue";
import { chevronUp, save, arrowUndo, trashBin } from "ionicons/icons";
import { onMounted, ref } from "vue";
import L from "leaflet";
import { createMapInstance } from "@/map";
import SearchBar from "@/components/SearchBar.vue";
import { useRouter } from "vue-router";
import Modal from "../components/RouteSaveModal.vue";
import { useAuthStore } from "../store/authStore";

const authStore = useAuthStore();
// map object for leaflet
let map;
let busStops: { lat: number; lng: number; marker: any }[] = [];

onMounted(async () => {
  map = await createMapInstance("map-add");
  // Adding a new marker to map every time a user clicks on any place
  map.on("click", function (event) {
    const latlng = map.mouseEventToLatLng(event.originalEvent);
    const marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
    busStops.push({ lat: latlng.lat, lng: latlng.lng, marker });
    console.log(busStops);
  });
});

onIonViewDidEnter(() => {
  if (map) map.invalidateSize();
});

const clickSearchResultItm = (event) => {
  map.flyTo([event.geometry.coordinates[1], event.geometry.coordinates[0]], 19);
  console.log([event.geometry.coordinates[1], event.geometry.coordinates[0]]);
};

// Code other than leaflet:
// let start;
// let arrBusStops = [];
// let oneBusStops = [];
let showLoadingSpinner = ref(false);
const saveData = async () => {
  showLoadingSpinner.value = true;
  console.log("Saving.");

  const modal = await modalController.create({
    component: Modal,
    componentProps: { busStops },
    breakpoints: [0, 0.5, 0.75, 0.95, 1],
    initialBreakpoint: 0.95,
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();
  if (role === "confirm") {
    console.log("The user has confirmed.");
  }
  // TODO: Update the code below to make actual fetch request
  await new Promise((done) =>
    setTimeout(() => console.log("Data Sent (JK)"), 5000)
  );
  showLoadingSpinner.value = false;
};

const undoMarker = (e) => {
  console.log("Undo marker", e);
  if (busStops.length) {
    let stop = busStops.pop();
    map.removeLayer(stop?.marker);
  }
  // Not closing the fab when undo is pressed
  if (busStops.length) e.stopImmediatePropagation();
};

const deleteMarkers = () => {
  // Removing all bus stops and their markers
  while (busStops.length) {
    let stop = busStops.pop();
    map.removeLayer(stop?.marker);
  }
  //need to remove all the markers on the page, refresh the add routes page.
};
</script>

<style scoped>
#map-add {
  height: 100%;
}
#containerButtons {
  display: flex;
  /* align-content: right; */
  justify-content: right;
}
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
