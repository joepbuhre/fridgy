<template>
    <TheScanner @found="onFound" :allow-text-input="true" />
    <ItemList :items="scannedItems" :allow-delete="true"
        @delete="onDelete"
     />
     <ItemList :items="allItems" />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import TheScanner from '../components/TheScanner.vue';
import ItemList from '../components/ItemList.vue';
import { ItemDeep } from '../../../types/AddItem';
import { api, wff } from '../utils/api';
import type { Item, ScannedItem } from '@prisma/client';
import type { Product } from '../../../types/FoodProduct';
import { getProductName } from '../utils/helpers';
import { watch } from 'vue';
import { deleteScan, scanItem } from '../utils/item';

onMounted(async () => {
    // just for devving
    await onFound('8717399043458')
    await onFound('5410126016949')
    setTimeout(() => {
        onFound('5410126016949')
    }, 3000);
})

onUnmounted(() => {
    deleteScan(scanId.value)
})

const scannedItems = ref<ItemDeep[]>([])

const allItems = ref<ItemDeep[]>([])

const scanId = ref<number>(0)

const onFound = async (e: string) => {
    scanItem({
        EAN: e,
        ID: 0,
        ScanId: scanId.value
    }).then(res => {
        const data = res.data as ScannedItem[]
        scanId.value = (data[0].ScanId ?? 0)

    })
    
}

const onDelete = (i: number) => {
    scannedItems.value.splice(i, 1)
}

</script>
