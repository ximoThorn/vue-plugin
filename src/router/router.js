
import Router from 'vue-router';

import mobiles from './mobile';
import pcs from './pc';

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('../page/index.vue'),
    },
    {
      path: '/mobile',
      component: () => import('../page/mobile/index.vue'),
    },
    {
      path: '/pc',
      component: () => import('../page/pc/index.vue'),
    },
    ...mobiles,
    ...pcs,
  ]
})
