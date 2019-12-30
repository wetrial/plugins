import { findMountRoute } from '../index';

describe('utils/index', () => {
  const appRoute = [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'dashboard',
              component: './Welcome',
            },
          ],
        },
      ],
    },
  ];

  it('findMountRoute should find BasicLayout Route', () => {
    const mountRoute = findMountRoute(appRoute, ['/', '/']);
    expect(mountRoute.component).toEqual('../layouts/BasicLayout');
  });

  it('findMountRoute should find dashboard Route', () => {
    const mountRoute = findMountRoute(appRoute, ['/', '/', '/welcome']);
    expect(mountRoute.component).toEqual('./Welcome');
  });
});
