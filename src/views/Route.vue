<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <h1>Individual Route</h1>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="button">
                <ion-fab-button>
                <ion-icon :icon="thumbsUpOutline"></ion-icon>
                </ion-fab-button>
                <ion-fab-button>
                    <!-- <ion-icon name="chevron-up-circle"></ion-icon> -->
                    <ion-icon :icon="thumbsDownOutline"></ion-icon>
                    </ion-fab-button>
            </ion-fab>
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
    IonIcon,
} from "@ionic/vue";
import { thumbsUpOutline, thumbsDownOutline } from "ionicons/icons";
import Vue from 'vue'
    // const name= async()=>{
        
    // }
</script>

<style scoped>

</style>