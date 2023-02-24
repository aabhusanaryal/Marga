import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  let accessToken = useLocalStorage("accessToken", "");
  let userAuthenticated = useLocalStorage("userAuthenticated", false);
  let returnURL = useLocalStorage("returnURL", "");
  let tokenType = useLocalStorage("tokenType", "");
  let incorrect = false;
  let addRouteStops=[];
  let firstUse = useLocalStorage("firstUse", true);
  return {
    accessToken,
    userAuthenticated,
    returnURL,
    tokenType,
    incorrect,
    firstUse,
  };
});
