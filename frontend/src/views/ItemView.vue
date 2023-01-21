<template>
    <div v-for="item in inventory">
            <div
                class="flex relative my-6 justify-around border border-slate-400 p-1 rounded-sm"
            >
                <div class="w-2/3">
                    <h4 class="font-semibold">{{ productInfo?.product_name_nl }}</h4>
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
import { ItemsInventory } from ".prisma/client";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { Product } from "../../../types/FoodProduct";
import type { ProductResponse } from "../../../types/FoodResponse";
import { api } from "../utils/api";

const productInfo = ref<Product | undefined>(undefined);
const inventory = ref<ItemsInventory | undefined>(undefined)

const route = useRoute();

onMounted(() => {
    api.get(`/items/${route.params.EAN}`).then((res) => {
        inventory.value = res.data;
    });
    
axios
    .get("https://world.openfoodfacts.org/api/v2/product/87338010.json")
    .then((res) => {
        const result: ProductResponse = res.data;
        productInfo.value = result.product;
    });

});
</script>
