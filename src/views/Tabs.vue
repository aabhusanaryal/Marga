<template>
  <ion-page>
    <ion-content>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="home" href="/tabs/home">
            <ion-icon :icon="homeOutline" />
            <ion-label>Home</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="add" href="/tabs/add">
            <ion-icon :icon="addCircleOutline" />
            <ion-label>Add Routes</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="review" href="/tabs/review" :disabled="true">
            <ion-icon :icon="ribbonOutline" />
            <ion-label>Review Routes</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="profile" href="/tabs/profile">
            <ion-icon :icon="personCircleOutline" />
            <ion-label>Profile</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonContent,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import {
  homeOutline,
  personCircleOutline,
  addCircleOutline,
  ribbonOutline,
} from "ionicons/icons";
</script>
