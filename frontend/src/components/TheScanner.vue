<template>
    <div class="px-4 py-2">
        <div class="flex">
        <button
            class="px-2 py-1 text-blue-800 rounded-sm bg-white border border-blue-800"
            @click="restart"
        >
            Restart scanner
        </button>
        <TheButton @click="stopScanner">
            Stop
        </TheButton>
        </div>
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
import { BrowserCodeReader, BrowserQRCodeReader } from '@zxing/browser';
import { BrowserBarcodeReader, Result } from '@zxing/library';
import { onMounted, onUnmounted, ref } from 'vue';
import { api } from '../utils/api';

const additions = ref<string[]>([])

const codeReader = ref<BrowserBarcodeReader | undefined>(undefined)

onMounted(() => {
    scan()
})

const scan = async () => {
    
    const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
    codeReader.value = new BrowserBarcodeReader();

    // choose your media device (webcam, frontal camera, back camera, etc.)
    let selectedDeviceId = videoInputDevices[0].deviceId;
    
    for (let i = 0; i < videoInputDevices.length; i++) {
        const el = videoInputDevices[i];
        if(el.label === 'Back Camera') {
            selectedDeviceId = el.deviceId
        }
    }

    console.log(`Started decode from camera with id ${selectedDeviceId}`);

    const previewElem: HTMLVideoElement | null = document.querySelector('video');
    console.log(previewElem)
    if(previewElem !== null) {
        // you can use the controls to stop() the scan or switchTorch() if available
        codeReader.value.decodeFromVideoDevice(selectedDeviceId, previewElem, (res: Result, error: any) => {
            if(res) {
                emits('found', res.getText())
                if(additions.value.indexOf(res.getText()) < 0) {
                    additions.value.push(res.getText())
                }
            }
        })
    }
}

const emits = defineEmits<{
    (e: "found", value: string): void;
}>()


const restart = () => {
    codeReader.value?.reset()
    scan()
}

const stopScanner = () => {
    console.log('stopping')
    codeReader.value?.reset()
}

onUnmounted(stopScanner)
</script>
