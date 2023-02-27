<template>
    <header
        ref="header"
        class="px-5 flex justify-between items-center pt-3 sticky top-0 z-40 ease-linear duration-300"
    >
    <router-link to="/" ><h1 class="font-bold text-2xl flex items-center" ><Refrigerator/> Fridgy</h1></router-link>

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
                    key="menuicon"
                    class="absolute w-10"
                    aria-hidden="true"
                    v-show="base.iscollapsed"
                />
                <X
                    aria-hidden="true"
                    key="closeicon"
                    class="absolute w-10 text-dark-blue"
                    v-show="!base.iscollapsed"
                />
            </TransitionGroup>
        </button>
        <transition
            name="slide-fade"
            enter-active-class="ease duration-200"
            leave-active-class=" duration-200"
            enter-from-class="translate-x-10 opacity-0"
            leave-to-class="translate-x-10 opacity-0"
        >
            <nav
                v-show="!collapsed"
                class="fixed right-0 top-0 bottom-0 z-30 h-screen w-8/12 p-5 bg-slate-100 text-dark-blue md:relative md:p-0 md:text-inherit md:inset-auto md:h-auto md:w-auto md:bg-transparent md:flex-1 md:pr-20"
                :class="base.mobileClass"
            >
                <ul class="pt-2 flex justify-end flex-col md:flex-row gap-6">
                    <li>
                            <span class="font-serif font-semibold">Contact</span>
                    </li>
                </ul>
            </nav>
        </transition>
        <TheOverlay @click="toggleMenu" :show="!collapsed" />
        <transition
        name="slide-fade"
        enter-active-class="ease duration-200"
        leave-active-class=" duration-200"
        enter-from-class="translate-x-10 opacity-0"
        leave-to-class="translate-x-10 opacity-0"
        >
        <nav v-if="!collapsed" class="h-screen w-2/3 bg-slate-200 absolute top-0 bottom-0 right-0 p-10">
                <router-link to="/locations">Locations</router-link>
            </nav>
        </transition>
    </header>
</template>

<script setup lang="ts">
import TheOverlay from "./TheOverlay.vue"
import { Menu, X, Refrigerator } from "lucide-vue-next";
import { computed, ref } from "vue";

const base = ref({
            msg: "test",
            iscollapsed: true,
            closeall: false,
            headerheight: 82,
            services: [],
            mobileClass: {
                'mobile-hidden': true
            },
            classes: {
                active: "bg-white text-dark-blue py-3 drop-shadow-lg",
                inactive: "bg-dark-blue text-white py-5"
            },
            linksColl: {
                home: {
                    name: "Home",
                    routerLink: {
                        name: "Home"
                    }
                },
                about: {
                    name: "Over ons",
                    routerLink: {
                        name: "Waarom Iuvox?"
                    }
                },
                cases: {
                    name: "Cases",
                    routerLink: {
                        name: "Cases"
                    }
                }
            }
        })

const toggleMenu = () => {
    base.value.iscollapsed = !base.value.iscollapsed;
}
    
const ismobile = computed(() => {
    if (import.meta.env.SSR) {
        return false
    } else {
        return !window.matchMedia('(min-width: 768px)').matches
    }
})
const collapsed = computed(() => {
    return base.value.iscollapsed
})

</script>

<style>
@media screen and (max-width: 768px) {
    nav.mobile-hidden {
        display: none;
    }
}
@media screen and (min-width: 769px) {
    nav {
        display: block !important;
    }
}
</style>