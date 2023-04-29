<template>
    <div class="flex items-center">
        <!-- :value="props.modelValue" -->
        <InputGroup
            :modelValue="props.modelValue"
            name="ean"
            prettyname="EAN Code"
            type="text"
            :inputmode="keyboardInput"
            class="w-full"
            :compact="true"
            @update:modelValue="emit('update:modelValue', $event)"
            
        />
        <button class="border border-gray-500 py-1 px-2 border-l-0" @click="switchKeyboard">
            <CaseSensitive v-if="keyboardInput === 'tel'" />
            <Binary v-else />
        </button>
    </div>
</template>

<script setup lang="ts">
import { CaseSensitive, Binary } from 'lucide-vue-next';
import { HTMLAttributes, ref } from 'vue';
import InputGroup from './InputGroup.vue'
import type { inputPropType as _inputPropType } from './InputGroup.vue';

interface inputPropType extends _inputPropType {}

const tst = (E: any) =>{
    console.log(E)
}

const keyboardInput = ref<HTMLAttributes['inputmode']>('tel')
const switchKeyboard = () => {
    if(keyboardInput.value === 'tel') {
        keyboardInput.value = 'text'
    } else {
        keyboardInput.value = 'tel'
    }
}

const props = defineProps<inputPropType>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();
</script>