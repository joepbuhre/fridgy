<template>
    <h4 class="font-semibold text-2xl mt-2">{{ productInfo?.product_name_nl }}</h4>
    <div
        v-if="inventory"
        class=""
    >
        <InputGroup 
            v-model="inventory.LocationID"
            :options="locationOptions"
            name="Locations"
            prettyname="Locations"
        />
        <InputGroup 
            v-model="inventory.Expiry"
            name="Date"
            prettyname="Expiry Date"
            type="date"
        />
        <InputGroup
            v-model="inventory.Stock"
            name="Stock"
            prettyname="Stock"
            type="number"
        />
        <div class="grid grid-cols-2 gap-8 my-4" >
            <TheButton class="bg-green-700" @click="updateItem((inventory as any))">Sla op</TheButton>
            <TheButton class="bg-red-700 flex gap-3" @click="deleteItem((inventory?.ID as number))"> <Trash /> Verwijder</TheButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ItemsInventory, Locations } from ".prisma/client";
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ItemsInventoryDeep } from "../../../types/AddItem";
import type { Product } from "../../../types/FoodProduct";
import type { ProductResponse } from "../../../types/FoodResponse";
import InputGroup from "../components/InputGroup.vue";
import TheButton from "../components/TheButton.vue";
import { api } from "../utils/api";
import { Trash } from "lucide-vue-next";

const productInfo = ref<Product | undefined>(undefined);
const inventory = ref<ItemsInventoryDeep | undefined>(undefined);

// Get locations
const locations = ref<Locations[] | undefined>(undefined)
const locationOptions = computed(() => locations.value?.map(el => ({value: el.ID.toString(), name: el.Name}) || []))

// Define route(rs)
const route = useRoute();
const router = useRouter()

const getItem = () => {
    api.get(`/items/${route.params.EAN}`).then((res) => {
        inventory.value = res.data;
    });
}

onMounted(() => {
    
    getItem()
    api.get('/locations').then(res => {
        locations.value = res.data
    })

    axios
        .get("https://world.openfoodfacts.org/api/v2/product/87338010.json")
        .then((res) => {
            const result: ProductResponse = res.data;
            productInfo.value = result.product;
        });
});


// Delete Items
const deleteItem = (it: number) => {
    if(confirm('Are you sure to delete this item?')) {
        api.delete(`/items/${it}`).then(res => {
            router.push('/')
        })
        getItem()
    }
}

const updateItem = (it: ItemsInventoryDeep) => {
    
    api.put('/items', it).then(res => {
        console.log(res.data)
        router.push('/')
    })
}
</script>
