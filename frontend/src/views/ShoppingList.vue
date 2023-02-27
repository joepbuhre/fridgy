<template>
    <div>
        <label class="flex gap-5 my-5 font-bold">
            <span class="w-1/3">EAN</span>
            <span class="w-1/3">Naam</span>
            <span class="w-1/3">Afgevinkt</span>
        </label>
    </div>
    <div v-for="it in list">
        <label class="flex gap-5 my-5" :for="it.ID.toString()">
            <span class="w-1/3">{{ it.EAN }}</span>
            <span class="w-1/3">{{ it.ProductName }}</span>
            <span class="w-1/3"><input v-model="it.InBasket" :id="it.ID.toString()" type="checkbox" /></span>
        </label>
    </div>
    <TheButton @click="saveShopping">
        Save Shopping List
    </TheButton>
</template>

<script setup lang="ts">
import { Items } from "@prisma/client";
import { computed, onMounted, ref } from "vue";
import { api } from "../utils/api";
import TheButton from "../components/TheButton.vue";

const list = ref<(Items & {InBasket: boolean})[]>([]);


const getShoppingList = () => {
    api.get("/items/shopping-list").then((res) => {
        list.value = res.data.map((el: Items) => ({
            ...el,
            InBasket: false
        }));
    });
}

onMounted(() => {
    getShoppingList()
});

const saveShopping = () => {
    Promise.all(
        list.value
        .filter(li => {
            return li.InBasket
        })
        .map(li => {
            api.put('/items', list.value.map(el => ({
                ...li,
                Reorder: false,
                Inventory: []
            })))
        })
    ).then(res => {
        getShoppingList()
    })
}

</script>
