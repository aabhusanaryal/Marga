<template>
  <ion-page>
    <div class="loadingSpinner" v-if="showLoadingSpinner">
      <ion-spinner color="primary"></ion-spinner>
    </div>
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
  IonIcon,
  modalController,
  toastController,
  onIonViewDidEnter,
  IonSpinner,
} from "@ionic/vue";
import { search } from "ionicons/icons";
import { onMounted } from "vue";
import { Geolocation } from "@capacitor/geolocation";
import L from "leaflet";
import { createMapInstance } from "@/map";
import { ref } from "vue";

// Imports other than leaflet
import SearchBar from "@/components/SearchBar.vue";
import Modal from "@/components/SearchResultsModal.vue";
import { useAuthStore } from "@/store/authStore";
// import OverlayEventDetail from '@ionic/core'

// Logic code starts
// map object for leaflet
let map;
let showLoadingSpinner = ref(false);

const authStore = useAuthStore();
onMounted(async () => {
  map = await createMapInstance("map-home");
  //Finding out the time since last time the routedetails were updated
  // let year, month, time, hour, minute, second, millisecond;
  // const now=new Date().getTime();
  // let lastUpdateDiff=
  // console.log(now);
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
};

const clickDestinationSearchResultItm = (event) => {
  destination = event;
  if (destinationMarker) map.removeLayer(destinationMarker);
  destinationMarker = L.marker([event.lat, event.lng], {
    draggable: true,
  }).addTo(map);
  map.flyTo([event.lat, event.lng], 17);
};

const findRoutes = async () => {
  if (start && destination) {
    showLoadingSpinner.value = true;
    let bodyData = {
      start: start.node_id,
      end: destination.node_id,
    };
    // Code to fetch the bus route list:
    let busRouteList = await fetch(
      `https://marga-backend.aabhusanaryal.com.np/getroutes?start=${start.node_id}&end=${destination.node_id}`,
      {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: { "content-type": "application/json" },
      }
    );
    busRouteList = await busRouteList.json();

    // Breaking down the busStops into 2D array. Each array inside routeSwitches is a route a single bus can follow
    let routeSwitches = [];

    busRouteList.forEach((busRoute) => {
      let arr = [[]]; // Required 2D array
      busRoute.route.forEach((busStop, idx) => {
        if (!busStop.change) arr[arr.length - 1].push(busStop);
        else {
          arr[arr.length - 1].push(busStop);
          arr.push([]);
          arr[arr.length - 1].push(busStop);
        }
      });
      routeSwitches.push(arr);
    });

    console.log(busRouteList, routeSwitches);
    const modal = await modalController.create({
      component: Modal,
      componentProps: { routeSwitches },
      breakpoints: [0, 0.3, 0.95],
      initialBreakpoint: 0.3,
    });
    modal.present();
    showLoadingSpinner.value = false;

    const { data, role } = await modal.onWillDismiss();

    if (role === "confirm") {
      // Removing everything before rendering new markers
      map.eachLayer((layer) => {
        // Removing everything other than the tile layer
        // PS: Only the tile layer has _url
        if (!layer._url) map.removeLayer(layer);
      });

      const busMarker = L.icon({
        iconUrl: require("@/assets/bus.png"),
        // shadowUrl: "leaf-shadow.png",

        iconSize: [17, 20], // size of the icon
        // shadowSize: [50, 64], // size of the shadow
        iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
      });
      // Drawing path between route stops
      let stopIdx = 1;
      routeSwitches[data].forEach(async (bus) => {
        let coordinates = [];

        const markerStart = L.marker([bus[0].lat, bus[0].lng]).addTo(map);
        markerStart
          .bindTooltip(`${bus[0].stopName}`, {
            permanent: true,
          })
          .openTooltip();
        const markerStop = L.marker([
          bus[bus.length - 1].lat,
          bus[bus.length - 1].lng,
        ]).addTo(map);
        markerStop
          .bindTooltip(`${bus[bus.length - 1].stopName}`, {
            permanent: true,
          })
          .openTooltip();

        console.log(bus[0].stopName, bus[bus.length - 1].stopName);

        bus.forEach((stop, idx) => {
          coordinates.push([stop.lng, stop.lat]);
          // Drawing bus icon marker at each stop
          const marker = L.marker([stop.lat, stop.lng], {
            icon: busMarker,
          }).addTo(map);
          marker.bindTooltip(`${stop.stopName}`, {
            permanent: false,
          });
        });
        const bodyData = {
          coordinates,
        };
        let res = await fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            method: "POST",
            headers: {
              Authorization: `${process.env.VUE_APP_ORS_API}`,
              "content-type": "application/json",
            },
            body: JSON.stringify(bodyData),
          }
        );
        res = await res.json();
        L.geoJSON(res, {
          style: {
            color: randomColorPicker(),
            weight: 5,
          },
        }).addTo(map);
        res;
      });
    }
  } else {
    presentToast("bottom", "Please select start and destination nodes!");
  }
  const randomColorPicker = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
  };
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
