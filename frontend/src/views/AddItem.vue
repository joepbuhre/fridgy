<template>
    <form>
        <div>
            <label for="EAN" class="block">Ean</label>
            <input id="EAN" class="px-2 py-1 border-2 border-slate-100 outline-none" type="text" />
        </div>
        <button class="px-2 py-1 bg-blue-800 rounded-sm text-white">
            Verstuur
        </button>
    </form>
    <div class="px-4 py-2">
        <h1 class="font-bold text-2xl">Fridgy</h1>
        
        <div class="flex">
            <button
            class="px-2 py-1 bg-blue-800 rounded-sm text-white"
            @click="scan"
        >
            Scan here
        </button>
        <button
            class="px-2 py-1 text-blue-800 rounded-sm bg-white border border-blue-800"
            @click="restart"
        >
            Restart scanner
        </button>
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
        <div v-for="item in additions">
            <div
                class="flex relative my-6 justify-around border border-slate-400 p-1 rounded-sm"
            >
                <div class="w-2/3">
                    <h4 class="font-semibold">{{ item }}</h4>
                    <span>Vriezer</span>
                    <div>
                        <span
                            class="bg-green-100 text-green-500 border border-green-500 font-bold text-sm w-auto px-2 py-[1px] rounded-sm"
                        >
                            2 op voorraad</span
                        >
                    </div>
                </div>
                <div class="w-auto">
                    <div
                        class="text-red-700 bg-red-100 font-bold px-2 py-1 rounded-md"
                    >
                        1 days
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BrowserCodeReader, BrowserQRCodeReader } from '@zxing/browser';
import { BrowserBarcodeReader, Result } from '@zxing/library';
import { ref } from 'vue';
import { api } from '../utils/api';

const additions = ref<string[]>([])

const codeReader = ref<BrowserBarcodeReader | undefined>(undefined)

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
                console.log(res)
                if(additions.value.indexOf(res.getText()) < 0) {
                    additions.value.push(res.getText())
                }
            }
        })
    }
    console.log(videoInputDevices)


}

const restart = () => {
    codeReader.value?.reset()
    scan()
}

</script>
