import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    routes: [
        {
            name: "Home",
            path: "/",
            component: () => import("../views/HomeView.vue"),
        },
        {
            name: "Item",
            path: "/item/:EAN",
            component: () => import("../views/ItemView.vue"),
        },
        {
            name: "Add Item",
            path: "/add",
            component: () => import("../views/AddItem.vue"),
        },
        {
            name: "Locations",
            path: "/locations",
            component: () => import("../views/Locations.vue")
        }
    ],
    history: createWebHashHistory(),
});

export default router;
