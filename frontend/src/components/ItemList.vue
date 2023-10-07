<template>
<TheSearchBar v-if="searchEnabled" v-model="search" name="Search" prettyname="search" />
<div v-for="(item, i) in visibleItems">
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
                    <TheLabel v-if="item.Location">
                        {{ item.Location.map((el) => el.Location?.Name).join(", ") }}
                    </TheLabel>
                    <TheLabel
                        v-if="
                            !Number.isNaN(rawDelta(item.Expiry)) &&
                            item.Location?.map((loc) => loc.Location?.HasTht || false).includes(true)
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
        <button @click="emit('delete', i)" v-if="props.allowDelete" >
            <Trash2Icon />
        </button>
    </div>
</div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { ItemDeep } from '../../../types/AddItem';
import { prettydelta, rawDelta } from '../utils/helpers';
import { Trash2Icon } from 'lucide-vue-next';

interface IProps {
    items: ItemDeep | ItemDeep[];
    searchEnabled: boolean;
    allowDelete?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
    searchEnabled: true
})

const emit = defineEmits<{
    (e: "delete", value: number): void;
}>()

const items = computed((): ItemDeep[] => Array.isArray(props.items) ? props.items : [props.items] )

const search = ref<string>("")

const visibleItems = computed(() => {
    return items.value
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


</script>