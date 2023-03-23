<template>
  <ion-page>
    <div class="loadingSpinner" v-if="showLoadingSpinner">
      <ion-spinner color="primary"></ion-spinner>
    </div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- <ion-item>All the bus stops in this route are:</ion-item> -->
      <ion-card mode="ios">
        <ion-card-header>
          <ion-card-title> {{ routeInfo.name }} </ion-card-title>
          <ion-card-subtitle> </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <!-- <ion-chip color="success" v-if="routeInfo.approved"
            >Approved</ion-chip
          >
          <ion-chip color="warning" v-else>Under Review</ion-chip><br /> -->
          <!-- {{ routeInfo }} -->
          <!-- Name: {{ route.name }}<br />
          Approved: {{ routeInfo.approved }} <br />Upvotes:
          {{ routeInfo.upvotes }} <br />Downvotes: {{ routeInfo.downvotes }}
          <br />Yatayat list: {{ routeInfo.yatayat }} <br />Vehicle Type:
          {{ routeInfo.vehicleTypes }} -->
          <ion-list>
            <ion-item> Available Yatayat: {{ routeInfo.yatayat }} </ion-item>
            <ion-item>
              Estimated Distance:
              {{
                JSON.parse(routeInfo.geojson).features[0].properties.summary
                  .distance / 1000
              }}
              km
            </ion-item>
            <ion-item>
              Estimated Fare: Rs
              {{
                calculateFare(
                  JSON.parse(routeInfo.geojson).features[0].properties.summary
                    .distance / 1000
                )
              }}
            </ion-item>
          </ion-list>
          <strong> The intermediate stops are: </strong>
          <ion-list>
            <ion-item v-for="(stop, idx) in routeInfo.route" :key="idx">
              <ion-label> {{ idx + 1 }}. {{ stop.name }} </ion-label>
            </ion-item>
          </ion-list>
          <em
            >* The distance and bus fare are estimated quantity and may not be
            accurate.</em
          >
          <ion-buttons>
            <ion-button @click="upVote()">UPVOTE</ion-button>
            <ion-button @click="downVote()">DOWNVOTE</ion-button>
          </ion-buttons>
        </ion-card-content>
      </ion-card>
    </ion-content>
    <div v-if="isAdmin">
      <ion-fab vertical="bottom" horizontal="end">
        <ion-fab-button>
          <ion-icon :icon="chevronUp"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button @click="publish()">
            <ion-icon :icon="save"></ion-icon>
          </ion-fab-button>
          <ion-fab-button @click="del()">
            <ion-icon :icon="trashBin"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import Vue from "vue";
import {
  IonContent,
  IonPage,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonItem,
  IonList,
  IonButton,
  IonButtons,
  toastController,
  IonFab,
  IonSpinner,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonBackButton,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonLabel,
} from "@ionic/vue";
import { chevronUp, save, trashBin } from "ionicons/icons";

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useRouteStore } from "@/store/routeStore";
import { useAuthStore } from "@/store/authStore";
import { ref } from "vue";

const authStore = useAuthStore();
// authStore.role="admin";
const route = useRoute();
const router = useRouter();
const routeStore = useRouteStore();
const idx: number = route.params.routeID;
const routeInfo = routeStore.routeDetails[idx];
const routeID = routeInfo.route_id;
let text = "Thank you for voting!";
let route_id, vote_type;

let isAdmin = authStore.roles.includes("admin");
console.log(authStore.roles);
console.log(isAdmin);

const votingDetails = {
  route_id: routeID,
  vote_type: "upvote",
};
const routeDetailID = {
  route_id: routeID,
};
let showLoadingSpinner = ref(false);

const del = async () => {
  console.log("Delete as admins");

  console.log(routeDetailID);
  showLoadingSpinner.value = true;
  let res = await fetch(`${process.env.VUE_APP_BACKEND_URL}/deleteroute`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authStore.accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(routeDetailID),
  });
  res = await res.json();
  console.log("response from delete:", res);
  await routeStore.getRouteDetails();
  showLoadingSpinner.value = false;
  router.back();
  // // artificial delay :(
  // setTimeout(() => {
  //   showLoadingSpinner.value = true;
  //   router.back();
  // }, 100);
};

const publish = async () => {
  console.log("Publised by admin");
  showLoadingSpinner.value = true;
  let res = await fetch(`${process.env.VUE_APP_BACKEND_URL}/approve`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${authStore.accessToken}`,
    },
    body: JSON.stringify(routeDetailID),
  });
  res = await res.json();
  await routeStore.getRouteDetails();
  showLoadingSpinner.value = false;
  router.back();
  // // artificial delay :(
  // setTimeout(() => {
  //   showLoadingSpinner.value = true;
  //   router.back();
  // }, 100);
  console.log(res);
};

const upVote = async () => {
  votingDetails.vote_type = "upvote";
  console.log(votingDetails);
  //send user details token as well store user details as well
  //check if this user has already voted for that route or not

  let res = await fetch(`${process.env.VUE_APP_BACKEND_URL}/vote`, {
    method: "POST",
    body: JSON.stringify(votingDetails),
    headers: {
      "content-type": "application/json",
    },
  });
  res = await res.json();
  console.log(res);
  console.log("Upvote");
  router.push("/tabs/review");
  presentToast("bottom", text);
};

const presentToast = async (position: "top" | "middle" | "bottom", text) => {
  const toast = await toastController.create({
    message: text,
    duration: 1500,
    position: position,
  });

  await toast.present();
};

const downVote = async () => {
  votingDetails.vote_type = "downvote";
  console.log(votingDetails);
  let res = await fetch(`${process.env.VUE_APP_BACKEND_URL}/vote`, {
    method: "POST",
    body: JSON.stringify(votingDetails),
    headers: { "content-type": "application/json" },
  });
  res = await res.json();
  console.log(res);
  console.log("Downvote");
  router.push("/tabs/review");
  presentToast("bottom", text);
};
console.log("Route ID: ", routeID);

const calculateFare = (distance) => {
  if (distance > 0 && distance <= 5) return 18;
  else if (distance > 5 && distance <= 10) return 23;
  else if (distance > 10 && distance <= 15) return 27;
  else if (distance > 15 && distance <= 20) return 30;
  else return 35;
};
</script>

<style scoped>
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
