<template>
    <div class="md:flex">
        <TheHeader />  
        <div class="px-4 py-2 bg-white md:w-full">
            <router-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
</script>