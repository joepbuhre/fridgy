<template>
    <div class="px-4 py-2">
        <div class="flex gap-2 items-center my-2">
            <!-- <button
                class="px-2 py-1 text-blue-800 rounded-sm bg-white border border-blue-800"
                @click="restart"
            >
                Restart scanner
            </button> -->
            <div>
                <TheButton
                    @click="stopScanner"
                    class="px-2 py-1 w-1/4 text-blue-800 rounded-sm bg-white border border-blue-800"
                >
                    Stop
                </TheButton>
            </div>
            <InputGroup
                :options="
                    cameras.map((el) => ({
                        value: el.deviceId,
                        name: el.label,
                    }))
                "
                v-model="selectedDeviceId"
                name="camera"
                prettyname="camera"
                class="w-3/4 !my-0"
                :compact="true"
            />
        </div>
        <div></div>
        <section class="container" id="demo-content">
            <div>
                <video
                    id="video"
                    width="600"
                    height="400"
                    style="border: 1px solid gray"
                ></video>
            </div>

            <div id="sourceSelectPanel" style="display: none">
                <label for="sourceSelect">Change video source:</label>
                <select id="sourceSelect" style="max-width: 400px"></select>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { BrowserCodeReader, BrowserQRCodeReader } from "@zxing/browser";
import { BrowserBarcodeReader, Result } from "@zxing/library";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { api } from "../utils/api";
import InputGroup from "./InputGroup.vue";

const additions = ref<string[]>([]);

const codeReader = ref<BrowserBarcodeReader | undefined>(undefined);

const cameras = ref<any[]>([])
const selectedDeviceId = ref<string>('')

onMounted(() => {
    scan();
});




const scan = async () => {
    const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
    codeReader.value = new BrowserBarcodeReader();

    // choose your media device (webcam, frontal camera, back camera, etc.)
    if(selectedDeviceId.value === '') {
        selectedDeviceId.value = videoInputDevices[0].deviceId;
    }
    cameras.value = videoInputDevices


    console.log(`Started decode from camera with id ${selectedDeviceId}`);

    const previewElem: HTMLVideoElement | null =
        document.querySelector("video");
    console.log(previewElem);
    if (previewElem !== null) {
        // you can use the controls to stop() the scan or switchTorch() if available
        codeReader.value.decodeFromVideoDevice(
            selectedDeviceId.value,
            previewElem,
            (res: Result, error: any) => {
                if (res) {
                    emits("found", res.getText());
                    if (additions.value.indexOf(res.getText()) < 0) {
                        additions.value.push(res.getText());
                    }
                }
            }
        );
    }
};

watch(selectedDeviceId, (selectedDeviceId, old) => {
    scan()
})

const emits = defineEmits<{
    (e: "found", value: string): void;
}>();

const restart = () => {
    codeReader.value?.reset();
    scan();
};

const stopScanner = () => {
    console.log("stopping");
    codeReader.value?.reset();
};

onUnmounted(stopScanner);
</script>
