<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Product } from "../../../types/FoodProduct";
import type { ProductResponse } from "../../../types/FoodResponse";
import { api } from "../utils/api";

const product = ref<Product | undefined>(undefined)

api.get('/items/:ean')

</script>