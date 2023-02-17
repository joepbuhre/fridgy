<template>
    <h4>Voeg toe</h4>

    <div>
        <input
            type="phone"
            v-model="item.ean"
            class="border border-solid border-blue-400 outline-none"
        />
    </div>
    <div>
        <input
            type="number"
            v-model="item.count"
            class="border border-solid border-green-400 outline-none"
        />
    </div>
    <div>
        <input
            type="date"
            v-model="item.tht"
            class="border border-solid border-green-400 outline-none"
        />
    </div>
    <div class="grid grid-cols-2 gap-5">
        <button @click="addItem" class="bg-blue-500 text-white">Add</button>
        <button @click="finalize" class="bg-blue-500 text-white">
            Finalize
        </button>
    </div>
    <div
        v-for="item in items"
        class="my-6 justify-around border border-slate-400 p-1 rounded-sm"
        @click="edit(item)"
    >
        <div class="mb-2">
            <h4 class="font-semibold text-center">
                {{ item.foodfacts?.product_name_nl }}
            </h4>
        </div>
        <div class="flex relative gap-5 justify-center">
            <div>
                <span
                    class="bg-blue-100 text-blue-500 border border-blue-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                >
                    {{ item.count }} stuks op voorraad</span
                >
            </div>
            <div
                class="bg-blue-100 text-blue-500 border border-blue-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
            >
                <span v-if="item.tht"> THT: {{ item.tht }} </span>
                <span v-else> THT onbekend </span>
            </div>
        </div>
    </div>
    <div
        v-if="editModal && editItem?.ean && editItem?.count"
        class="absolute inset-0 bg-black bg-opacity-10 flex"
        @click.self="editModal = false"
    >
        <div class="m-auto p-5 w-full mx-5 bg-white shadow-2xl">
            <div class="flex gap-4">
                <InputGroup
                    v-model="editItem.ean"
                    class="w-2/3"
                    name="ean"
                    prettyname="EAN Code"
                />
                <InputGroup
                    v-model="editItem.count"
                    class="w-1/3"
                    name="count"
                    prettyname="Aantal"
                    type="number"
                    :input-attrs="{ readonly: false }"
                />
            </div>
            <div>
                <InputGroup
                    v-model="test"
                    name="tht"
                    prettyname="Houdbaarheidsdatum"
                    type="date"
                    :input-attrs="{ readonly: false }"
                />
            </div>
            <div class="flex gap-5">
                <TheButton class="w-1/2 bg-green-700">Sla op</TheButton>
                <TheButton class="w-1/2 bg-red-700">Verwijder</TheButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from "vue";
import { api, wff } from "../utils/api";
import type { AddItemProduct } from "../../../types/AddItem";
import type { Product } from "../../../types/FoodProduct";
import { prettydelta } from "../utils/helpers";
import InputGroup from "../components/InputGroup.vue";
import TheButton from "../components/TheButton.vue";

const test = ref<string>("");

const result = ref<any>([]);
const editModal = ref(false);

const item = ref<AddItemProduct>({
    count: 0,
    ean: "",
    tht: null,
});

const items = ref<AddItemProduct[]>([]);

const addItem = async (): Promise<void> => {
    let found = false;
    for (let i = 0; i < items.value.length; i++) {
        const it = items.value[i];
        if (it.ean === item.value.ean && it.tht === item.value.tht) {
            it.count = it.count + item.value.count;
            found = true;
        }
    }

    if (item.value.tht) {
        console.log(prettydelta(item.value.tht));
    }

    if (found === false) {
        const foodfact: Product =
            (await wff.get("/product/87338010.json")).data?.product || null;

        // TODO FIX JSON PARSE
        items.value.push({
            ...JSON.parse(JSON.stringify(item.value)),
            foodfacts: foodfact,
        });
    }
};

const finalize = (): void => {
    console.log(items.value);
};

const editItem = ref<AddItemProduct | null>(null);
const edit = (item: AddItemProduct) => {
    editItem.value = item;
    editModal.value = true;
};
</script>
