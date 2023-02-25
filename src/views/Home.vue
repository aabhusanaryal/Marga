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
let coordStartEnd: [] = [];
let showInfo = false;
let distance, changes;

// This funcion is called when a search result item is clicked on
const clickStartSearchResultItm = (event) => {
  //event stroes the location value
  start = event;
  if (startMarker) map.removeLayer(startMarker);
  startMarker = L.marker([event.lat, event.lng], {
    draggable: true,
  }).addTo(map);
  map.flyTo([event.lat, event.lng], 17);
  console.log([event.lat, event.lng]);
};

const clickDestinationSearchResultItm = (event) => {
  destination = event;
  if (destinationMarker) map.removeLayer(destinationMarker);
  destinationMarker = L.marker([event.lat, event.lng], {
    draggable: true,
  }).addTo(map);
  map.flyTo([event.lat, event.lng], 17);
  console.log([event.lat, event.lng]);
};

// Modal Controller

const modalList1 = [
  {
    yatayat: [[""]],
    vehicleTypes: [[""]],
    route: [
      {
        lat: 27.716851369776982,
        lng: 85.31591892242433,
        stopName: "Lainchaur Stop",
      },
      {
        lat: 27.713527097566296,
        lng: 85.3154468536377,
        stopName: "Greenline Travels, Kathmandu, TH, Nepal",
      },
      {
        lat: 27.713071189476622,
        lng: 85.31782865524292,
        stopName: "Durbar Marg, Kathmandu, TH, Nepal",
      },
      {
        lat: 27.713622078178442,
        lng: 85.32186269760133,
        stopName: "Jai Nepal Hall(QFX Jai Nepal), Kathmandu, TH, Nepal",
      },
      {
        lat: 27.710506670965156,
        lng: 85.32199144363403,
        stopName: "Krishna Pauroti Stop",
      },
      {
        lat: 27.709575830814018,
        lng: 85.32214164733888,
        stopName: "Kamaladi Road (कमलादी) stop",
      },
      {
        lat: 27.709689811667428,
        lng: 85.31742095947267,
        stopName: "Ghantaghar Stop",
      },
      {
        lat: 27.712159367580337,
        lng: 85.31516790390016,
        stopName: "Tourist Bus Station",
      },
      {
        lat: 27.708474009757715,
        lng: 85.31458854675294,
        stopName: "Jamal",
      },
    ],
    details: {
      km: 28,
      change: 0,
    },
  },
];
// const modalList = []; //should be array of bus stops

const findRoutes = async () => {
  if (start && destination) {
    console.log(start);
    console.log("Start and destination coords are: ", coordStartEnd);

    // Code to fetch the bus route list:
    // let busRouteList=await fetch(`backendlink`,{
    //   method:"POST",
    //   body:TSON.stringify(coordStartEnd)
    // })
    // busRouteList=await busRouteList.json()
    // console.log(busRouteList)

    const modal = await modalController.create({
      component: Modal,
      componentProps: { modalList1 },
      breakpoints: [0, 0.3, 0.95],
      initialBreakpoint: 0.3,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === "confirm") {
      showInfo = true;
      console.log("Value passed back: ", data);

      for (let i = 0; i < modalList1[data].route.length; i++) {
        const marker = L.marker([
          modalList1[data].route[i].lat,
          modalList1[data].route[i].lng,
        ]).addTo(map);
        marker
          .bindTooltip(`${i + 1} ${modalList1[data].route[i].stopName}`, {
            permanent: true,
          })
          .openTooltip();
      }
      changes = modalList1[data].details.change;
      distance = modalList1[data].details.km;
      map.setView(
        [modalList1[data].route[0].lat, modalList1[data].route[0].lng],
        16
      );
      // console.log(markerBusStops)
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
