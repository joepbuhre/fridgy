import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from '../views/HomeView.vue'
import ItemOverviewView from '../views/ItemOverviewView.vue'
import ItemView from '../views/ItemView.vue'
import AddItem from '../views/AddItem.vue'
import Locations from '../views/Locations.vue'
import ShoppingList from '../views/ShoppingList.vue'
import InventarisationView from '../views/InventoryScanner.vue'

const router = createRouter({
    routes: [
        {
            name: "Home",
            path: "/",
            component: HomeView,
        },
        {
            name: "Items",
            path: "/items",
            component: ItemOverviewView
        },
        {
            name: "Item",
            path: "/item/:EAN",
            component: ItemView,
        },
        {
            name: "Add Item",
            path: "/add",
            component: AddItem,
        },
        {
            name: "Locations",
            path: "/locations",
            component: Locations,
        },
        {
            name: "Shopping List",
            path: "/shopping-list",
            component: ShoppingList,
        },
        {
            name: "Inventory Scanner",
            path: "/inventory-scanner",
            component: InventarisationView
        }
    ],
    history: createWebHashHistory(),
});

export default router;
