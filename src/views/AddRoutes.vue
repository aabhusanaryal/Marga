<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Add Route</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <SearchBar placeholder="Starting area"
        @clickSearchResultItm="clickStartSearchResultItm"/>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="map-add" @click="addMarker"></div>
    </ion-content>
    <div id="containerButtons">
      <ion-item>
        <ion-button id="open-modal" @click="clickOnCancel">Cancel</ion-button>
      </ion-item>
      <ion-item>
        <ion-button id="open-modal" @click="clickOnComplete">Complete</ion-button>
      </ion-item>
    </div>
    
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
} from "@ionic/vue";
import { onMounted ,ref} from "vue";
import L from "leaflet";
import { createMapInstance } from "@/map";
import SearchBar from "@/components/SearchBar.vue"
import {OverlayEventDetail} from '@ionic/core/components';
import {useRouter} from 'vue-router'
import Modal from '../components/RouteModal.vue'
import {useAuthStore} from '../store/authStore'

const authStore=useAuthStore();
const router=useRouter();
// map object for leaflet
let map;
let arrBusStops=[];
let oneBusStops=[];
let markers=[];

onMounted(async () => {
  map = await createMapInstance("map-add");
   map.on("click", function (ev) {
    const latlng = map.mouseEventToLatLng(ev.originalEvent);
    console.log("From add-route page: ",latlng.lat + ", " + latlng.lng);
    // oneBusStops.push(latlng);
    arrBusStops.push(latlng);
    //need to not use authStore for this:
    authStore.addRouteStops=arrBusStops
    const marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
    markers.push(marker)
    marker.bindPopup("<b>Location</b>").openPopup();
    console.log(markers)
  });
});

onIonViewDidEnter(() => {
  if (map) map.invalidateSize();
});
let start
const clickStartSearchResultItm=(event)=>{
  start=event;
  map.flyTo([event.geometry.coordinates[1], event.geometry.coordinates[0]], 19);
  console.log([event.geometry.coordinates[1], event.geometry.coordinates[0]])
}
const clickOnComplete=async()=>{
  console.log("Clicked on complete.")
  console.log(authStore.addRouteStops)
  // router.push('/confirm')
  const modal=await modalController.create({
    component:Modal,
  })
  modal.present();
  const {data, role} =await modal.onWillDismiss();
  if(role==='confirm'){
    console.log("The user has confirmed the bus stops.")
  }
}
const clickOnCancel=()=>{
  console.log("Clicked on cancel.")
  for(let i=0;i<authStore.addRouteStops.length;i++)
  {
    console.log("Removing from the loop", i)
  }
  authStore.addRouteStops=[]
  // marker.removeFrom(map)
  //need to remove all the markers on the page, refresh the add routes page.
}


</script>

<style scoped>
#map-add {
  height: 100%;
}
#containerButtons{
  display: flex;
  /* align-content: right; */
  justify-content: right;
}
</style>
