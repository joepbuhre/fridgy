<template>
    <div>
        <div class="md:grid-cols-4 grid-cols-2 grid gap-10 pt-4">
            <router-link :to="{ name: 'Add Item' }">
                <TheButton>Add item</TheButton>
            </router-link>
        </div>
        <InputGroup
            class="my-0"
            v-model="search"
            name="Search"
            prettyname="search"
        />
        <router-link
            v-for="item in visibleItems"
            :to="{ name: 'Item', params: { EAN: item.EAN } }"
        >
            <div
                class="flex relative my-6 justify-between border border-slate-400 p-1 rounded-sm px-5"
            >
                <div class="w-2/3">
                    <h4 class="font-semibold mb-1">
                        {{ item.ProductName }}
                    </h4>
                    <div class="flex gap-4">
                        <span
                            class="bg-green-100 text-green-500 border border-green-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                        >
                            {{ item.Stock }} op voorraad</span
                        >
                        <span
                            class="bg-blue-100 text-blue-500 border border-blue-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                        >
                            {{ item.Location }}
                        </span>
                    </div>
                </div>
                <div class="w-auto text-xs mt-2" v-if="rawDelta(item.Expiry)">
                    <TheLabel
                        :color="{
                            red: rawDelta(item.Expiry) < 3,
                            yellow:
                                rawDelta(item.Expiry) >= 3 &&
                                rawDelta(item.Expiry) < 7,
                            green:
                                rawDelta(item.Expiry) >= 7 &&
                                rawDelta(item.Expiry) < 15,
                        }"
                    >
                        {{ prettydelta(item.Expiry) }}
                    </TheLabel>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { api, wff } from "../utils/api";
import type { Product } from "../../../types/FoodProduct";
import type { ProductResponse } from "../../../types/FoodResponse";
import type { ItemsDeep } from "../../../types/AddItem";
import axios from "axios";
import { getProductName, prettydelta, rawDelta } from "../utils/helpers";
import TheButton from "../components/TheButton.vue";
import InputGroup from "../components/InputGroup.vue";
import TheLabel from "../components/TheLabel.vue";

// Implement search
const search = ref<string>("");
const visibleItems = computed(() => {
    return data.value
        ?.filter((item: ItemsDeep) => {
            return (
                item.EAN.search(search.value) > -1 || (item.ProductName || '')?.toLowerCase().search(search.value.toLowerCase()) > -1
            );
        }).map(it => {
            return {
                ...it,
                Stock: it.Inventory.reduce((a, b) => a + b.Stock, 0),
                Expiry: new Date(Math.min.apply(it.Inventory.map(el => el.Expiry))),
                Location: it.Inventory.map(el => el.Location.Name).join(', ')
            }
        })
        .sort((a, b) => {
            if(a.ProductName && b.ProductName) {

            if (a.ProductName < b.ProductName) {
                return -1;
            }
            if (a.ProductName > b.ProductName) {
                return 1;
            }
            }
            return 0;        
        })
});

const data = ref<ItemsDeep[] | null>(null);
const ff = ref<Product | null | undefined>(null);
const resultZX = ref<any>(null);

const getItems = () => {
    api.get("/items").then((res) => {
        data.value = res.data;
    });
};

onMounted(getItems);

const meta = ref<{
    [key: string]: Product;
}>({});

</script>
