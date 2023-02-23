<template>
  <h2>This is a slide</h2>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
onMounted(() => {
  authStore.firstUse = false;
});
</script>
