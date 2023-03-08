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
            
            <!-- <ion-item>
                Number of bus changes: {{  }}</br>
                Distance:</br>
                Location for bus change:</br>
            </ion-item> -->
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
    IonButtons
} from "@ionic/vue";
import { useRoute } from 'vue-router';
import { useRouteStore } from '@/store/routeStore';

const route=useRoute()
const routeStore=useRouteStore();
const id:number= route.params.routeID;
const routeInfo = routeStore.routeDetails[id];


const upVote=()=>{
    console.log("Upvote");
    //increase the count for validity for a route.
}

const downVote=()=>{
    console.log("Downvote");
    //decrease the count for validity for a route.
}
console.log("Route ID: ",id)

</script>

<style>
</style>