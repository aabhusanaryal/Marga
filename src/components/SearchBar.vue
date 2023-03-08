<template>
  <ion-toolbar>
    <ion-searchbar
      animated="true"
      :placeholder="placeholder"
      @ionChange="searchbarChange"
      v-model="searchTerm"
      debounce="1"
      :disabled="disabled"
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
import { ref, onMounted } from "vue";
import {
  IonSearchbar,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/vue";

const props = defineProps(["placeholder"]);
const emit = defineEmits(["clickSearchResultItm"]);
let disabled = ref(true);
// OpenRouteService API Key
const apiKey = process.env.VUE_APP_ORS_API;

//Whatever value is typed by the user in the search box.
const searchTerm = ref("");

// Stores search results
const results = ref([]);
const resultsNameOnly = ref([]);

let noResultMsg = "No results found.";

// Important flag. Used so that the searchbarChange doesnt trigger when the value of the searchBar is changed inside the clickSearchResultItm function
let justSearched = false;

const searchbarChange = async () => {
  if (justSearched) {
    justSearched = false;
    console.log("just searched here ");
    return;
  }
  if (searchTerm.value) {
    results.value = [];
    result.forEach((res) => {
      if (res.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
        results.value.push(res);
    });
    //   let res = await fetch(`https://marga-backend.aabhusanaryal.com.np/getnodes`);
    //   res = await res.json();
    //   console.log(res);
    //   // res.features.forEach((ftr) => console.log(ftr.properties.name));
    //   results.value = res.features;
    //   // If no results are found
    //   if (!results.value.length)
    //     results.value.push({ properties: { name: noResultMsg } });
  } else {
    results.value = [];
  }
  console.log(results.value);
  resultsNameOnly.value = results.value.map((res) => res.name);
  console.log(resultsNameOnly.value);
};

const clickSearchResultItm = (idx) => {
  if (results.value[idx].name != noResultMsg) {
    emit("clickSearchResultItm", results.value[idx]);
    justSearched = true;
    searchTerm.value = resultsNameOnly.value[idx];
    results.value = [];
    resultsNameOnly.value = [];
  }
};
let result;
onMounted(async () => {
  let res = await fetch(`https://marga-backend.aabhusanaryal.com.np/getnodes`);
  res = await res.json();
  console.log(res);
  result = res;
  disabled.value = false;
});
</script>

<style scoped>
ion-item {
  cursor: pointer;
}
</style>
