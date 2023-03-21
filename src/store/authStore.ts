import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  let accessToken = useLocalStorage("accessToken", "");
  let userAuthenticated = useLocalStorage("userAuthenticated", false);
  let returnURL = useLocalStorage("returnURL", "");
  let tokenType = useLocalStorage("tokenType", "");
  let firstUse = useLocalStorage("firstUse", true);
  let username = useLocalStorage("username", "");
  let fullName = useLocalStorage("full_name", "");
  let emailAddress = useLocalStorage("emailAddress", "");
  let roles= useLocalStorage("roles",[]);

  return {
    accessToken,
    userAuthenticated,
    returnURL,
    tokenType,
    firstUse,
    username,
    fullName,
    emailAddress,
    roles,
  };
});
