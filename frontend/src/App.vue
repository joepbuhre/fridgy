<template>
    <TheHeader />  
    <div class="px-4 py-2">
        <router-view />
    </div>
</template>

<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import { Refrigerator } from 'lucide-vue-next'
</script>