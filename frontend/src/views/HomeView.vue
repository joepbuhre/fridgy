<template>
    <div>
        <div class="flex gap-3 pt-4">
            <router-link :to="{ name: 'Add Item' }">
                <TheButton>Add item</TheButton>
            </router-link>
            <TheButton @click="openConsumePopup = true">Consume Item</TheButton>
        </div>
        <InputGroup
            class="my-0"
            v-model="search"
            :compact="true"
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
                    <div class="flex gap-4" v-if="item.Stock > 0">
                        <span
                            class="bg-green-100 text-green-500 border border-green-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                        >
                            {{ item.Stock }} op voorraad</span
                        >
                        <span
                            class="bg-blue-100 text-blue-500 border border-blue-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                        >
                            {{
                                item.Location.map(
                                    (el) => el.Location?.Name
                                ).join(", ")
                            }}
                        </span>
                    </div>
                    <div v-else>
                        <TheLabel class="text-sm" color="red"
                            >niet op voorraad</TheLabel
                        >
                    </div>
                </div>
                <div
                    class="w-auto text-xs mt-2"
                    v-if="
                        !Number.isNaN(rawDelta(item.Expiry)) &&
                        item.Location.map(
                            (loc) => loc.Location?.HasTht || false
                        ).includes(true)
                    "
                >
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
        <ThePopup 
            v-if="openConsumePopup"
            @confirm="openConsumePopup = false; "
            @cancel="openConsumePopup = false"
            >
            <div v-if="consumeItem !== null">
                <h3>{{ consumeItem?.ProductName }}</h3>
                <div v-for="st in consumeItem?.Inventory" class="flex gap-3">
                    <InputGroup
                        v-if="st.Location"
                        class="w-2/5"
                        v-model="st.Location.Name"
                        name="Location"
                        prettyname="Location"
                        :compact="true"
                    />
                    <InputGroup
                        class="w-2/5"
                        name="Date"
                        prettyname="Date"
                        :compact="true"
                        v-model="st.Expiry"
                        type="date"
                    />
                    <InputGroup
                        class="w-1/5"
                        name="Stock"
                        prettyname="Stock"
                        :compact="true"
                        v-model.number="st.Stock"
                    />
                    <button @click="consume(st.ID)">
                        <Cookie />
                    </button>
                </div>
            </div>
            <TheScanner v-else @found="handlerConsumeItem" />
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

// Implement search
const search = ref<string>("");
const visibleItems = computed(() => {
    return data.value
        ?.filter((item: ItemDeep) => {
            return (
                item.EAN.search(search.value) > -1 ||
                (item.ProductName || "")
                    ?.toLowerCase()
                    .search(search.value.toLowerCase()) > -1
            );
        })
        .map((it) => {
            return {
                ...it,
                Stock: it.Inventory.reduce((a, b) => a + b.Stock, 0),
                Expiry: new Date(
                    Math.min.apply(
                        0,
                        // @ts-ignore
                        it.Inventory.filter((el) => el.Expiry !== null).map((el) => new Date(el.Expiry).getTime())
                    )
                ),
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
    console.log(import.meta.env);
};

onMounted(getItems);

// Consume Item
const openConsumePopup = ref<boolean>(false);
const consumeItem = ref<ItemDeep | null>(null);
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
