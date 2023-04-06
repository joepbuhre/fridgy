<template>
    <div>
        <div @click="editItem = item" class="my-5 border solid border-gray-300 py-1 px-2" v-for="item in items">
            <strong>{{ item.ProductName }}</strong>    
            <p>{{ item.EAN }}</p>    
        </div>
    </div>
    <ThePopup
        v-if="editItem"
        @confirm="saveItem"
        @cancel="editItem = null"
    >
        <InputGroup
            v-model="editItem.EAN"
            name="EAN"
            prettyname="EAN"
            class="w-3/4 !my-0"
        />
        <InputGroup
            v-model="editItem.ProductName"
            name="Productname"
            prettyname="Product Name"
            class="w-3/4 my-2"
        />
    </ThePopup>
</template>

<script setup lang="ts">
import type { Items } from '.prisma/client';
import { api } from '../utils/api';
import { onMounted, ref } from 'vue';
import ThePopup from '../components/ThePopup.vue';
import { raw } from '../utils/helpers';
import ItemEditModal from '../components/ItemEditModal.vue';
import InputGroup from '../components/InputGroup.vue';

const items = ref<Items[]>([])
const editItem = ref<Items | null>(null)


const getItems = () => {
    api.get('/items').then(res => {
        items.value = res.data
    })
}

const saveItem = () => {
    if(editItem !== null) {
        api.put('/items', raw(editItem.value))
        .then(res => {
            editItem.value = null

        }).catch(err => {
            // TODO
        }).finally(() => {
            getItems()
        })

    }
}

onMounted(getItems)

</script>