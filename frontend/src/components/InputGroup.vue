<template>
    <div class="my-2">
        <label :for="props.name" class="block mb-1 font-semibold" v-if="props.compact === false">{{
            props.prettyname
        }}</label>
        <select
            v-if="props.options"
            :value="modelValue"
            class="border border-solid border-gray-500 rounded-sm outline-none px-2 py-1 w-full"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"

        >
            <option v-for="opt in props.options" :value="opt.value">
                {{ opt.name }}
            </option>
        </select>
        <input
            v-else
            :value="val"
            :type="props.type"
            :id="props.name"
            :name="props.name"
            :placeholder="(props.compact ? props.prettyname: props.prettyname)"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            class="border border-solid border-gray-500 rounded-sm outline-none px-2 py-1 w-full"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, InputHTMLAttributes } from "vue";

const props = defineProps<{
    modelValue: any;
    name: string;
    prettyname: string;
    type?: string;
    inputAttrs?: InputHTMLAttributes;
    compact?: boolean,
    options?: {value: string, name: string}[]
}>();

const val = computed(() => {
    if(props.type === 'date') {
        return (new Date(props.modelValue))?.toJSON()?.slice(0,10) || ''
    } else {
        return props.modelValue
    }
})

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();
</script>
