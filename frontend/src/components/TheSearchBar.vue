<template>
    <div ref="searchBarWrapper" class="flex items-center">
        <InputGroup
            v-model="props.modelValue"
            name="ean"
            prettyname="EAN Code"
            type="text"
            :inputmode="keyboardInput"
            class="w-full"
            :compact="true"
            :inputAttrs="props.inputAttrs"
            @update:modelValue="emit('update:modelValue', $event)"
        />
        <button class="border border-gray-500 py-1 px-2 border-l-0" @click="switchKeyboard">
            <CaseSensitive v-if="keyboardInput === 'tel'" />
            <Binary v-else />
        </button>
    </div>
</template>

<script setup lang="ts">
import { CaseSensitive, Binary } from "lucide-vue-next";
import { HTMLAttributes, InputHTMLAttributes, onMounted, ref } from "vue";
import InputGroup from "./InputGroup.vue";
import type { inputPropType as _inputPropType } from "./InputGroup.vue";
import { useMain } from "../store/main";

interface inputPropType {
    modelValue: any;
    name: string;
    prettyname: string;
    type?: string;
    inputmode?: HTMLAttributes["inputmode"];
    inputAttrs?: InputHTMLAttributes;
    compact?: boolean;
    options?: { value: string; name: string }[];
}

const main = useMain();
const searchBarWrapper = ref<null | HTMLElement>(null);

const keyboardInput = ref<HTMLAttributes["inputmode"]>("tel");
const switchKeyboard = () => {
    if (main.getSearchMode === "ean") {
        keyboardInput.value = "text";
        main.setSearchMode("text");
    } else {
        keyboardInput.value = "tel";
        main.setSearchMode("ean");
    }
    if (searchBarWrapper.value) {
        searchBarWrapper.value.querySelector('input')?.focus()
    }
};

onMounted(() => {
    if (main.getSearchMode === "ean") {
        keyboardInput.value = "tel";
    } else if (main.getSearchMode === "text") {
        keyboardInput.value = "text";
    } else {
        keyboardInput.value = "text";
    }
});

const props = defineProps<inputPropType>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();
</script>
