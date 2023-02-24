import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/home",
  },
  {
    path: "/slides",
    component: () => import("@/views/Slides.vue"),
  },
  {
    path: "/account",
    component: () => import("@/views/Login.vue"),
  },
  {
    path:"/register",
    component:()=>import ("@/views/Register.vue")
  },
  {
    path: "/tabs/",
    component: import("@/views/Tabs.vue"),
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
    ],
  },
  {
    path:'/:pathMatch(.*)*', redirect:'/'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  //will be called in every navigation:
  const authStore = useAuthStore();
  const publicPages = ["/account", "/tabs/home","/register"];
  // Auth is requrired if the page about to be visited is not in publicPages
  const authRequired = !publicPages.includes(to.path);

  console.log("Information about the current page: ");
  console.log("Current path: ", to.path);
  console.log("Authentication Required: ", authRequired);
  console.log("User is logged in: ", authStore.userAuthenticated);
  console.log("User incorrect: ", authStore.incorrect)

  // Yedi page ma auth chainxa vane ani user authenticated xaina vane redirect to login
  if (authRequired && !authStore.userAuthenticated) {
    console.log("Redirecting to the account page.");
    authStore.returnURL = to.fullPath;
    return "/account";
  }
});

export default router;
