<template>
    <ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-title>Route details page.</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-item>All the bus stops in this route are:</ion-item>
            <ion-list>
                <ion-item v-for="(stop, idx) in routeInfo.route" :key="idx">
                    {{ idx + 1 }}. {{ stop.name }}
                </ion-item>
            </ion-list>
            <ion-buttons>
                <ion-button @click="upVote()">UPVOTE</ion-button>
                <ion-button @click="downVote()">DOWNVOTE</ion-button>
            </ion-buttons>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import Vue from 'vue'
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
    toastController
} from "@ionic/vue";
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useRouteStore } from '@/store/routeStore';

const route=useRoute()
const router=useRouter()
const routeStore=useRouteStore();
const id:number= route.params.routeID;
const routeInfo = routeStore.routeDetails[id];
let text="Thank you for voting!";
let route_id, vote_type;

const votingDetails={
    route_id:id,
    vote_type:"upvote"
}

const upVote=async ()=>{
    votingDetails.vote_type="upvote";
    console.log(votingDetails)
    //send user details token as well store user details as well
    //check if this user has already voted for that route or not 

    let res=await fetch("https://marga-backend.aabhusanaryal.com.np/vote",{
        method:"POST",
        body:JSON.stringify(votingDetails),
        headers:{"content-type":"application/json"}
    })
    res=await res.json();
    console.log(res);
    console.log("Upvote");
    router.push("/tabs/review");
    presentToast("bottom", text);
}

const presentToast = async (position: "top" | "middle" | "bottom", text) => {
    const toast = await toastController.create({
        message: text,
        duration: 1500,
        position: position,
    });

    await toast.present();
};

const downVote=async ()=>{
    votingDetails.vote_type = "downvote";
    console.log(votingDetails)
    let res = await fetch("https://marga-backend.aabhusanaryal.com.np/vote", {
        method: "POST",
        body: JSON.stringify(votingDetails),
        headers: { "content-type": "application/json" }
    })
    res = await res.json();
    console.log(res);
    console.log("Downvote");
    router.push("/tabs/review");
    presentToast("bottom", text);
}
console.log("Route ID: ",id)

</script>

<style>
</style>