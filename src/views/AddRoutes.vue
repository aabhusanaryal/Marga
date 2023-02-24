<template>
  <ion-page>
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
  IonItem,
  IonButton,
  onIonViewDidEnter,
  modalController,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
} from "@ionic/vue";
import { chevronUp, save, arrowUndo, trashBin } from "ionicons/icons";
import { onMounted, ref } from "vue";
import L from "leaflet";
import { createMapInstance } from "@/map";
import SearchBar from "@/components/SearchBar.vue";
import { OverlayEventDetail } from "@ionic/core/components";
import { useRouter } from "vue-router";
import Modal from "../components/RouteSaveModal.vue";
import { useAuthStore } from "../store/authStore";

const authStore = useAuthStore();
const router = useRouter();
// map object for leaflet
let map;
let arrBusStops = [];
let oneBusStops = [];
onMounted(async () => {
  map = await createMapInstance("map-add");
  map.on("click", function (ev) {
    const latlng = map.mouseEventToLatLng(ev.originalEvent);
    console.log("From add-route page: ", latlng.lat + ", " + latlng.lng);
    // oneBusStops.push(latlng);
    arrBusStops.push(latlng);
    //need to not use authStore for this:
    authStore.addRouteStops = arrBusStops;
    const marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
  });
});

onIonViewDidEnter(() => {
  if (map) map.invalidateSize();
});
let start;
const clickSearchResultItm = (event) => {
  map.flyTo([event.geometry.coordinates[1], event.geometry.coordinates[0]], 19);
  console.log([event.geometry.coordinates[1], event.geometry.coordinates[0]]);
};

const saveData = async () => {
  console.log("Saving.");
  // router.push('/confirm')
  const modal = await modalController.create({
    component: Modal,
    // componentProps: { modalList },
    breakpoints: [0, 0.5, 0.75, 0.95, 1],
    initialBreakpoint: 0.95,
  });
  modal.present();
  const { data, role } = await modal.onWillDismiss();
  if (role === "confirm") {
    console.log("The user has confirmed.");
  }
};

const undoMarker = (e) => {
  console.log("Undo marker", e);
  // Not closing the fab when undo is pressed
  e.stopImmediatePropagation();
};

const deleteMarkers = () => {
  console.log("Markers deleted!");
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
</style>
