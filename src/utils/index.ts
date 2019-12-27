import assert from 'assert';
import { resolve } from 'path';
import { IRoute } from 'umi-types';

/**
 * 从现有路由列表中找出要挂载的路由节点
 */
export function findMountRoute(routes: IRoute[], mountPaths: string[]) {
  let mountRoute: IRoute;
  let queryRoutes = [...routes];
  // console.log(`find mountRoute:${JSON.stringify(mountPaths)} in ${JSON.stringify(routes)}`);
  mountPaths.forEach(mountPath => {
    mountRoute = queryRoutes.find(m => m.path === mountPath);
    queryRoutes = mountRoute?.routes;
    assert(
      queryRoutes !== undefined && queryRoutes !== null,
      "[foreach] can't find mountRoute in routes",
    );
  });
  assert(
    mountRoute !== undefined && mountRoute !== null,
    "[result] can't find mountRoute in routes",
  );
  return mountRoute;
}

/**
 * 获取指定模块中的路由地址(改为绝对地址后的)
 * @param module 模块名称
 * @param absRootPath 绝对路径根路径
 */
export function getModuleRoutes(module: string, absRootPath: string) {
  const moduleAbsPath = getModuleAbsolutePath(module, absRootPath);
  // 获取模块下的路由列表
  // eslint-disable-next-line
  const originRoutes = require(resolve(moduleAbsPath, 'routes')).default;
  // 递归修改里面的路由路径为绝对路径
  const absRoutes = originRoutes.map(route => dgConvertToAbsRoutePath(route, absRootPath));
  return absRoutes;
}

/**
 * 根据模块解析出模块的绝对路径
 * @param module {string} 要解析的模块
 * @param absRootPath {string} 根绝对路径
 * @returns string 模块的绝对路径
 * @example  getModuleAbsolutePath('@wetrial/blogs') ==>$pwd/node_modules/@wetrial/blogs
 * @example  getModuleAbsolutePath('../') ==>$pwd上一级目录/
 */
function getModuleAbsolutePath(module: string, absRootPath: string) {
  // 模块可能是相对路径写法或者模块包的写法
  let moduleAbsPath: string;
  if (module.startsWith('.')) {
    moduleAbsPath = resolve(absRootPath, module, 'lib');
  } else {
    // 模块形式(定到lib模块下)
    moduleAbsPath = resolve(absRootPath, `./node_modules/${module}/lib`);
  }
  return moduleAbsPath;
}

/**
 * 将模块中路由中的相对应用地址修改为绝对路径的地址
 * @param itemRoute 路由项
 * @param absRootPath 绝对路径根路径
 */
function dgConvertToAbsRoutePath(itemRoute: any, absRootPath: string) {
  const newItemRoute: any = { ...itemRoute };
  if (newItemRoute.component) {
    newItemRoute.component = resolve(absRootPath, 'lib/pages', newItemRoute.component);
  }
  if (newItemRoute.Routes instanceof Array) {
    newItemRoute.Routes = newItemRoute.Routes.map(item => resolve(absRootPath, 'lib/pages', item));
  }
  if (newItemRoute.routes) {
    newItemRoute.routes = newItemRoute.routes.map((sItem: any) =>
      dgConvertToAbsRoutePath(sItem, absRootPath),
    );
  }
  return newItemRoute;
}
