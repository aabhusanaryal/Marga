import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const routes: Array<RouteRecordRaw> = [
  {
    name: "Home",
    path: "/",
    redirect: "/tabs/home",
  },
  {
    path: "/slides",
    component: () => import("@/views/Tutorial.vue"),
  },
  {
    path: "/tabs/",
    component: () => import("@/views/Tabs.vue"),
    children: [
      {
        path: "",
        redirect: "home",
      },
      {
        path: "home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "profile",
        component: () => import("@/views/Profile.vue"),
      },
      {
        path: "add",
        component: () => import("@/views/AddRoutes.vue"),
      },
      {
        path: "review",
        component: () => import("@/views/ReviewRoutes.vue"),
      },
      {
        path: "login",
        component: () => import("@/views/Login.vue"),
      },
      {
        path: "register",
        component: () => import("@/views/Register.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  //will be called in every navigation:
  const authStore = useAuthStore();
  const publicPages = [
    "/tabs/login",
    "/tabs/home",
    "/tabs/register",
    "/slides",
  ];
  // Auth is requrired if the page about to be visited is not in publicPages
  const authRequired = !publicPages.includes(to.path);

  console.log("Information about the current page: ");
  console.log("Current path: ", to.path);
  console.log("Authentication Required: ", authRequired);
  console.log("User is logged in: ", authStore.userAuthenticated);
  console.log("First time user: ", authStore.firstUse);

  if (authStore.firstUse) {
    authStore.firstUse = false;
    router.push("/slides");
  }
  // Yedi page ma auth chainxa vane ani user authenticated xaina vane redirect to login
  if (authRequired && !authStore.userAuthenticated) {
    console.log("Redirecting to the login page.");
    authStore.returnURL = to.fullPath;
    return "/tabs/login";
  }
});

export default router;
