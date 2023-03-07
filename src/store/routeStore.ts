import {defineStore} from "pinia";
import router from "@/router";

export const useRouteStore=defineStore("route",()=>{
    let routeDetails = [];

    return {
        routeDetails
    };
});