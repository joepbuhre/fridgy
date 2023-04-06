<template>
    <div
        v-if="show"
        class="fixed inset-0 bg-black bg-opacity-20 h-screen w-screen"
        :style="style"
    ></div>
</template>
<script setup lang="ts">
import { StyleValue } from "vue";

const props = defineProps<{
    show: boolean;
    style?: StyleValue;
}>();
</script>
