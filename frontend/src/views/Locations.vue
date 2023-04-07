<template>
    <div>
        <div v-for="(loc, i) in locations" class="flex">
            <InputGroup
                class="w-full"
                v-model="loc.Name"
                name="loc"
                prettyname="loc"
                :compact="true"
            />
            <TheButton class="w-1/5 my-2" @click="saveLocation(i)"
                >Save</TheButton
            >
        </div>
        <div class="flex">
            <InputGroup
                class="w-full"
                v-model="addLocations.Name"
                name="loc"
                prettyname="loc"
                :compact="true"
            />
            <TheButton class="w-1/5 my-2" @click="addLocation">Add</TheButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Location } from "@prisma/client";
import { onMounted, ref } from "vue";
import InputGroup from "../components/InputGroup.vue";
import TheButton from "../components/TheButton.vue";
import { api } from "../utils/api";

const addLocations = ref<Location>({
    ID: 0,
    Name: "",
});

const locations = ref<Location[]>([]);

onMounted(() => {
    getLocations();
});

const getLocations = () => {
    api.get("/locations").then((res) => {
        locations.value = res.data;
    });
};

const saveLocation = (i: number) => {
    const obj = locations.value[i];
    api.put(`/locations/${i}`, obj).then((res) => {
        getLocations();
    });
};

const addLocation = () => {
    api.post("/locations", addLocations.value).then((res) => {
        getLocations();
    });
};
</script>
