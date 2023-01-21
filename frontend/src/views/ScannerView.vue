<template>
    <div class="px-4 py-2">
        <h1 class="font-bold text-2xl">Fridgy</h1>
        <button class="bg-gray-100 text-gray-500 border border-gray-500 px-3" @click="clickk">
            Scan here
        </button>
        <section class="container" id="demo-content">
         
            <div>
                <video id="video" width="600" height="400" style="border: 1px solid gray"></video>
            </div>

            <div id="sourceSelectPanel" style="display:none">
                <label for="sourceSelect">Change video source:</label>
                <select id="sourceSelect" style="max-width:400px">
                </select>
            </div>
            <pre>
                {{ resultZX }}
            </pre>

        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as ZXing from "@zxing/library";

const resultZX = ref<any>(null)

// or with ES6 modules

const clickk = () => {
    let selectedDeviceId;
            const codeReader = new ZXing.BrowserBarcodeReader()
            console.log('ZXing code reader initialized')
            codeReader.listVideoInputDevices()
                .then((videoInputDevices) => {


                     codeReader.decodeOnceFromVideoDevice(videoInputDevices[0].deviceId, 'video').then((result) => {
                            resultZX.value = result.getText()
                            // document.getElementById('result').textContent = result.text
                            alert(result.getText())
                        }).catch((err) => {
                            console.error(err)
                            // document.getElementById('result').textContent = err
                        })
                        console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
                

                })
}
</script>
