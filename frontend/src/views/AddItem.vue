<template>
    <h4>Voeg toe</h4>
    <InputGroup
        v-model="item.ean"
        name="ean"
        prettyname="EAN Code"
        type="phone"
        :compact="true"
    />
    <div class="flex gap-4">
        <InputGroup
            class="w-2/5"
            :compact="true"
            v-model="item.tht"
            name="tht"
            prettyname="THT Datum"
            type="date"
        />
        <div class="w-2/5 my-2">
            <select
                name="location"
                id="cars"
                class="border border-solid border-gray-500 rounded-sm outline-none px-2 py-1 w-full"
            >
                <option value="fridge">fridge</option>
                <option value="freezer">freezer</option>
                <option value="freezer2">freezer2</option>
                <option value="cupboard">Voorraadkast</option>
            </select>
        </div>
        <InputGroup
            class="w-1/5"
            :compact="true"
            v-model="item.count"
            name="count"
            prettyname="Aantal"
            type="number"
        />
    </div>

    <div class="flex gap-3">
        <button @click="addItem" class="bg-blue-500 text-white w-2/5">
            Add
        </button>
        <button @click="finalize" class="bg-blue-500 text-white w-2/5">
            Finalize
        </button>
        <TheButton @click="edit(-1)" class="w-1/5">Scan</TheButton>
    </div>
    <div
        v-for="(item, i) in items"
        class="my-6 justify-around border border-slate-400 p-1 rounded-sm"
        @click="edit(i)"
    >
        <div class="mb-2">
            <h4 class="font-semibold text-center">
                {{ getProductName(item.foodfacts) }}
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
        v-if="editModal"
        class="absolute inset-0 bg-black bg-opacity-10 flex"
        @click.self="editModal = false"
    >
        <div class="m-auto p-5 w-full mx-5 bg-white shadow-2xl">
            <TheScanner v-if="editItemInt < 0" @found="eanFound" ref="thescannercomp" />
            <div v-else>
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
                    />
                </div>
                <div>
                    <InputGroup
                        v-model="editItem.tht"
                        name="tht"
                        prettyname="Houdbaarheidsdatum"
                        type="date"
                        :input-attrs="{ readonly: false }"
                    />
                </div>
                <div class="flex gap-5">
                    <TheButton
                        @click="editModal = false"
                        class="w-1/2 bg-green-700"
                        >Sla op</TheButton
                    >
                    <TheButton @click="removeItem" class="w-1/2 bg-red-700">Verwijder</TheButton>
                </div>
            </div>
        </div>
    </div>
    <ThePopup v-if="popup" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { computed, ref, toRaw } from "vue";
import { api, wff } from "../utils/api";
import type { AddItemProduct } from "../../../types/AddItem";
import type { Product } from "../../../types/FoodProduct";
import { prettydelta, getProductName } from "../utils/helpers";
import InputGroup from "../components/InputGroup.vue";
import TheButton from "../components/TheButton.vue";
import TheScanner from "../components/TheScanner.vue";
import ThePopup from "../components/ThePopup.vue";

const test = ref<string>("");

const result = ref<any>([]);
const editModal = ref(false);
const popup = ref(false)

const item = ref<AddItemProduct>({
    count: "0",
    ean: "",
    tht: "",
});

const items = ref<AddItemProduct[]>([]);

const thescannercomp = ref(null)

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
    } else {
        item.value.tht = new Date().toJSON().slice(0, 10);
    }

    if (found === false) {
        const foodfact: Product =
            (await wff.get(`/product/${item.value.ean}.json`)).data?.product ||
            null;

        // TODO FIX JSON PARSE
        items.value.push({
            ...JSON.parse(JSON.stringify(item.value)),
            foodfacts: foodfact,
        });
    }
};

const removeItem = () => {
    items.value.splice(editItemInt.value,1)
    editModal.value = false
}

const finalize = (): void => {popup.value = true}

const onConfirm = (val:boolean) => {
    if(val) {
        console.log('adding to database')
        api.post('/items/create', items.value)
    }
    popup.value = false
}

const editItemInt = ref<number>(0);
const editItem = computed((): AddItemProduct => items.value[editItemInt.value]);

const edit = (item: number) => {
    editItemInt.value = item;
    editModal.value = true;
};

const eanFound = (ean: string) => {
    item.value.count = '1';
    item.value.ean = ean;
    item.value.tht = new Date().toJSON().slice(0, 10);

    editModal.value = false;

    addItem();
};



</script>
