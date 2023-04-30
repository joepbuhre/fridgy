<template>
    <div class="my-2" :class="{ 'flex gap-5': props.type === 'checkbox' }">
        <label :for="props.name" class="block mb-1 font-semibold" v-if="props.compact === false">{{
            props.prettyname
        }}</label>
        <div v-if="props.options" class="select-wrapper w-full">
            <select
                :value="modelValue"
                class="border border-solid border-gray-500 rounded-sm outline-none px-2 py-1 w-full"
                @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            >
                <option v-for="opt in props.options" :value="opt.value">
                    {{ opt.name }}
                </option>
            </select>
        </div>
        <input
            v-else-if="props.type === 'checkbox'"
            :checked="val"
            :type="props.type"
            :id="props.name"
            :name="props.name"
            :placeholder="props.compact ? props.prettyname : props.prettyname"
            @change="emit('update:modelValue', ($event.target as any).checked)"
            class="border border-solid border-gray-500 rounded-sm outline-none px-2 py-1"
        />
        <input
            v-else
            :value="val"
            :type="props.type"
            :inputmode="inputMode"
            :id="props.name"
            :name="props.name"
            :placeholder="props.compact ? props.prettyname : props.prettyname"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            v-bind="inputAttrs"
            class="border border-solid border-gray-500 rounded-sm outline-none px-2 py-1 w-full read-only:bg-gray-200 read-only:text-gray-500"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, HTMLAttributes, InputHTMLAttributes } from "vue";

export interface inputPropType {
    modelValue: any;
    name: string;
    prettyname: string;
    type?: string;
    inputmode?: HTMLAttributes["inputmode"];
    inputAttrs?: InputHTMLAttributes;
    compact?: boolean;
    options?: { value: string; name: string }[];
}

const props = defineProps<inputPropType>();

const inputMode = computed(() => {
    if (props.inputmode) {
        return props.inputmode;
    } else {
        return "text";
    }
});

const val = computed(() => {
    if (props.type === "date") {
        return new Date(props.modelValue)?.toJSON()?.slice(0, 10) || "";
    } else if (props.type === "checkbox") {
        return Boolean(props.modelValue);
    } else {
        return props.modelValue;
    }
});

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();
</script>

<style>
select {
    appearance: none;
    -webkit-appearance: none;
    background-color: inherit;
    border: inherit;
    border-color: initial;
    border-radius: initial;
}
.select-wrapper {
    position: relative;
    display: inline-block;
}
.select-wrapper:after {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-chevron-down'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    color: gray;
    background-color: white;
    right: 5px;
    height: calc(100% - 2px);
    padding: 7px 0px 0px 8px;
    margin-top: 1px;
    margin-bottom: 1px;
    position: absolute;
}
</style>
