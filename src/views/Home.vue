<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <SearchBar
          placeholder="Start Node"
          @clickSearchResultItm="clickSearchResultItm"
        />
      </ion-toolbar>
      <ion-toolbar>
        <SearchBar placeholder="Destination Node" />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="map-home" @click="addMarker"></div>
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
  IonSearchbar,
  alertController,
} from "@ionic/vue";
import { onMounted, computed, onUnmounted } from "vue";
import { Geolocation } from "@capacitor/geolocation";
import L from "leaflet";

// Imports other than leaflet
import SearchBar from "@/components/SearchBar.vue";

// Logic code starts
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
  } catch (e) {
    if (e.code == 1) {
      await alertRequestLocationPermission();
    }
    return;
  }
  currentPosition.latitude = pos.coords.latitude;
  currentPosition.longitude = pos.coords.longitude;
  // Setting up leaflet to display the map inside div#map-home
  map = L.map("map-home").setView(
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

// This function is run if the location permissions have not yet been granted. It is called inside onMounted.
// Once the user pressed OK on the alert, location permissions are requested.
const alertRequestLocationPermission = async () => {
  const alert = await alertController.create({
    header: "Alert",
    subHeader: "Grant Location Permission",
    message:
      "Please grant location permissions to the application for proper functioning.",
    buttons: [
      {
        text: "OK",
        role: "accept",
        cssClass: "secondary",
        handler: () => {
          Geolocation.requestPermissions();
        },
      },
    ],
  });

  await alert.present();
};

// Logic other than leaflet go below this

const clickSearchResultItm = (event) => {
  console.log(event);
  const marker = L.marker([
    event.geometry.coordinates[1],
    event.geometry.coordinates[0],
  ]).addTo(map);
  map.flyTo([event.geometry.coordinates[1], event.geometry.coordinates[0]], 16);
  console.log([event.geometry.coordinates[1], event.geometry.coordinates[0]]);
};
</script>

<style scoped>
#map-home {
  height: 100%;
}
</style>
