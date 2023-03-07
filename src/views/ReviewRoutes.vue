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
          v-for="(n, idx) in result"
          :key="idx"
          @click="openRouteDetails(idx)"
        >
          <!-- <ion-item v-for="(n, idx) in 100" :key="idx" href="/tabs/review/routeID=${idx}"> -->
          <!-- <div id="indRoute"> -->
          <h1>{{ n }}</h1>
          <!-- </div> -->
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
} from "@ionic/vue";
import { search } from "ionicons/icons";
import SearchBar from "@/components/SearchBar.vue";
import { onMounted, ref } from "vue";
import router from "@/router";
let result = [
  { name: 1, data: "Hello" },
  { name: 2, data: "Mellow" },
  { name: 3, data: "Mohit" },
];
onMounted(async () => {
  console.log("Reached at review routes page.");
  // let res = await fetch(`https://marga-backend.onrender.com/getroutes`)
  // let res = await fetch(`https://marga-backend.onrender.com/getnodes`);
  // res = await res.json();
  // console.log(res);
  // result = res;
});

const openRouteDetails = (idx) => {
  console.log(`/tabs/review/${idx}`);
  router.push({ path: `/tabs/review/${idx}`, query: { data: result } });
};
</script>
<style scoped>
#indRoute {
  cursor: pointer;
}
</style>
