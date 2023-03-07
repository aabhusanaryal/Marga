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
import {useRouteStore} from "@/store/routeStore";
// import OverlayEventDetail from '@ionic/core'

// Logic code starts
// map object for leaflet
let map;
let showLoadingSpinner = ref(false);

const authStore = useAuthStore();
const routeStore=useRouteStore();
onMounted(async () => {
  console.log("Mounter from homepage.");
  map = await createMapInstance("map-home");
  let busRouteList = await fetch(
    `https://marga-backend.onrender.com/getallroutes`,
    {
      method: "GET",
    }
  );
  busRouteList = await busRouteList.json();
  routeStore.routeDetails = busRouteList;
  console.log("Homepage bus route list: ", routeStore.routeDetails);
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
  console.log(event);
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

const findRoutes = async () => {
  if (start && destination) {
    showLoadingSpinner.value = true;
    console.log("Start");
    let bodyData = {
      start: start.node_id,
      end: destination.node_id,
    };
    console.log(JSON.stringify(bodyData));
    // Code to fetch the bus route list:
    let busRouteList = await fetch(
      `https://marga-backend.onrender.com/getroutes?start=${start.node_id}&end=${destination.node_id}`,
      {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: { "content-type": "application/json" },
      }
    );
    busRouteList = await busRouteList.json();

    const modal = await modalController.create({
      component: Modal,
      componentProps: { busRouteList },
      breakpoints: [0, 0.3, 0.95],
      initialBreakpoint: 0.3,
    });
    modal.present();
    console.log("Stop");
    showLoadingSpinner.value = false;

    const { data, role } = await modal.onWillDismiss();
    if (role === "confirm") {
      // Removing everything before rendering new markers
      map.eachLayer((layer) => {
        // Removing everything other than the tile layer
        // PS: Only the tile layer has _url
        if (!layer._url) map.removeLayer(layer);
      });
      // for (let i = 0; i < modalList1[data].route.length; i++) {

      // }
      // changes = modalList1[data].details.change;
      // distance = modalList1[data].details.km;
      // map.setView(
      //   [modalList1[data].route[0].lat, modalList1[data].route[0].lng],
      //   16
      // );
      let routeSwitches = [[]];
      busRouteList[data].route.forEach((busStop, idx) => {
        console.log(busStop);
        // Breaking down the busStops into 2D array. Each array inside routeSwitches is a route a single bus can follow
        if (!busStop.change)
          routeSwitches[routeSwitches.length - 1].push(busStop);
        else {
          routeSwitches[routeSwitches.length - 1].push(busStop);
          routeSwitches.push([]);
          routeSwitches[routeSwitches.length - 1].push(busStop);
        }
        console.log("Route switches are: ", routeSwitches);
        const marker = L.marker([busStop.lat, busStop.lng]).addTo(map);
        marker
          .bindTooltip(`${idx + 1} ${busStop.stopName}`, {
            permanent: true,
          })
          .openTooltip();
      });
      // Drawing path between route stops
      routeSwitches.forEach(async (route) => {
        console.log("R", route);
        let coordinates = [];
        route.forEach((stop) => {
          coordinates.push([stop.lng, stop.lat]);
        });
        console.log(coordinates);
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
        console.log(res);
      });
      // console.log(routeSwitches);
      // busRouteList[data].forEach((route) => {
      //   let stops = route.route;
      //   console.log(stops);

      // });
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
