<template>
    <span
        class="border border-solid font-bold px-2  rounded-sm"
        :class="colorClass"
    >
        <slot></slot>
    </span>
</template>

<script setup lang="ts">
import { isObject, isString } from "@vue/shared";
import { computed } from "vue";

const props = defineProps<{
    color?: string | {[key: string]: boolean};
}>();

const colorClass = computed(() => {
    let color: string
    if(isString(props.color)) {
        color = props.color
    } else if(props.color)  {
        color = Object.entries(props.color).filter(el => el[1])?.[0]?.[0] || ''
    } else {
        color = ''
    }

    console.log(props.color)

    switch (color) {
        case 'red':
            return 'border-red-700 text-red-700 bg-red-100'
        
        case 'green':
        return 'border-green-700 text-green-700 bg-green-100'
        
        case 'yellow':
            return 'border-yellow-700 text-yellow-700 bg-yellow-100'
        
        default:
            return 'border-blue-700 text-blue-700 bg-blue-100'
    }
})

</script>
