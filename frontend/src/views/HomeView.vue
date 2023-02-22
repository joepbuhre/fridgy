<template>
    <div>
        <div class="md:grid-cols-4 grid-cols-2 grid gap-10 py-4">
            <router-link :to="{name: 'Add Item'}">
                <TheButton>Add item</TheButton>
            </router-link>
        </div>
        <router-link
            v-for="item in data"
            to="/"
            @click="deleteItem(item)"
            >
            <!-- :to="{ name: 'Item', params: { EAN: item.EAN } }" -->
            <div
                class="flex relative my-6 justify-around border border-slate-400 p-1 rounded-sm"
            >
                <div class="w-2/3">
                    <h4 class="font-semibold">{{ getProductName(meta?.[item.EAN]) }}</h4>
                    <span>Vriezer</span>
                    <div class="flex gap-4">
                        <span
                            class="bg-green-100 text-green-500 border border-green-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                        >
                            {{ item.Stock }} op voorraad</span
                        >
                        <span
                            class="bg-blue-100 text-blue-500 border border-blue-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                        >
                            {{ item.Location.Name }} 
                            </span
                        >
                    </div>
                </div>
                <div class="w-auto">
                    <div
                        class="text-red-700 bg-red-100 font-bold px-2 py-1 rounded-md"
                    >
                        {{ prettydelta(item.Expiry) }}
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { api, wff } from "../utils/api";
import { ItemsInventory } from "@prisma/client";
import type { Locations } from "@prisma/client";
import type { Product } from "../../../types/FoodProduct";
import type { ProductResponse } from "../../../types/FoodResponse";
import axios from "axios";
import { getProductName, prettydelta } from "../utils/helpers";
import TheButton from "../components/TheButton.vue";

interface ItemsInventoryDeep extends ItemsInventory  {
    Location: Locations
}

const data = ref<ItemsInventoryDeep[] | null>(null);
const ff = ref<Product | null | undefined>(null);
const resultZX = ref<any>(null);
const search = ref<string>("");

const getItems = () => {
    api.get("/items").then((res) => {
        data.value = res.data;
        console.log(res);
        getMetaData()
    });
}

onMounted(getItems)

const visibleItems = computed(() => {
    return data.value?.filter((item: ItemsInventory) => {
        console.log(item.EAN.search(search.value));

        return item.EAN.search(search.value) > -1;
    });
});

const meta = ref<{
    [key: string]: Product
}>({}) 

const getMetaData = () => {
    if(data.value) {
        Promise.all(
            data.value.map(el => wff.get(`/product/${el.EAN}.json`))
        ).then(res => {
            res.forEach(it => {
                const data: ProductResponse = it.data
                if(data.status === 1 && data.code && data.product) {
                    meta.value[data.code] = data.product
                }
            })
        })
    }
}


const deleteItem = (it: ItemsInventory) => {
    if(confirm('Are you sure to delete this item?')) {
        api.delete(`/items/${it.ID}`)
        getItems()
    }
}

</script>
