import {defineStore} from "pinia";
import router from "@/router";
import { useLocalStorage } from "@vueuse/core";

export const useRouteStore=defineStore("route",()=>{
    let routeDetails = useLocalStorage("routeDetails",[]);

    return {
        routeDetails
    };
});