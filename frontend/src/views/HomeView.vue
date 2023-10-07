<template>
    <div>
        <div class="flex gap-3 ">
            <router-link :to="{ name: 'Add Item' }">
                <TheButton>Add item</TheButton>
            </router-link>
            <TheButton @click="openConsumePopup = true">Consume Item</TheButton>
        </div>
        <TheSearchBar v-model="search" name="Search" prettyname="search" />
        <div>
            <router-link v-for="item in visibleItems" :to="{ name: 'Item', params: { EAN: item.EAN } }">
                <div class="flex relative my-4 justify-between border border-slate-400 p-1 rounded-sm px-5">
                    <div class="w-full">
                        <h4 class="font-semibold mb-0">
                            {{ item.ProductName }}
                        </h4>
                        <h5 class="text-xs text-slate-500 mb-2">({{ item.EAN }})</h5>
                        <div class="text-xs">
                            <div class="flex gap-4" v-if="item.Stock > 0">
                                <TheLabel color="green">
                                    {{ item.Stock }}
                                </TheLabel>
                                <TheLabel 
                                    v-if="item.Location"
                                >
                                    {{ item.Location.map((el) => el.Location?.Name).join(", ") }}
                                </TheLabel>
                                <TheLabel
                                    v-if="
                                        !Number.isNaN(rawDelta(item.Expiry)) &&
                                        item.Location &&
                                        item.Location.map((loc) => loc.Location?.HasTht || false).includes(true)
                                    "
                                    :color="{
                                        red: rawDelta(item.Expiry) < 3,
                                        yellow: rawDelta(item.Expiry) >= 3 && rawDelta(item.Expiry) < 7,
                                        green: rawDelta(item.Expiry) >= 7 && rawDelta(item.Expiry) < 15,
                                    }"
                                >
                                    {{ prettydelta(item.Expiry) }}
                                </TheLabel>
                            </div>
                            <div v-else>
                                <TheLabel class="text-sm" color="red">niet op voorraad</TheLabel>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
        <ThePopup
            v-if="openConsumePopup"
            @confirm="openConsumePopup = false"
            @cancel="
                () => {
                    openConsumePopup = false;
                    consumeItem = null;
                }
            "
        >
            <div v-if="consumeItem !== null">
                <h3>{{ consumeItem?.ProductName }}</h3>
                <div v-for="st in consumeItem?.Inventory" class="flex gap-3">
                    <InputGroup v-if="st.Location" class="w-2/5" v-model="st.Location.Name" name="Location" prettyname="Location" :compact="true" />
                    <InputGroup class="w-2/5" name="Date" prettyname="Date" :compact="true" v-model="st.Expiry" type="date" />
                    <InputGroup class="w-1/5" name="Stock" prettyname="Stock" :compact="true" v-model.number="st.Stock" />
                    <button @click="consume(st.ID)">
                        <Cookie />
                    </button>
                </div>
            </div>
            <div>
                <TheSearchBar @update:model-value="handlerConsumeItem" v-model="consumeItemEan" name="Search" prettyname="search" />
                <TheScanner @found="handlerConsumeItem" />
            </div>
        </ThePopup>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { api, wff } from "../utils/api";
import type { Product } from "../../../types/FoodProduct";
import type { ProductResponse } from "../../../types/FoodResponse";
import type { ItemDeep } from "../../../types/AddItem";
import axios from "axios";
import { getProductName, prettydelta, rawDelta } from "../utils/helpers";
import TheButton from "../components/TheButton.vue";
import InputGroup from "../components/InputGroup.vue";
import TheLabel from "../components/TheLabel.vue";
import ThePopup from "../components/ThePopup.vue";
import TheScanner from "../components/TheScanner.vue";
import { Cookie } from "lucide-vue-next";
import TheSearchBar from "../components/TheSearchBar.vue";

// Implement search
const search = ref<string>("");
const visibleItems = computed(() => {
    return data.value
        ?.filter((item: ItemDeep) => {
            return item.EAN
                .search(search.value) > -1 || (item.ProductName || "")
                ?.toLowerCase()
                .search(search.value.toLowerCase()) > -1;
        })
        .map((it) => {
            return {
                ...it,
                Stock: (it.Inventory ? it.Inventory.reduce((a, b) => a + b.Stock, 0): 0),
                Expiry: (it.Inventory ? new Date(
                    Math.min.apply(
                        0,
                        // @ts-ignore
                        it.Inventory.filter((el) => el.Expiry !== null).map((el) => new Date(el.Expiry).getTime())
                    )
                ): ""),
                Location: it.Inventory,
            };
        })
        .sort((a, b) => {
            if (a.ProductName && b.ProductName) {
                if (a.ProductName.toLowerCase() < b.ProductName.toLowerCase()) {
                    return -1;
                }
                if (a.ProductName.toLowerCase() > b.ProductName.toLowerCase()) {
                    return 1;
                }
            }
            return 0;
        });
});

const data = ref<ItemDeep[] | null>(null);
const ff = ref<Product | null | undefined>(null);
const resultZX = ref<any>(null);

const getItems = () => {
    api.get("/items/inventory").then((res) => {
        data.value = res.data;
    });
};

onMounted(getItems);

// Consume Item
const openConsumePopup = ref<boolean>(false);
const consumeItem = ref<ItemDeep | null>(null);
const consumeItemEan = ref<any>("");
const handlerConsumeItem = (ean: string): void => {
    api.get(`/items/${ean}`)
        .then((res) => {
            consumeItem.value = res.data;
        })
        .catch((err) => {
            // TODO Error
        });
};

const consume = (ItemInventoryID: number) => {
    api.post(`/items/consume/${ItemInventoryID}`).then((res) => {
        consumeItem.value = null;
    });
};

const meta = ref<{
    [key: string]: Product;
}>({});
</script>
