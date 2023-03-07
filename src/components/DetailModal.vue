<template>
    <div class="loadingSpinner" v-if="showLoadingSpinner">
        <ion-spinner color="primary"></ion-spinner>
    </div>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Details</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="confirm">Done</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-item>The intermediate bus stops are:</ion-item>
        <ion-list>
            <ion-item v-for="(stop, idx) in routeInfo.route" :key="idx">
                {{ idx + 1 }}. {{ stop.stopName }}
            </ion-item>
        </ion-list>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button>
                <ion-icon :icon="thumbsUpOutline" @click="upVote()"></ion-icon>
            </ion-fab-button>
            <ion-fab-button>
                    <ion-icon :icon="thumbsDownOutline"></ion-icon>
                </ion-fab-button>
        </ion-fab>
    </ion-content>
</template>

<script setup lang="ts">
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    modalController,
    IonList,
    IonIcon,
    IonSpinner,
} from "@ionic/vue";

import {
    thumbsUpOutline,
    thumbsDownOutline
} from "ionicons/icons"

import { ref, defineEmits } from "vue";
import { useAuthStore } from "@/store/authStore";

const authStore=useAuthStore();
const props = defineProps(["idx"]);
const routeInfo = authStore.routeDetails[props.idx]

let showLoadingSpinner = ref(false);

const cancel = () => {
    
    return modalController.dismiss(null, "cancel");
};

const confirm = async () => {
    
    return modalController.dismiss("confirm");
};

const upVote=async()=>{
    //need to increase the count of route validity. --fetch(post)?
2
    console.log("Upvote this route")
}

const downVote=async()=>{
    //need to decrease the count of route validity. --fetch(post)
    console.log("Downvote this route.")
}

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
