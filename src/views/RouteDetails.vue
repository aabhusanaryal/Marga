<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Individual Route</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="button">
        <ion-fab-button>
          <ion-icon :icon="thumbsUpOutline"></ion-icon>
        </ion-fab-button>
        <ion-fab-button>
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
  IonToolbar,
  IonHeader,
  IonIcon,
  IonTitle,
} from "@ionic/vue";
import { thumbsUpOutline, thumbsDownOutline } from "ionicons/icons";
import Vue from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
console.log("Params:", route.query.data);
</script>

<style scoped></style>
