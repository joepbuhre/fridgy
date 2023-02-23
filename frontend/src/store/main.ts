import { defineStore } from "pinia";

export const useMain = defineStore('Main', {
    state() {
        return {
            preferredCamera: ''
        }
    },
    getters: {
        getpreferredCamera(state):string {
                return state.preferredCamera || ''
           
        }
    },
    actions: {
        setCamera(id: string) {
            this.preferredCamera = id
        },
    },
    persist: {
        enabled: true
    }
})
