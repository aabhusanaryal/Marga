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
      <!-- <ion-list v-if="!searchClicked"> -->
      <ion-list>
        <!-- <ion-item v-for="(n, idx) in 100" :key="idx" href="/tabs/review/routeID"> -->
        <ion-item
          v-for="(n, idx) in routeInfo"
          :key="idx"
          @click="openRouteDetails(idx)"
        >
          <h5>{{ n.route[0].name }} - {{ n.route[n.route.length-1].name }}</h5>
          <br/>
          <ion-item v-if="searchClicked">
            <ion-item v-for="stops,i in n.route" :key="i">
              <ion-item v-if="searchedTerm===stops.stopName">
                <br/>
                <p>{{ i+1 }}: {{ stops.stopName }}</p>
                <!-- <h1>Reached here</h1> -->
              </ion-item>
            </ion-item>
          </ion-item>
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
  onIonViewWillEnter,
} from "@ionic/vue";
import { search } from "ionicons/icons";
import SearchBar from "@/components/SearchBar.vue";
import { onMounted, ref } from "vue";
import router from "@/router";
import { useRouteStore } from "@/store/routeStore";

// import RouteModal from "../components/DetailModal.vue"

const routeStore=useRouteStore();
let routeInfo = ref([]);
let searchClicked = false;
let searchedTerm;
// let busStopName;

// let stop = [{
  // id:"route index/id",
//   name: "Stop name",
//   num: 0
// }]

routeInfo.value=routeStore.routeDetails;

onMounted(async () => {
  console.log("Reached at review routes page.");
});

onIonViewWillEnter(()=>{
  routeInfo.value=routeStore.routeDetails;
  searchClicked=false;
})

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

const clickSearchedBusStop=(event)=>{
  routeInfo.value=[]
  console.log("Before loop route info has: ", routeInfo.value)
  searchClicked=true;
  // for (routes in routeStore.routeDetails){
  //   for (stops in routeStore.routeDetails[routes].route){
  //     if (routeStore.routeDetails[routes].route[stops].lat == event.lat && routeStore.routeDetails[routes].route[stops].lng == event.lng) {
  //       viewRouteID.push(index);
  //       break;
  //     }
  //   }
  //   index=index+1;
  // }
  let stops;

  routeStore.routeDetails.forEach((rte)=>{
    for (stops in rte.route){
      if(rte.route[stops].lat==event.lat && rte.route[stops].lng == event.lng){
        console.log(true)
        // busStopName=
        routeInfo.value.push(rte)
        break
      }
    }
    console.log("Route info has: ",routeInfo.value)
  })  

}

</script>

<style scoped>

</style>
