<template>
    <header
        ref="header"
        class="px-5 pb-2 flex justify-between items-center sticky top-0 p-2 z-40 w-full ease-linear duration-300 bg-white md:w-1/5 "
        :class="{
            '!bg-blue-700 text-white !p-safe shadow-md': isScroll && ismobile,
        }"
    >
        <router-link to="/" 
            ><h1 class="font-bold text-2xl flex items-center py-2 z-50 md:fixed md:text-white md:top-0">
                <Refrigerator /> Fridgy 
            </h1></router-link
        >

        <button
            @click="toggleMenu"
            class="z-50 relative flex justify-center items-center ml-3 w-10 md:hidden h-5"
        >
            <TransitionGroup
                enter-active-class="ease duration-500"
                leave-active-class="duration-500"
                enter-from-class="-rotate-180 opacity-0"
                leave-to-class="rotate-180 opacity-0"
            >
                <Menu
                    class="absolute w-10"
                    aria-hidden="true"
                    v-show="base.iscollapsed"
                />
                <X
                    aria-hidden="true"
                    class="absolute w-10 text-dark-blue"
                    v-show="!base.iscollapsed"
                />
            </TransitionGroup>
        </button>
        <TheOverlay @click="toggleMenu" :show="!collapsed && ismobile" />
        <transition
            name="slide-fade"
            enter-active-class="ease duration-200"
            leave-active-class=" duration-200"
            enter-from-class="translate-x-10 opacity-0"
            leave-to-class="translate-x-10 opacity-0"
        >
            <nav
                v-if="!collapsed"
                class="h-screen w-2/3 bg-blue-700 text-white absolute md:block top-0 bottom-0 right-0 py-10 px-3 md:w-1/6 md:fixed md:left-0"
            >

                <router-link
                    v-for="link in links"
                    class="block my-4 py-1 bg-slate-50 bg-opacity-10 px-2 rounded-lg"
                    active-class="!bg-opacity-40"
                    :to="link.location"

                    @click="toggleMenu"
                    >{{ link.description }}</router-link
                >

                <!-- <button @click="reload">Reload</button> -->
            </nav>
        </transition>
    </header>
</template>

<script setup lang="ts">
import TheOverlay from "./TheOverlay.vue";
import { Menu, X, Refrigerator } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useWindowScroll } from '@vueuse/core'

import {RouteLocationRaw} from 'vue-router'

const {x,y} = useWindowScroll()

const isScroll = computed(() => (y.value > 70))

const base = ref({
    msg: "test",
    iscollapsed: true,
    closeall: false,
    headerheight: 82,
    services: [],
    mobileClass: {
        "mobile-hidden": true,
    },
    classes: {
        active: "bg-white text-dark-blue py-3 drop-shadow-lg",
        inactive: "bg-dark-blue text-white py-5",
    },
    linksColl: {
        home: {
            name: "Home",
            routerLink: {
                name: "Home",
            },
        },
        about: {
            name: "Over ons",
            routerLink: {
                name: "Waarom Iuvox?",
            },
        },
        cases: {
            name: "Cases",
            routerLink: {
                name: "Cases",
            },
        },
    },
});

const toggleMenu = () => {
    base.value.iscollapsed = !base.value.iscollapsed;
};

const reload = () => window.location.reload()

const links = ref<{description: string, location: RouteLocationRaw}[]>([
    {
        description: "Home",
        location: {
            path: '/'
        }
    },
    {
        description: 'Items',
        location: {
            path: '/items'
        }
    },
    {
        description: 'Locations',
        location: {
            path: '/locations'
        }
    },
    {
        description: 'Inventory Scanner',
        location: {
            path: '/inventory-scanner'
        }
    },
    {
        description: 'Shopping List',
        location: {
            path: '/shopping-list'
        }
    },
])

const ismobile = computed(() => {
    if (import.meta.env.SSR) {
        return false;
    } else {
        return !window.matchMedia("(min-width: 768px)").matches;
    }
});
const collapsed = computed(() => {
    return base.value.iscollapsed && ismobile.value;
});
</script>
