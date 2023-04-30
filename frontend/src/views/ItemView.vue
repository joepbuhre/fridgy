<template>
    <div class="">
        <h4 class="font-semibold text-2xl mt-2">{{ items?.ProductName }}</h4>
        <div v-if="items" class="">
            <InputGroup v-model="items.ProductName" name="Name" prettyname="Name" />
            <InputGroup v-model="items.Reorder" name="Reorder" prettyname="Reorder" type="checkbox" />

            <div>
                <label for="EAN" class="font-semibold">EAN</label>
                <TheSearchBar
                    v-model="items.EAN"
                    name="EAN"
                    prettyname="EAN"
                    type="text"
                    :inputAttrs="{ readonly: true }"
                />
            </div>
            <div class="grid grid-cols-2 gap-8 my-4">
                <TheButton class="bg-green-700" @click="updateItem(items as any)">Sla op</TheButton>
                <TheButton class="bg-red-700 flex gap-3" @click="deleteItem(items?.ID as number)">
                    <Trash /> Verwijder
                </TheButton>
            </div>
        </div>
        <div>
            <h4 class="text-lg">Current stock</h4>
            <div v-for="st in items?.Inventory" class="flex gap-3">
                <InputGroup
                    class="w-2/5"
                    v-model.number="st.LocationID"
                    :options="locationOptions"
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
            <button
                @click="
                    items?.Inventory.push({
                        ID: 0,
                        EAN: items.EAN,
                        Expiry: new Date(),
                        LocationID: 1,
                        Stock: 0,
                        ItemId: items.ID,
                    })
                "
            >
                Voeg voorraad toe
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Location } from ".prisma/client";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ItemDeep, ItemInventoryDeep } from "../../../types/AddItem";
import type { Product } from "../../../types/FoodProduct";
import InputGroup from "../components/InputGroup.vue";
import TheButton from "../components/TheButton.vue";
import { api } from "../utils/api";
import { Trash, Cookie } from "lucide-vue-next";
import TheSearchBar from "../components/TheSearchBar.vue";

const items = ref<ItemDeep | undefined>(undefined);

// Get locations
const locations = ref<Location[] | undefined>(undefined);
const locationOptions = computed(() =>
    locations.value?.map((el) => ({ value: el.ID.toString(), name: el.Name } || []))
);

// Define route(rs)
const route = useRoute();
const router = useRouter();

const getItem = async () => {
    await api.get(`/items/${route.params.EAN}`).then((res) => {
        items.value = res.data;
    });
};

onMounted(async () => {
    await api.get("/locations").then((res) => {
        locations.value = res.data;
    });
    await getItem();
});

// Delete Items
const deleteItem = (it: number) => {
    if (confirm("Are you sure to delete this item?")) {
        api.delete(`/items/${it}`).then((res) => {
            router.push("/");
        });
        getItem();
    }
};

const updateItem = (it: ItemInventoryDeep) => {
    api.put("/items/inventory", it).then((res) => {
        router.push("/");
    });
};

// Consume Items
const consume = (ItemInventoryID: number) => {
    api.post(`/items/consume/${ItemInventoryID}`).then((res) => {
        items.value = res.data;
    });
};
</script>
