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
      <ion-list v-if="!searchClicked">
        <!-- <ion-item v-for="(n, idx) in 100" :key="idx" href="/tabs/review/routeID"> -->
        <ion-item
          v-for="(n, idx) in routeStore.routeDetails"
          :key="idx"
          @click="openRouteDetails(idx)"
        >
          <p>{{ n.route[0].name }} - {{ n.route[n.route.length-1].name }}</p>
        </ion-item>
      </ion-list>

      <ion-list  v-if="searchClicked">
        <h1>search clicked is true</h1>
        <ion-item v-for="idx,i in viewRouteID"
        :key="i"
        @click="openRouteDetails(idx)">
        <h1>{{ idx }}</h1>
          <p>{{ routeStore.routeDetails[idx].route[0].name }} - {{ routeStore.routeDetails[idx].route[routeStore.routeDetails[idx].route.length - 1].name }}</p>
        </ion-item>
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
  modalController,
  IonItem,
  IonList,
} from "@ionic/vue";
import { search } from "ionicons/icons";
import SearchBar from "@/components/SearchBar.vue";
import { onMounted, ref } from "vue";
import router from "@/router";
import { useRouteStore } from "@/store/routeStore";

// import RouteModal from "../components/DetailModal.vue"

const routeStore=useRouteStore();
onMounted(async () => {
  console.log("Reached at review routes page.");
});

const openRouteDetails = async (idx) => {
  // const modal=await modalController.create({
  //   component: RouteModal,
  //   componentProps:{idx},
  //   breakpoints:[0,0.5, 0.75, 0.95, 1],
  //   initialBreakpoint: 0.95
  // });

  // modal.present();
  console.log(`/tabs/review/${idx}`)
  router.push({path:`/tabs/review/${idx}`,params:{idx}})
};

//when cross button is clicked then set the search clicked back to false
let routes,stops;
let searchClicked=false;

const clickSearchedBusStop=(event)=>{
  searchClicked=true;
  let index = 0;
  let viewRouteID: [] = [];
  console.log("clicked on search button from review routes ",event.lng, event.lat);
  for (routes in routeStore.routeDetails){
    for (stops in routeStore.routeDetails[routes].route){
      if (routeStore.routeDetails[routes].route[stops].lat == event.lat && routeStore.routeDetails[routes].route[stops].lng == event.lng) {
        viewRouteID.push(index);
        break;
      }
    }
    index=index+1;
  }
  console.log(viewRouteID)

}

</script>

<style scoped>

</style>
