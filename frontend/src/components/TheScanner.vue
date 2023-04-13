<template>
    <div class="px-4 py-2">
        <div class="flex items-center my-2">
            <!-- <button
                class="px-2 py-1 text-blue-800 rounded-sm bg-white border border-blue-800"
                @click="restart"
            >
                Restart scanner
            </button> -->
            <InputGroup
                :options="cameraOpts"
                v-model="selectedDeviceId"
                name="camera"
                prettyname="camera"
                class="w-3/4 !my-0"
                :compact="true"
            />
            <TheButton
                @click="toggleScanner"
                class="px-2 py-1 w-1/4 bg-white border border-solid border-gray-500 border-l-0 flex justify-center"
            >
                <XOctagon v-if="!scannerStopped" />
                <PlayCircle v-else />
            </TheButton>
            <TheButton
                @click="switchTorch"
                class="px-2 py-1 w-1/4 bg-white border border-solid border-gray-500 border-l-0 flex justify-center"
            >
                <Flashlight />
            </TheButton>
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
import {
    BrowserCodeReader,
    BrowserMultiFormatReader,
    BrowserQRCodeReader,
    IScannerControls,
} from "@zxing/browser";
import { Exception, Result } from "@zxing/library";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useMain } from "../store/main";
import { api } from "../utils/api";
import InputGroup from "./InputGroup.vue";
import { XOctagon } from "lucide-vue-next";
import { Flashlight } from "lucide-vue-next";
import { PlayCircle } from "lucide-vue-next";

const additions = ref<string[]>([]);

const codeReader = ref<BrowserMultiFormatReader | undefined>(undefined);
const controls = ref<IScannerControls | undefined>(undefined);

// Camera options
const cameras = ref<any[]>([]);
const cameraOpts = computed(() =>
    cameras.value.map((el) => ({
        value: el.deviceId,
        name: el.label,
    }))
);
const selectedDeviceId = ref<string>("");

// Store
const main = useMain();

const prepare = async () => {
    const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
    cameras.value = videoInputDevices;
    selectedDeviceId.value = videoInputDevices[0].deviceId;
    if (main.getpreferredCamera === "") {
        main.setCamera(selectedDeviceId.value);
    }
};

const scan = async () => {
    codeReader.value = new BrowserMultiFormatReader();

    // choose your media device (webcam, frontal camera, back camera, etc.)
    if (selectedDeviceId.value === "") {
        selectedDeviceId.value = cameras.value[0].deviceId;
    }

    console.log(`Started decode from camera with id ${selectedDeviceId}`);

    const previewElem: HTMLVideoElement | null =
        document.querySelector("video");
    console.log(previewElem);
    if (previewElem !== null) {
        // you can use the controls to stop() the scan or switchTorch() if available
        controls.value = await codeReader.value.decodeFromVideoDevice(
            selectedDeviceId.value,
            previewElem,
            (
                res: Result | undefined,
                error: Exception | undefined,
                controls: IScannerControls | undefined
            ) => {
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

onMounted(async () => {
    await prepare();
    selectedDeviceId.value = main.getpreferredCamera;
    scan();
});

watch(selectedDeviceId, (selectedDeviceId, old) => {
    if (old !== "") {
        scan();
        main.setCamera(selectedDeviceId);
    }
});

const emits = defineEmits<{
    (e: "found", value: string): void;
}>();

const restart = () => {
    // codeReader.value?.reset();
    scan();
};

const scannerStopped = ref<boolean>(false);
const toggleScanner = () => {
    if (scannerStopped.value) {
        scan();
    } else {
        controls.value?.stop();
    }
    scannerStopped.value = !scannerStopped.value;
};

const switchTorch = () => {
    if (controls?.value?.switchTorch) {
        controls.value.switchTorch(true);
    }
};

onUnmounted(() => {
    scannerStopped.value = false;
    toggleScanner();
});
</script>
