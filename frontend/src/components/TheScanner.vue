<template>
    <div>
        <div class="flex items-center my-2">
            <InputGroup
                v-if="!isTextInput"
                :options="cameraOpts"
                v-model="selectedDeviceId"
                name="camera"
                prettyname="camera"
                class="w-full !my-0"
                :compact="true"
            />
            <TheSearchBar 
                v-if="isTextInput"
                v-model="textValue" name="Search" prettyname="search"  
            />
            <button
                v-if="!isTextInput"
                @click="toggleScanner"
                class="px-2 py-1 w-1/4 bg-white border border-solid border-gray-500 border-l-0 flex justify-center"
            >
                <XOctagon v-if="!scannerStopped" />
                <PlayCircle v-else />
            </button>
            <button
                v-if="props.allowTextInput"
                class="px-2 py-1 w-1/4 bg-white border border-solid border-gray-500 border-l-0 flex justify-center"
                @click="setTextInput"
            >
                <Camera v-if="isTextInput" />
                <CameraOff v-else />
            </button>
            <button
                v-if="props.enableSwitchTorch"
                class="px-2 py-1 w-1/4 bg-white border border-solid border-gray-500 border-l-0 flex justify-center"
            >
                <Flashlight />
            </button>
        </div>
        <div v-if="!isTextInput" class="container">
            <div class="overflow-hidden w-full rounded-sm shadow-sm" ref="videoWrapperEl">
                <video
                    id="video"
                    autoplay
                    playsinline
                    class="scale-[2] object-cover pointer-events-none'"
                    ref="videoEl"
                ></video>
            </div>
            <canvas
                id="myCanvas"
                width="270"
                height="135"
                style="border: 1px solid #d3d3d3"
                class="w-full hidden"
                ref="canvasEl"
            >
            </canvas>

            <div id="sourceSelectPanel" style="display: none">
                <label for="sourceSelect">Change video source:</label>
                <select id="sourceSelect" style="max-width: 400px"></select>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BrowserMultiFormatReader } from "@zxing/browser";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useMain } from "../store/main";
import InputGroup from "./InputGroup.vue";
import { XOctagon } from "lucide-vue-next";
import { Flashlight } from "lucide-vue-next";
import { PlayCircle, Camera, CameraOff } from "lucide-vue-next";
import TheSearchBar from "./TheSearchBar.vue";
import { debounce } from "../utils/helpers";
import { emit } from "process";

const additions = ref<string[]>([]);

const isTextInput = ref<boolean>(false)
const textValue = ref<string>("")

watch(textValue, (newVal, oldVal) => {
    keydownCheck()
})

const keydownCheck = debounce(() => {
    emits('found', textValue.value)
}, 1000)

const setTextInput = () => {
    isTextInput.value = !isTextInput.value
    toggleScanner();

}

const videoWrapperEl = ref<HTMLDivElement | null>(null);

// Props
const props = defineProps<{
    enableSwitchTorch?: boolean;
    allowTextInput?: boolean
}>();

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

// Declare variables
const scale = ref<number>(2);
const setImageInterval = ref<number>(0);
const stream = ref<MediaStream | null>(null);
const videoEl = ref<HTMLVideoElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);
const scannerStopped = ref<boolean>(false);


// Video controls
const stopScanning = () => {
    if (stream.value) {
        stream.value.getTracks().forEach((track: MediaStreamTrack) => {
            track.stop();
        });
        if (videoEl.value) {
            videoEl.value.srcObject = null;
            clearInterval(setImageInterval.value);
        }
    }
};

const scan = async (deviceId: string) => {
    stopScanning();

    const constraints: MediaStreamConstraints = {
        video: {
            advanced: [
                {
                    deviceId: deviceId,
                },
            ],
        },
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((strm: MediaStream) => {
            stream.value = strm;
            if (videoEl.value) {
                videoEl.value.srcObject = strm;
                videoEl.value.addEventListener("play", scanBarcode);
            }
        })
        .catch((err) => {
            console.warn(err);
        });
};

const toggleScanner = () => {
    if (scannerStopped.value) {
        scan(selectedDeviceId.value);
    } else if (stream.value) {
        stopScanning();
    }
    scannerStopped.value = !scannerStopped.value;
};

// Prepare Video Devices
const getVideoDevices = async () => {
    await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((res) => {
            // allowed
        })
        .catch((err) => {
            // not allowed
        });

    const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
        (device) => device.kind === "videoinput"
    );

    cameras.value = devices;
    selectedDeviceId.value = devices[0].deviceId;

    if (main.getpreferredCamera === "") {
        main.setCamera(selectedDeviceId.value);
    }
};

// Scan barcode from canvas
const scanBarcode = () => {
    // handle play callback
    let canvas: HTMLCanvasElement, video: HTMLVideoElement, videoWrapper: HTMLDivElement;
    if(canvasEl.value === null || videoEl.value === null || videoWrapperEl.value === null) {
        console.log('not scanning!')
        return false
    }
    canvas = canvasEl.value
    video = videoEl.value
    videoWrapper = videoWrapperEl.value

    const v = document.querySelector("video") as HTMLVideoElement;
    const c = document.querySelector("canvas") as HTMLCanvasElement;
    const _scale = 1 / scale.value;
    const ctx: CanvasRenderingContext2D | null = c.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight / scale.value;

    videoWrapper.style.height = (video.videoHeight - video.videoHeight * _scale) / 2 + 'px';

    const bmfr = new BrowserMultiFormatReader();
    // set position of orange frame in video
    setImageInterval.value = window.setInterval(() => {
        if (ctx) {
            ctx.drawImage(
                v,
                // source x, y, w, h:
                (video.videoWidth - video.videoWidth * _scale) / scale.value,
                (video.videoHeight - video.videoHeight * _scale) / scale.value,
                video.videoWidth * _scale,
                (video.videoHeight * _scale) / scale.value,
                // dest x, y, w, h:
                0,
                0,
                canvas.width,
                canvas.height
            );
            try {
                const res = bmfr.decodeFromCanvas(c).getText();
                additions.value.push(res)
                emits("found", res);
                stopScanning();
            } catch (error) {
                console.log('not found')
            }
        }
    }, 50);
};

// Execute on mounted
onMounted(async () => {
    await getVideoDevices();
    selectedDeviceId.value = main.getpreferredCamera;

    await scan(selectedDeviceId.value);
});

// Switch device 
watch(selectedDeviceId, (selectedDeviceId, old) => {
    if (old !== "") {
        main.setCamera(selectedDeviceId);
        scan(selectedDeviceId);
    }
});

const emits = defineEmits<{
    (e: "found", value: string): void;
}>();


onUnmounted(() => {
    scannerStopped.value = false;
    clearInterval(setImageInterval.value);
    stopScanning();
});
</script>
