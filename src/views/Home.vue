<template>
  <ion-page>
    <h1>This is tab 1</h1>
    <ion-content>
      <div id="map" @click="addMarker"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonContent,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { onMounted, computed, onUnmounted } from "vue";
import { Geolocation } from "@capacitor/geolocation";
import L from "leaflet";

// map object for leaflet
let map;
// current position of the user, updates if the user moves
const currentPosition = { latitude: 0, longitude: 0 };
// Geolocation watcher id
let watcherID;

onMounted(async () => {
  // Retreiving the current position of the user (Requires location permissions)
  let pos;
  try {
    pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
  } catch {
    console.log("1");
  }
  // catch (e) {
  //   if (e.code == 1) {
  //     alert("Please enable location access");
  //   } else {
  //     alert("There seems to be some error. Please try again later");
  //   }
  //   return;
  // }
  currentPosition.latitude = pos.coords.latitude;
  currentPosition.longitude = pos.coords.longitude;
  // Setting up leaflet to display the map inside div#map
  map = L.map("map").setView(
    [currentPosition.latitude, currentPosition.longitude],
    13
  );
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Adding a circle marker to user's current position
  let circleMarker = createCircleMarker().addTo(map);
  // Watching for position change of user
  watcherID = await Geolocation.watchPosition(
    {
      enableHighAccuracy: true,
    },
    (pos) => {
      if (pos) {
        currentPosition.latitude = pos.coords.latitude;
        currentPosition.longitude = pos.coords.longitude;
      }

      // Updating the circle marker whenever the user moves
      if (circleMarker) {
        map.removeLayer(circleMarker);
      }
      circleMarker = createCircleMarker().addTo(map);
      map.setView([currentPosition.latitude, currentPosition.longitude]);
    }
  );
  // To correct map size
  setTimeout(() => {
    map.invalidateSize();
  }, 500);

  // Adding a new marker to map every time a user clicks on any place
  map.on("click", function (ev) {
    const latlng = map.mouseEventToLatLng(ev.originalEvent);
    console.log(latlng.lat + ", " + latlng.lng);
    const marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
  });
});

onUnmounted(() => {
  // Removing the Geolocation watcher
  Geolocation.clearWatch({ id: watcherID });
});
// Returns a circle marker at currentPosition. This is not added to map though
const createCircleMarker = () =>
  L.circleMarker([currentPosition.latitude, currentPosition.longitude], {
    color: "blue",
    fillColor: "#1212ff",
    fillOpacity: 0.5,
    radius: 8,
  });
</script>

<style scoped>
#map {
  height: 100%;
}
</style>
