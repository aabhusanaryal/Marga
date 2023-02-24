<template>
  <!-- <ion-page> -->
    <ion-content fullscreen class="ion-padding container" scroll-y="false" >
  <!-- <swiper
    :slides-per-view="3"
    :space-between="50"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
    <swiper-slide>Slide 1</swiper-slide>
    <swiper-slide>Slide 2</swiper-slide>
    <swiper-slide>Slide 3</swiper-slide>
  </swiper> -->
  <swiper :autoplay="true" :keyboard="true" :pagination="true" :zoom="true" class="swiper" >
        <swiper-slide>
         <div class="slide">
              <img src="https://images-ext-1.discordapp.net/external/pTn0vew6xvHmfPZ-f4ProKunzDfCYNV-iruuDomaGdg/https/ionicframework.com/docs/demos/api/slides/slide-1.png" />
              <h2>Welcome</h2>
              <p>
                The <b>ionic conference app</b> is a practical preview of the ionic framework in action, and a
                demonstration of proper code use.
              </p>
            </div>
          </swiper-slide>
        <swiper-slide>
          <div class="slide">
              <img src="https://images-ext-1.discordapp.net/external/pTn0vew6xvHmfPZ-f4ProKunzDfCYNV-iruuDomaGdg/https/ionicframework.com/docs/demos/api/slides/slide-1.png" />
              <h2>Welcome</h2>
              <p>
                The <b>ionic conference app</b> is a practical preview of the ionic framework in action, and a
                demonstration of proper code use.
              </p>
            </div>
        </swiper-slide>
        <swiper-slide>
        <div class="slide">
              <img src="https://images-ext-1.discordapp.net/external/pTn0vew6xvHmfPZ-f4ProKunzDfCYNV-iruuDomaGdg/https/ionicframework.com/docs/demos/api/slides/slide-1.png" />
              <h2>Welcome</h2>
              <p>
                The <b>ionic conference app</b> is a practical preview of the ionic framework in action, and a
                demonstration of proper code use.
              </p>
              <ion-button fill="clear">Continue <ion-icon slot="end" :icon="arrowForward"></ion-icon></ion-button>
            </div>
        </swiper-slide>
      </swiper>
    </ion-content>
  <!-- </ion-page> -->
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper';
import {Swiper, SwiperSlide} from "swiper/vue"
import {IonIcons} from '@ionic/vue'
import {arrowForward} from 'ionicons/icons'
// import 'swiper/css';

import 'swiper/css';
  import 'swiper/css/autoplay';
  import 'swiper/css/keyboard';
  import 'swiper/css/pagination';
  import 'swiper/css/scrollbar';
  import 'swiper/css/zoom';
  import '@ionic/vue/css/ionic-swiper.css';
const authStore = useAuthStore();

const onSwiper = (swiper) => {
  console.log(swiper);
};
const onSlideChange = () => {
  console.log('slide change');
};

const closeTutorial=()=>{
  authStore.firstUse=false;
}

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
.container{
  position:absolute;
  height:100%;
  

}
</style>