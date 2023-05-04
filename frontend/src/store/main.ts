import { defineStore } from "pinia";

interface stateType {
    preferredCamera: string,
    searchMode: "ean" | "text"
}

export const useMain = defineStore("Main", {
    state(): stateType {
        return {
            preferredCamera: "",
            searchMode: "ean" 
        };
    },
    getters: {
        getpreferredCamera(state): string {
            return state.preferredCamera || "";
        },
        getSearchMode(state): stateType['searchMode'] {
            return state.searchMode
        }
    },
    actions: {
        setCamera(id: string) {
            this.preferredCamera = id;
        },
        setSearchMode(mode: stateType["searchMode"]) {
            this.searchMode = mode
        }
    },
    persist: true
});
