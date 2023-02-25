<template>
  <ion-toolbar>
    <ion-searchbar
      animated="true"
      :placeholder="placeholder"
      @ionChange="searchbarChange"
      v-model="searchTerm"
      debounce="1000"
    />
    <ion-list v-if="resultsNameOnly">
      <ion-item
        v-for="(result, idx) in resultsNameOnly"
        :key="idx"
        @click="clickSearchResultItm(idx)"
      >
        <ion-label>{{ result }}</ion-label>
      </ion-item>
    </ion-list>
  </ion-toolbar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonSearchbar,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/vue";

const props = defineProps(["placeholder"]);
const emit = defineEmits(["clickSearchResultItm"]);

// Important flag. Used so that the searchbarChange doesnt trigger when the value of the searchBar is changed inside the clickSearchResultItm function
let justSearched = false;

// OpenRouteService API Key
const apiKey = process.env.VUE_APP_ORS_API;

//Whatever value is typed by the user in the search box.
const searchTerm = ref("");

// Stores search results
const results = ref([]);
const resultsNameOnly = ref([]);

const searchbarChange = async () => {
  if (justSearched) {
    justSearched = false;
    // console.log("just searched ")
    return;
  }
  if (searchTerm.value) {
    console.log(searchTerm.value)
    let res = await fetch(
      `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${searchTerm.value}&boundary.country=NP`
    );
    res = await res.json();
    // console.log(res)
    // res.features.forEach((ftr) => console.log(ftr.properties.name));
    results.value = res.features;
    console.log(results.value);
  } else {
    results.value = [];
  }
  resultsNameOnly.value = results.value.map((ftr) => ftr.properties.name);
};

const clickSearchResultItm = (idx) => {
  console.log(idx)
  emit("clickSearchResultItm", results.value[idx]);
  justSearched = true;
  searchTerm.value = resultsNameOnly.value[idx];
  // console.log("From click search result item",searchTerm.value)
  results.value = [];
  resultsNameOnly.value = [];
};
</script>

<style scoped>
ion-item {
  cursor: pointer;
}
</style>
