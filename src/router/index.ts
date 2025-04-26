/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
//import { createRouter, createWebHistory } from 'vue-router/auto'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //extendRoutes: setupLayouts,
  routes: setupLayouts(routes),
})

export default router
