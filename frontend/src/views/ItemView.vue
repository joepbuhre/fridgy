<template>
    <h4 class="font-semibold text-2xl mt-2">{{ items?.ProductName }}</h4>
    <div
        v-if="items"
        class=""
    >
        <InputGroup 
            v-model="items.ProductName"
            name="Name"
            prettyname="Name"
        />
        <InputGroup
            v-model="items.Reorder"
            name="Reorder"
            prettyname="Reorder"
            type="checkbox"
        />
        <div class="grid grid-cols-2 gap-8 my-4" >
            <TheButton class="bg-green-700" @click="updateItem((items as any))">Sla op</TheButton>
            <TheButton class="bg-red-700 flex gap-3" @click="deleteItem((items?.ID as number))"> <Trash /> Verwijder</TheButton>
        </div>
    </div>
    <div>
        <h4 class="text-lg">Current stock</h4>
        <div v-for="st in items?.Inventory" class="grid grid-cols-3 gap-5">
            <InputGroup v-model.number="st.LocationID" :options="locationOptions" name="Location" prettyname="Location" :compact="true" /> 
            <InputGroup name="Date"  prettyname="Date" :compact="true" v-model="st.Expiry" type="date" /> 
            <InputGroup name="Stock" prettyname="Stock" :compact="true" v-model="st.Stock" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Locations } from ".prisma/client";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ItemsDeep, ItemsInventoryDeep } from "../../../types/AddItem";
import type { Product } from "../../../types/FoodProduct";
import InputGroup from "../components/InputGroup.vue";
import TheButton from "../components/TheButton.vue";
import { api } from "../utils/api";
import { Trash } from "lucide-vue-next";

const items = ref<ItemsDeep | undefined>(undefined);

// Get locations
const locations = ref<Locations[] | undefined>(undefined)
const locationOptions = computed(() => locations.value?.map(el => ({value: el.ID.toString(), name: el.Name}) || []))

// Define route(rs)
const route = useRoute();
const router = useRouter()

const getItem = async () => {
    await api.get(`/items/${route.params.EAN}`).then((res) => {
        items.value = res.data;
    });
}

onMounted(async () => {
    
    await api.get('/locations').then(res => {
        locations.value = res.data
    })
    await getItem()

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
        router.push('/')
    })
}
</script>
