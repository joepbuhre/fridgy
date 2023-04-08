<template>
    <div>
        <div v-for="(loc, i) in locations" class="flex" @click="editLocation(loc)">
            <TheListItem>
                {{ loc.Name }}
            </TheListItem>
            <!-- <TheButton class="w-1/5 my-2" @click="saveLocation(i)"
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
            <TheButton class="w-1/5 my-2" @click="addLocation">Add</TheButton> -->
        </div>
    </div>
    <ThePopup
        v-if="showPop"
        @confirm="addLocation"
        @cancel="showPop = false"
    >
        <InputGroup 
            v-model="addLoc.Name"
            prettyname="Name"
        />
    </ThePopup>
</template>

<script setup lang="ts">
import { Location } from "@prisma/client";
import { onMounted, ref } from "vue";
import InputGroup from "../components/InputGroup.vue";
import TheButton from "../components/TheButton.vue";
import TheListItem from "../components/TheListItem.vue";
import { api } from "../utils/api";
import ThePopup from "../components/ThePopup.vue";

const showPop = ref<boolean>(false)
const addLoc = ref<Location>({
    ID: 0,
    Name: "",
    HasTht: true,
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

const addLocation = () => {
    api.post("/locations", addLoc.value).then((res) => {
        getLocations();
        showPop.value = false
    });
};

const editLocation = (loc: Location | null) => {
    if(loc === null) {
        addLoc.value.ID = -1
    } else {
        addLoc.value = loc
    } 
}

</script>
