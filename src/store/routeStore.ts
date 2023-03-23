import { defineStore } from "pinia";
import router from "@/router";
import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";

export const useRouteStore = defineStore("route", () => {
  let routeDetails = ref(useLocalStorage("routeDetails", []));
  let nodeDetails = useLocalStorage("nodeDetails", []);
  // let routeDetails=[];
  let detailsLoaded = useLocalStorage("detailsLoaded", false);
  // let detailsLoaded=false;

  const getRouteDetails = async () => {
    let busRouteList = await fetch(
      `${process.env.VUE_APP_BACKEND_URL}/getallroutes`,
      {
        method: "GET",
      }
    );
    let data = await busRouteList.json();
    busRouteList = data;
    // <Array>busRouteList
    // console.log("Bus Route List: ",busRouteList);
    routeDetails.value = data;
    console.log("The update route details are: ", routeDetails.value);
    return 1;
    // routeDetails.value = <Array>busRouteList;
  };

  return {
    routeDetails,
    detailsLoaded,
    nodeDetails,
    getRouteDetails,
  };
});
