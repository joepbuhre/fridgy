import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    routes: [{
            name: 'Home',
            path: '/',
            component: () =>
                import ('../views/HomeView.vue'),
        },
        {
            name: 'Item',
            path: '/item/:EAN',
            component: () => import('../views/ItemView.vue')
        }
    ],
    history: createWebHashHistory()
})


export default router