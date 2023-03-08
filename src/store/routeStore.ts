import {defineStore} from "pinia";
import router from "@/router";
import { useLocalStorage } from "@vueuse/core";

export const useRouteStore=defineStore("route",()=>{
    let routeDetails = useLocalStorage("routeDetails",[]);
    let nodeDetails=useLocalStorage("nodeDetails", []);
    // let routeDetails=[];
    let detailsLoaded=useLocalStorage("detailsLoaded",false);
    // let detailsLoaded=false;


    return {
        routeDetails,
        detailsLoaded,
        nodeDetails
    };
});