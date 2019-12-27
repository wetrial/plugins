// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from 'umi-types';
import { findMountRoute, getModuleRoutes } from './utils';

export interface IOption {
  modules: string[];
  mountPaths: string[];
}

export default function(api: IApi, options: IOption) {
  const { paths } = api;
  api.onOptionChange(newOpts => {
    // eslint-disable-next-line no-param-reassign
    options = newOpts;
    api.rebuildTmpFiles('umi-plugins-module:option change');
  });

  // api.addPageWatcher("")

  api.modifyRoutes(routes => {
    const newRoutes = [...routes];
    // 查询要挂在的路由节点(挂载的路由都将放在改路由的routes里)
    const mountRoute = findMountRoute(newRoutes, options.mountPaths);
    // 得到模块的绝对根路径
    const moduleRoutes = options.modules.map(m => getModuleRoutes(m, paths.cwd));
    mountRoute.routes = [...mountRoute.routes, ...moduleRoutes];

    return newRoutes;
  });
}
