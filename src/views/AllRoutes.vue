<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Review Routes</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <SearchBar
          placeholder="Search"
          @clickSearchResultItm="clickSearchedBusStop"
        />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <!-- <ion-list v-if="!searchClicked"> -->
      <ion-list>
        <!-- <h1>he</h1> -->
        <!-- <ion-item v-for="(n, idx) in 100" :key="idx" href="/tabs/review/routeID"> -->
        <span
          v-for="(route, idx) in routeDetails"
          :key="idx"
          @click="openRouteDetails(idx)"
        >
          <ion-card mode="ios">
            <ion-card-header>
              <ion-card-title>
                <span v-if="route.route[0]"
                  >{{ route.route[0].name.slice(0, 15) }} -
                  {{
                    route.route[route.route.length - 1].name.slice(0, 15)
                  }}</span
                >
              </ion-card-title>
              <ion-card-subtitle>
                <ion-chip color="success" v-if="route.approved"
                  >Approved</ion-chip
                >
                <ion-chip color="warning" v-else>Under Review</ion-chip>
              </ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              Approved: {{ route.approved }} <br />Upvotes: {{ route.upvotes }}
              <br />Downvotes: {{ route.downvotes }} <br />Yatayat list:
              {{ route.yatayat }} <br />Vehicle Type: {{ route.vehicleTypes }}
            </ion-card-content>
          </ion-card>
        </span>
      </ion-list>
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
  IonList,
  onIonViewWillEnter,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonRefresher,
} from "@ionic/vue";
import { search } from "ionicons/icons";
import SearchBar from "@/components/SearchBar.vue";
import { onMounted, ref } from "vue";
import router from "@/router";
import { useRouteStore } from "@/store/routeStore";
import { storeToRefs } from "pinia";

// import RouteModal from "../components/DetailModal.vue"

const routeStore = useRouteStore();
let routeDetails;
let searchClicked = false;
let searchedTerm;

onIonViewWillEnter(() => {
  routeDetails = storeToRefs(routeStore).routeDetails;
  console.log(routeDetails);
  routeDetails.value = routeStore.routeDetails;
  searchClicked = false;
  console.log("Reached at review routes page.");
  // console.log(routeDetails.va)
});
setTimeout(() => {
  console.log("Route Details: ", routeDetails);
}, 5000);
const openRouteDetails = async (idx) => {
  console.log(`/tabs/review/${idx}`);
  router.push({ path: `/tabs/review/${idx}`, params: { idx } });
};

const handleRefresh = async (event: CustomEvent) => {
  await routeStore.getRouteDetails();
  event.target.complete();
};
//when cross button is clicked then set the search clicked back to false

const clickSearchedBusStop = (event) => {
  routeDetails.value = [];
  searchClicked = true;
  let stops;

  console.log("Before loop route info has: ", routeDetails.value);
  routeStore.routeDetails.forEach((rte) => {
    for (stops in rte.route) {
      if (
        rte.route[stops].lat == event.lat &&
        rte.route[stops].lng == event.lng
      ) {
        console.log(true);
        searchedTerm = rte.route[stops].name;

        routeDetails.value.push(rte);
        break;
      }
    }
    console.log("Route info has: ", routeDetails.value);
  });
};
</script>

<style scoped>
ion-item {
  cursor: pointer;
}
ion-item:hover {
  /* filter: hue-rotate(10, 10, 10); */
  transform: scale(1.005);
}
</style>
