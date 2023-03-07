<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Review Routes</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <SearchBar placeholder="Search" />
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <!-- <ion-item v-for="(n, idx) in 100" :key="idx" href="/tabs/review/routeID"> -->
        <ion-item
          v-for="(n, idx) in routeStore.routeDetails"
          :key="idx"
          @click="openRouteDetails(idx)"
        >
          <p>{{ n.route[0].name }} - {{ n.route[n.route.length-1].name }}</p>
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
</script>
<style scoped>

</style>
