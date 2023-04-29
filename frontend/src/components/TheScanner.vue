<template>
    <div class="px-4 py-2">
        <div class="flex items-center my-2">
            <InputGroup
                :options="cameraOpts"
                v-model="selectedDeviceId"
                name="camera"
                prettyname="camera"
                class="w-full !my-0"
                :compact="true"
            />
            <button
                @click="toggleScanner"
                class="px-2 py-1 w-1/4 bg-white border border-solid border-gray-500 border-l-0 flex justify-center"
            >
                <XOctagon v-if="!scannerStopped" />
                <PlayCircle v-else />
            </button>
            <button
                v-if="props.enableSwitchTorch"
                class="px-2 py-1 w-1/4 bg-white border border-solid border-gray-500 border-l-0 flex justify-center"
            >
                <Flashlight />
            </button>
        </div>
        <section class="container" id="demo-content">
            <div>
                <!-- transform:scale(1.5); -->
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
            </div>

            <div id="sourceSelectPanel" style="display: none">
                <label for="sourceSelect">Change video source:</label>
                <select id="sourceSelect" style="max-width: 400px"></select>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { BrowserMultiFormatReader } from "@zxing/browser";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useMain } from "../store/main";
import InputGroup from "./InputGroup.vue";
import { XOctagon } from "lucide-vue-next";
import { Flashlight } from "lucide-vue-next";
import { PlayCircle } from "lucide-vue-next";

const additions = ref<string[]>([]);

const videoWrapperEl = ref<HTMLDivElement | null>(null);

// Props
const props = defineProps<{
    enableSwitchTorch?: boolean;
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
    setImageInterval.value = setInterval(() => {
        if (ctx) {
            ctx.drawImage(
                v,
                // source x, y, w, h:
                (video.videoWidth - video.videoWidth * _scale) / 2,
                (video.videoHeight - video.videoHeight * _scale) / 2,
                video.videoWidth * _scale,
                (video.videoHeight * _scale) / 2,
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
                console.log("not found");
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
