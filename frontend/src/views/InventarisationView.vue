<template>
    <TheScanner @found="onFound" />
</template>

<script setup lang="ts">
import TheScanner from '../components/TheScanner.vue';

const onFound = (e: any) => {
    console.log(e)
}

</script>