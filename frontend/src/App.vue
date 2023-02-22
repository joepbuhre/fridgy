<template>    
    <div class="px-4 py-2">
        <router-link to="/" ><h1 class="font-bold text-2xl flex items-center" ><Refrigerator/> Fridgy</h1></router-link>
        <router-view />
    </div>
</template>

<script setup lang="ts">

import { Refrigerator } from 'lucide-vue-next'
</script>