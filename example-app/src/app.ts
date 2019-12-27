import { IRoute } from 'umi-types';
import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';

export const dva = {
  config: {
    onError(err: any) {
      console.error(err);
      err.preventDefault();
    },
  },
};

export function patchRoutes(routes: IRoute[]) {
  // const rootRoute = routes.find(m => m.path === '/');
  // if (!rootRoute) {
  //   throw Error('没有找到根路由!');
  // }
  // rootRoute.routes = rootRoute.routes || [];
  // console.log(require(`../../src/routes`).default);
  // console.log(require('./pages/Welcome').default);
  // console.log(routes);
  // routes[1].routes[0].routes.push({
  //   path: '/blogs',
  //   name: '测试页面',
  //   icon: 'crown',
  //   exact: true,
  //   component: require('./pages/Welcome').default,
  // });
  // console.log(routes);
  // const moduleAlias = require('module-alias');
  // moduleAlias.addAlias('@wetrial', join(__dirname, '../src'));
  // const blogRoutes = require('@wetrial/routes.ts');
  // blogRoutes.forEach((item: IRoute) => {
  //   rootRoute.routes?.push({
  //     ...item,
  //     component: require(item.component).default,
  //   });
  // });
  // rootRoute.routes.push({
  //   path: '/blogs',
  //   component:require('@module/').default
  // })
  // routes[0].unshift({
  //   path: '/foo',
  //   component: require('./routes/foo').default,
  // });
}

export function render(oldRender: any) {
  oldRender();
}
