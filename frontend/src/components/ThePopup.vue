<template>
    <div class="absolute inset-0 bg-black bg-opacity-10 flex">
        <div class="m-auto p-5 w-full mx-5 bg-white shadow-2xl">
            <slot> Ben je er zeker van? </slot>
            <div class="flex gap-5">
                <TheButton @click="emits('confirm', true)"> OK </TheButton>
                <TheButton @click="emits('cancel', false)"> Cancel </TheButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TheButton from "./TheButton.vue";

const emits = defineEmits<{
    (e: "confirm", value: boolean): void;
    (e: "cancel", value: boolean): void;
}>();
</script>
