// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from 'umi-types';
import { findMountRoute, getModuleRoutes } from './utils';
import { resolve } from 'path';

export interface IOption {
  modules: string[];
  mountPaths: string[];
  pageMode?: 'src' | 'lib' | 'es';
}

export default function(api: IApi, options: IOption) {
  const { paths } = api;
  api.onOptionChange(newOpts => {
    // eslint-disable-next-line no-param-reassign
    options = newOpts;
    api.rebuildTmpFiles('umi-plugins-module:option change');
  });

  // 如果开发模式下，则监听文件改动
  if (options.modules.filter(m => m.startsWith('.')).length > 0) {
    api.log.log(`in addPageWatch:${resolve(paths.cwd, '../lib/*.js')}`);
    api.addPageWatcher([resolve(paths.cwd, '../lib/*.js')]);
  }

  api.modifyRoutes(routes => {
    const newRoutes = [...routes];
    // 查询要挂在的路由节点(挂载的路由都将放在改路由的routes里)
    const mountRoute = findMountRoute(newRoutes, options.mountPaths);
    // 得到模块的绝对根路径
    let moduleRoutes = mountRoute.routes;
    options.modules.forEach(m => {
      const moduleItemRoutes = getModuleRoutes(m, paths.cwd, options.pageMode || 'es');
      moduleRoutes = [...moduleRoutes, ...moduleItemRoutes];
    });

    const beforeRoutes = moduleRoutes.filter(m => m.path);
    const lastRoutes = moduleRoutes.filter(m => !m.path);

    mountRoute.routes = [...beforeRoutes, ...lastRoutes];
    return newRoutes;
  });
}
