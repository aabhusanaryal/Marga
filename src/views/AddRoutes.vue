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
  toastController,
} from "@ionic/vue";
import { chevronUp, save, arrowUndo, trashBin } from "ionicons/icons";
import { onMounted, ref } from "vue";
import L from "leaflet";
import { createMapInstance } from "@/map";
import SearchBar from "@/components/SearchBar.vue";
// import { useRouter } from "vue-router";
import Modal from "../components/RouteSaveModal.vue";
import { useAuthStore } from "../store/authStore";
import { removeProperties } from "@babel/types";

const authStore = useAuthStore();

// map object for leaflet
let map;
let busStops: { lat: number; lng: number; marker: any; name: string }[] = [];

onMounted(async () => {
  map = await createMapInstance("map-add");
  // Adding a new marker to map every time a user clicks on any place
  map.on("click", async (event) => {
    const latlng = map.mouseEventToLatLng(event.originalEvent);
    const marker = L.marker([latlng.lat, latlng.lng]).addTo(map);

    // Reverse geocoding
    let url = "https://api.openrouteservice.org/pois";
    let bodyData = {
      request: "pois",
      geometry: {
        geojson: { type: "Point", coordinates: [latlng.lng, latlng.lat] },
        buffer: 200,
      },
      filters: {
        category_ids: [607, 608, 609, 610],
      },
    };
    let geoJSON, stopName;
    try {
      geoJSON = await fetch(url, {
        method: "POST",
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          "Content-Type": "application/json",
          Authorization: `${process.env.VUE_APP_ORS_API}`,
        },
        body: JSON.stringify(bodyData),
      });
      geoJSON = await geoJSON.json();
      console.log(geoJSON);
      stopName = geoJSON.features[0].properties.osm_tags.name;
    } catch {
      geoJSON = await fetch(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${process.env.VUE_APP_ORS_API}&point.lon=${latlng.lng}&point.lat=${latlng.lat}`
      );
      geoJSON = await geoJSON.json();
      console.log("Seconf", geoJSON);
      stopName = geoJSON.features[0].properties.label;
    }
    busStops.push({ lat: latlng.lat, lng: latlng.lng, stopName, marker });
    marker.bindTooltip(stopName, { permanent: true }).openTooltip();
    // console.log(busStops);
  });

  // Keyboard Shortcuts
  // Ctrl + Z
  document.addEventListener("keydown", (e) => {
    if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // present "Save Page" from getting triggered.
      undoMarker();
    }
  });
  // Ctrl + S
  document.addEventListener("keydown", (e) => {
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // present "Save Page" from getting triggered.
      saveData();
    }
  });
});

onIonViewDidEnter(() => {
  if (map) map.invalidateSize();
});

const clickSearchResultItm = (event) => {
  console.log(event);
  map.flyTo([event.lat, event.lng], 17);
  // console.log([event.geometry.coordinates[1], event.geometry.coordinates[0]]);
};

// Code other than leaflet:
// let start;

let showLoadingSpinner = ref(false);
const saveData = async () => {
  if (busStops.length > 1) {
    console.log("true");
    const modal = await modalController.create({
      component: Modal,
      componentProps: { busStops },
      breakpoints: [0, 0.5, 0.75, 0.95, 1],
      initialBreakpoint: 0.95,
    });

    modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === "confirm") {
      console.log("Dismiss");
      map.eachLayer((layer) => {
        // Removing everything other than the tile layer
        // PS: Only the tile layer has _url
        if (!layer._url) map.removeLayer(layer);
      });
      busStops = [];
    }
  } else {
    console.log("false");
    presentToast("middle", "Please enter the bus stops!");
  }
};

const undoMarker = (e = "") => {
  console.log("Undo marker", e);
  if (busStops.length) {
    let stop = busStops.pop();
    map.removeLayer(stop?.marker);
  }
  // Not closing the fab when undo is pressed
  if (busStops.length && e) e.stopImmediatePropagation();
};

const deleteMarkers = () => {
  // Removing all bus stops and their markers
  while (busStops.length) {
    let stop = busStops.pop();
    map.removeLayer(stop?.marker);
  }
};

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
