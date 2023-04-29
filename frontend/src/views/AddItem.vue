<template>
    <h4>Voeg toe</h4>
    <TheSearchBar v-model="item.ean" />
    <div class="flex gap-4">
        <InputGroup
            class="w-2/5"
            :compact="true"
            v-model="item.tht"
            name="tht"
            prettyname="THT Datum"
            type="date"
        />
        <InputGroup
            v-model="selectedLocation"
            :options="
                locations.map((el) => ({
                    value: el.ID.toString(),
                    name: el.Name,
                }))
            "
            name="Location"
            prettyname="Location"
            :compact="true"
        />
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
        <button @click="prepareItem" class="bg-blue-500 text-white w-1/4">
            Add
        </button>
        <button @click="finalize" class="bg-blue-500 text-white w-1/4">
            Finalize
        </button>
        <TheButton @click="edit(-1)" class="w-1/4">Scan</TheButton>
        <TheButton @click="getBtnItems" class="w-1/4">Knop</TheButton>
    </div>
    <div
        v-for="(item, i) in items"
        class="my-6 justify-around border p-1 rounded-sm"
        @click="edit(i)"
    >
        <div class="mb-2">
            <h4 class="font-semibold">
                {{ item.productName }}
            </h4>
        </div>
        <div class="flex relative gap-5">
            <div>
                <span
                    class="bg-blue-100 text-blue-500 border border-blue-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                >
                    {{ item.count }} stuks</span
                >
            </div>
            <div
                class="bg-blue-100 text-blue-500 border border-blue-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
            >
                <span v-if="item.tht"> THT: {{ item.tht }} </span>
                <span v-else> THT onbekend </span>
            </div>
            <div
                class="bg-blue-100 text-blue-500 border border-blue-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                v-if="item.location"
            >
                <span v-if="item.location">
                    {{
                        locations.filter(
                            (l) => l.ID.toString() === item.location
                        )?.[0]?.Name
                    }}
                </span>
            </div>
        </div>
    </div>
    <div
        v-if="editModal"
        class="absolute inset-0 bg-black bg-opacity-10 flex"
        @click.self="editModal = false"
    >
        <div class="m-auto p-5 w-full mx-5 bg-white shadow-2xl">
            <TheScanner
                v-if="editItemInt < 0"
                @found="eanFound"
                ref="thescannercomp"
            />
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
                    <InputGroup
                        v-model="editItem.location"
                        :options="
                            locations.map((el) => ({
                                value: el.ID.toString(),
                                name: el.Name,
                            }))
                        "
                        name="Location"
                        prettyname="Location"
                    />
                </div>
                <div class="flex gap-5">
                    <TheButton
                        @click="editModal = false"
                        class="w-1/2 bg-green-700"
                        >Sla op</TheButton
                    >
                    <TheButton @click="removeItem" class="w-1/2 bg-red-700"
                        >Verwijder</TheButton
                    >
                </div>
            </div>
        </div>
    </div>
    <ThePopup v-if="popup" @confirm="onConfirm" @cancel="popup = false" />
    <ThePopup v-if="btnItems.length > 0" @cancel="btnItems = []">
        <div class="my-5">
            <div v-for="btn in btnItems" @click="addBtnItem(btn)" class="w-1/2 h-[50px] border border-solid border-gray-300 flex justify-center items-center">
                {{ btn.ProductName }}
            </div>

        </div>
    </ThePopup>
    <ThePopup v-if="moreInfo" @confirm="addItem" @cancel="moreInfo = false">
        <InputGroup
            v-model="item.productName"
            name="productname"
            prettyname="Product Name"
        />
    </ThePopup>
</template>

<script setup lang="ts">
import { HTMLAttributes, computed, onMounted, ref, toRaw } from "vue";
import { api, wff } from "../utils/api";
import type { AddItemProduct } from "../../../types/AddItem";
import type { Product } from "../../../types/FoodProduct";
import { prettydelta, getProductName, raw } from "../utils/helpers";
import InputGroup from "../components/InputGroup.vue";
import TheButton from "../components/TheButton.vue";
import TheScanner from "../components/TheScanner.vue";
import ThePopup from "../components/ThePopup.vue";
import type { Item, Location } from ".prisma/client";
import { useRouter } from "vue-router";
import { CaseSensitive } from 'lucide-vue-next'
import { Binary } from "lucide-vue-next";
import TheSearchBar from "../components/TheSearchBar.vue";

const test = ref<string>("");

const result = ref<any>([]);
const editModal = ref(false);
const popup = ref(false);

// Define router
const router = useRouter();

const item = ref<AddItemProduct>({
    count: "0",
    ean: "",
    tht: "",
    location: "1",
});

const items = ref<AddItemProduct[]>([]);

const moreInfo = ref<boolean>(false);

const prepareItem = async (): Promise<void> => {
    let found = false;
    item.value.location = raw(selectedLocation.value);
    for (let i = 0; i < items.value.length; i++) {
        const it = items.value[i];
        if (
            it.ean === item.value.ean &&
            it.tht === item.value.tht &&
            it.location === item.value.location
        ) {
            it.count = (
                parseInt(it.count) + parseInt(item.value.count)
            ).toString();
            found = true;
        }
    }

    if (item.value.tht) {
        console.log(prettydelta(item.value.tht));
    } else {
        item.value.tht = null
    }
    
    // Check if we already have this item
    await api.get(`/items/${item.value.ean}`).then(res => { 
        const it: Item = res.data
        found = true;
        item.value.productName = it?.ProductName || '';
        addItem();
    }).catch(err => {
        found = false;
    })

    if (found === false) {
        const foodfact: Product | undefined = (
            await wff
                .get(`/product/${item.value.ean}.json`)
                .catch((err) => undefined)
        )?.data?.product;

        if (foodfact === undefined) {
            // Product is unrecognized, ask for information
            moreInfo.value = true;
        } else {
            item.value.productName = getProductName(foodfact);
            addItem();
        }
    }
};

const addItem = () => {
    moreInfo.value = false;
    items.value.push(raw(item.value));
};

const removeItem = () => {
    items.value.splice(editItemInt.value, 1);
    editModal.value = false;
};

const finalize = (): void => {
    popup.value = true;
};

const onConfirm = (val: boolean) => {
    if (val) {
        console.log("adding to database");
        api.post("/items/create", items.value);
        router.push("/");
    }
    popup.value = false;
};

const editItemInt = ref<number>(0);
const editItem = computed((): AddItemProduct => items.value[editItemInt.value]);

const edit = (item: number) => {
    editItemInt.value = item;
    editModal.value = true;
};

const eanFound = (ean: string) => {
    item.value.count = "1";
    item.value.ean = ean;
    item.value.tht = null;

    editModal.value = false;

    prepareItem();
};

// Get Knop artikelen
const btnItems = ref<Item[]>([]);
const getBtnItems = () => {
    api.get("/items/withoutBarcode")
        .then((res) => {
            btnItems.value = res.data;

        })
        .catch((err) => {
            // TODO
        });
};

const addBtnItem = (it: Item) => {
    item.value.ean = it.EAN;
    btnItems.value = []
}

// Get / Set locations
const locations = ref<Location[]>([]);
const selectedLocation = ref<string>("1");
onMounted(() => {
    api.get("/locations").then((res) => {
        locations.value = res.data;
    });
});
</script>
