<template>
    <div>
        <InputGroup
            class="my-0"
            v-model="search"
            name="Search"
            prettyname="search"
            :compact="true"
        />
        <div @click="editItem = item" class="my-5 border solid border-gray-300 py-1 px-2" v-for="item in visibleItems">
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
import type { Item } from '.prisma/client';
import { api } from '../utils/api';
import { computed, onMounted, ref } from 'vue';
import ThePopup from '../components/ThePopup.vue';
import { raw } from '../utils/helpers';
import ItemEditModal from '../components/ItemEditModal.vue';
import InputGroup from '../components/InputGroup.vue';

const search = ref<string>('')

const visibleItems = computed(() => {
    return items.value
        ?.filter((item: Items) => {
            return (
                item.EAN.search(search.value) > -1 ||
                (item.ProductName || "")
                    ?.toLowerCase()
                    .search(search.value.toLowerCase()) > -1
            );
        })
        // .map((it) => {
        //     return {
        //         ...it,
        //         Stock: it.Inventory.reduce((a, b) => a + b.Stock, 0),
        //         Expiry: new Date(
        //             Math.min.apply(
        //                 0,
        //                 it.Inventory.map((el) => new Date(el.Expiry).getTime())
        //             )
        //         ),
        //         Location: it.Inventory.map((el) => el?.Location?.Name).join(
        //             ", "
        //         ),
        //     };
        // })
        .sort((a, b) => {
            if (a.ProductName && b.ProductName) {
                if (a.ProductName < b.ProductName) {
                    return -1;
                }
                if (a.ProductName > b.ProductName) {
                    return 1;
                }
            }
            return 0;
        });
});
const items = ref<Item[]>([])
const editItem = ref<Item | null>(null)


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