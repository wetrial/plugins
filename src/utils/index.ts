import assert from 'assert';
import { resolve, join } from 'path';
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
 * @param pageModel {string} 模式(src|es|lib)
 */
export function getModuleRoutes(module: string, absRootPath: string, pageModel: string) {
  // 对应到lib文件夹下
  const routeModuleAbsPath = getModuleAbsolutePath(module, absRootPath, 'lib');
  // 获取模块下的路由列表
  // eslint-disable-next-line
  const originRoutes = require(join(routeModuleAbsPath, 'routes')).default;
  // 递归修改里面的路由路径为绝对路径,页面使用lib或者源码目录(如果有传入)
  const moduleAbsPath = getModuleAbsolutePath(module, absRootPath, pageModel);
  const absRoutes = originRoutes.map(route => dgConvertToAbsRoutePath(route, moduleAbsPath, '/'));
  return absRoutes;
}

/**
 * 根据模块解析出模块的绝对路径
 * @param module {string} 要解析的模块
 * @param absRootPath {string} 根绝对路径
 * @param pageModel {string} 模式(src|es|lib)
 * @returns string 模块的绝对路径
 * @example  getModuleAbsolutePath('@wetrial/blogs') ==>$pwd/node_modules/@wetrial/blogs
 * @example  getModuleAbsolutePath('../') ==>$pwd上一级目录/
 */
function getModuleAbsolutePath(module: string, absRootPath: string, pageModel: string) {
  // 模块可能是相对路径写法或者模块包的写法
  let moduleAbsPath: string;
  if (module.startsWith('.')) {
    moduleAbsPath = resolve(absRootPath, module, pageModel);
  } else {
    // 模块形式(定到lib模块下)
    moduleAbsPath = resolve(absRootPath, `./node_modules/${module}/${pageModel}`);
  }
  return moduleAbsPath;
}

/**
 * 将模块中路由中的相对应用地址修改为绝对路径的地址
 * @param itemRoute 路由项(路由的地址是相对于pages文件夹的)
 * @param libRootPath 绝对路径根路径
 */
function dgConvertToAbsRoutePath(itemRoute: any, libRootPath: string, parentPath: string) {
  const newItemRoute: any = { ...itemRoute };
  // 处理component路径
  if (newItemRoute.component) {
    newItemRoute.component = resolve(libRootPath, './pages', newItemRoute.component);
  } else if (newItemRoute.redirect) {
    // 如果是默认redirect跳转的，则设置exact
    newItemRoute.exact = true;
  }

  // 处理Routes路径
  if (newItemRoute.Routes instanceof Array) {
    newItemRoute.Routes = newItemRoute.Routes.filter(m => !!m).map(item =>
      resolve(libRootPath, './pages', item),
    );
  }

  // 处理路由拼接父级
  if (newItemRoute.path && !newItemRoute.path.startsWith('/')) {
    newItemRoute.path = `${parentPath}${newItemRoute.path}`;
  }

  // 处理子路由
  if (newItemRoute.routes) {
    newItemRoute.routes = newItemRoute.routes.map((sItem: any) =>
      dgConvertToAbsRoutePath(sItem, libRootPath, newItemRoute.path),
    );
  } else if (!newItemRoute.redirect) {
    newItemRoute.exact = true;
  }
  return newItemRoute;
}
