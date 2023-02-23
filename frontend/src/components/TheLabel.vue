<template>
    <span
        class="border border-solid font-bold px-2 py-1 rounded-sm"
        :class="colorClass"
    >
        <slot></slot>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    color?: string;
}>();

const colorClass = computed(() => {
    switch (props.color) {
        case 'red':
            return 'border-red-700 text-red-700 bg-red-100'
        
        case 'green':
            return 'border-green-700 text-green-700 bg-green-100'
            
        default:
            return 'border-blue-700 text-blue-700 bg-blue-100'
    }
})

</script>
