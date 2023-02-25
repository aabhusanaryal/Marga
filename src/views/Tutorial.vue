<template>
  <!-- <ion-page> -->
  <ion-content
    fullscreen
    class="ion-padding container"
    scroll-y="false"
    v-if="showSlides"
  >
    <swiper
      :autoplay="true"
      :keyboard="true"
      :pagination="true"
      :zoom="true"
      class="swiper"
    >
      <swiper-slide>
        <div class="slide">
          <img
            src="../logo.png"
          />
          <h1>MARGA</h1>
          <p>
            Your new travel <b> best friend</b>.
          </p>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide">
          <img
            src="../search.png"
          />
          <h2>Bus Routes</h2>
          <p>
            Enter your starting and ending destinations, and we'll show you all the bus routes that connect them. <br/><b><i>It's that easy!</i></b> 
          </p>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide">
          <img
            src="https://images-ext-1.discordapp.net/external/pTn0vew6xvHmfPZ-f4ProKunzDfCYNV-iruuDomaGdg/https/ionicframework.com/docs/demos/api/slides/slide-1.png"
          />
          <h2>Add Routes</h2>
          <p>
            Share your <i>insider</i> knowledge! With our app, you can add bus routes you know, 
            making our service even more comprehensive. Join our community of savvy travelers.
          </p>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide">
          <img
            src="https://images-ext-1.discordapp.net/external/pTn0vew6xvHmfPZ-f4ProKunzDfCYNV-iruuDomaGdg/https/ionicframework.com/docs/demos/api/slides/slide-1.png"
          />
          <h2>Review Routes</h2>
          <p>
             You can also review routes added by others and discover new ways to get around. 
          </p>
          <ion-button fill="clear" @click="closeTutorial"
            >Continue <ion-icon slot="end" :icon="arrowForward"></ion-icon
          ></ion-button>
        </div>
      </swiper-slide>
    </swiper>
  </ion-content>
  <!-- </ion-page> -->
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { IonIcons } from "@ionic/vue";
import { arrowForward } from "ionicons/icons";
import { useRouter } from "vue-router";
// import 'swiper/css';

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";
import "@ionic/vue/css/ionic-swiper.css";
import { ref } from "vue";
const authStore = useAuthStore();
const router = useRouter();
let showSlides = ref(true);
const onSwiper = (swiper) => {
  console.log(swiper);
};
const onSlideChange = () => {
  console.log("slide change");
};

const closeTutorial = () => {
  showSlides.value = false;
  router.push({ name: "Home" });
};
</script>

<style scoped>
.swiper {
  height: 100%;
}

swiper-slide {
  display: block;
  /* height: 100%; */
}

swiper-slide h2 {
  margin-top: 2.8rem;
}

swiper-slide img {
  max-height: 50%;
  max-width: 80%;
  margin: 60px 0 40px;
  pointer-events: none;
}

b {
  font-weight: 500;
}

p {
  padding: 0 40px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ion-color-step-600, #60646b);
}

p b {
  color: var(--ion-text-color, #000000);
}
</style>
