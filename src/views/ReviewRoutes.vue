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
          <h5 v-if="n.route[0]">{{ n.route[0].name }} - {{ n.route[n.route.length-1].name }}</h5>
          
          <!-- <span v-if="searchClicked">
            <span v-for="stops,i in n.route" :key="i">
              <span v-if="searchedTerm===stops.name">
                <br/>
                <p>{{ i+1 }}: {{ stops.name }}</p>
              </span>
            </span>
          </span> -->
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

routeInfo.value=routeStore.routeDetails;

onIonViewWillEnter(()=>{
  routeInfo.value=routeStore.routeDetails;
  searchClicked=false;
    console.log("Reached at review routes page.");
})

const openRouteDetails = async (idx) => {
  console.log(`/tabs/review/${idx}`)
  router.push({path:`/tabs/review/${idx}`,params:{idx}})
};

//when cross button is clicked then set the search clicked back to false

const clickSearchedBusStop=(event)=>{
  routeInfo.value=[]
  searchClicked=true;
  let stops;

  console.log("Before loop route info has: ", routeInfo.value)
  routeStore.routeDetails.forEach((rte)=>{
    for (stops in rte.route){
      if(rte.route[stops].lat==event.lat && rte.route[stops].lng == event.lng){
        console.log(true)
        searchedTerm=rte.route[stops].name

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
