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
      <div id="map-home"></div>
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
import Modal from "@/components/SearchResultsModal.vue";
// import OverlayEventDetail from '@ionic/core'

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
let startMarker, destinationMarker;
let startCoord, destinationCoord;
let coordStartEnd:[]=[];

// This funcion is called when a search result item is clicked on
const clickStartSearchResultItm = (event) => {
  //event stroes the location value
  start = event;
  if (startMarker) map.removeLayer(startMarker);
  startMarker = L.marker(
    [event.geometry.coordinates[1], event.geometry.coordinates[0]],
    {
      draggable: true,
    }
  ).addTo(map);
  startCoord={
    lat:event.geometry.coordinates[1],
    lng:event.geometry.coordinates[0]
  }
  console.log("Start coords: ",startCoord)
  map.flyTo([event.geometry.coordinates[1], event.geometry.coordinates[0]], 17);
  console.log([event.geometry.coordinates[1], event.geometry.coordinates[0]]);
};

const clickDestinationSearchResultItm = (event) => {
  destination = event;
  if (destinationMarker) map.removeLayer(destinationMarker);
  destinationMarker = L.marker(
    [event.geometry.coordinates[1], event.geometry.coordinates[0]],
    {
      draggable: true,
    }
  ).addTo(map);
  destinationCoord={
    lat:event.geometry.coordinates[1],
    lng:event.geometry.coordinates[0]
  }
  coordStartEnd.push(destinationCoord)
  map.flyTo([event.geometry.coordinates[1], event.geometry.coordinates[0]], 17);
  console.log([event.geometry.coordinates[1], event.geometry.coordinates[0]]);
};

// Modal Controller
const list2={
  name:"Chabahil - Jorpati 2",
  busStops:[
  {
    name:"Chabahil",
    lat:27.715877, 
    lng:85.345877,
  },
  {
    name:"Buadha",
    lat:27.721429, 
    lng:85.362002 ,
  },
  {
    name:"Jorpati",
    lat:27.725187,
    lng:85.379552,
  },
  {
    name:"apple",
    lat:27.725187,
    lng:86.379552,
  },
  {
    name:"banana",
    lat:26.725187,
    lng:85.379552,
  }]}
const modalList=[{
  name:"Chabahil-Jorpati",
  busStops:[
  {
    name:"Chabahil",
    lat:27.715877, 
    lng:85.345877,
  },
  {
    name:"Buadha",
    lat:27.721429, 
    lng:85.362002 ,
  },
  {
    name:"Jorpati",
    lat:27.725187,
    lng:85.379552,
  },
  {
    name:"apple",
    lat:27.725187,
    lng:86.379552,
  },
  {
    name:"banana",
    lat:26.725187,
    lng:85.379552,
  }]}
]
modalList.push(list2)
// const modalList = []; //should be array of bus stops

const findRoutes = async () => {
  if (start && destination) {
    console.log(start);
    console.log("Start and destination coords are: ", coordStartEnd)  
    
    // Code to fetch the bus route list:
    // let busRouteList=await fetch(`backendlink`,{
    //   method:"POST",
    //   body:coordStartEnd
    // })
    // busRouteList=await busRouteList.json()
    // console.log(busRouteList)

    const modal = await modalController.create({
      component: Modal,
      componentProps: { modalList },
      breakpoints: [0, 0.3, 0.95],
      initialBreakpoint: 0.3,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === "confirm") {

      console.log("Value passed back: ",data)

      console.log(modalList[data].busStops.length)
      for (let i=0;i<modalList[data].busStops.length;i++){
        const marker=L.marker([modalList[data].busStops[i].lat,modalList[data].busStops[i].lng ]).addTo(map);
        // First implement delay then:
        // map.flyTo([modalList[indx].busStops[i].lat, modalList[indx].busStops[i].lng])
      }
    }

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
