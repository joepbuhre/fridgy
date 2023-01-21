<template>
    <div class="px-4 py-2">
        <h1 class="font-bold text-2xl">Fridgy</h1>
        <div v-for="item in data" class="flex relative my-6 justify-around border border-slate-400 p-1 rounded-sm">
            <!-- <span class="absolute top-5 right-5">3x</span> -->
            <div class="w-2/3">
                <h4 class="font-semibold">{{ ff?.product_name_nl }}</h4>
                <span>Vriezer</span>
                <div>
                    <span
                        class="bg-green-100 text-green-500 border border-green-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                    >
                        2 op voorraad</span
                    >
                </div>
            </div>
            <div class="w-auto">
                <div
                    class="text-red-700 bg-red-100 font-bold px-2 py-1 rounded-md"
                >
                    1 days
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { api } from "../utils/api";
import { ItemsInventory } from "@prisma/client";
import type { Product } from "../../../types/FoodProduct";
import type { ProductResponse } from "../../../types/FoodResponse";
import axios from "axios";

import * as ZXing from "@zxing/library";

const data = ref<ItemsInventory[] | null>(null);
const ff = ref<Product | null | undefined>(null);
const resultZX = ref<any>(null)

api.get("/items").then((res) => {
    data.value = res.data;
    console.log(res);
});

axios
    .get("https://world.openfoodfacts.org/api/v2/product/87338010.json")
    .then((res) => {
        const result: ProductResponse = res.data;
        ff.value = result.product;
    });

// or with ES6 modules
</script>
