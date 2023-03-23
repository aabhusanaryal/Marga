<template>
  <ion-page>
    <div class="loadingSpinner" v-if="showLoadingSpinner">
      <ion-spinner color="primary"></ion-spinner>
    </div>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>All Routes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="map-viewall"></div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonContent,
  IonPage,
  IonTitle,
  IonToolbar,
  IonHeader,
  onIonViewDidEnter,
  IonSpinner,
} from "@ionic/vue";
import { onMounted } from "vue";
import { createMapInstance } from "@/map";
import { useRouteStore } from "@/store/routeStore";
import { randomColorPicker } from "@/randomColorPicker";
import L from "leaflet";

let map;
const routeStore = useRouteStore();
onMounted(async () => {
  map = await createMapInstance(
    "map-viewall",
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
    // "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    // "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
  );
  routeStore.routeDetails.forEach(async (route) => {
    let coordinates = [];
    route.route.forEach((stop, idx) => {
      coordinates.push([stop.lng, stop.lat]);
      // Drawing bus icon marker at each stop
    });
    const bodyData = {
      coordinates,
    };
    // let res = await fetch(
    //   "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `${process.env.VUE_APP_ORS_API}`,
    //       "content-type": "application/json",
    //     },
    //     body: JSON.stringify(bodyData),
    //   }
    // );
    // res = await res.json();
    // console.log(
    //   JSON.parse(route.geojson).features[0].properties.summary.distance / 1000
    // );
    L.geoJSON(JSON.parse(route.geojson), {
      style: {
        // color: randomColorPicker(),
        color: "#150d66",
        weight: 5,
      },
    }).addTo(map);
  });
});
onIonViewDidEnter(() => {
  if (map) map.invalidateSize();
});
</script>

<style scoped>
#map-viewall {
  height: 100%;
}
</style>
