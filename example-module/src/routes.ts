import { IRoute } from 'umi-types';
// import Permissions from './permissions';

const blogs: IRoute[] = [
  {
    path: '/blogs',
    name: '例子',
    // authority: Permissions.blogs.base.permission,
    icon: 'smile',
    routes: [
      { path: '/blogs', redirect: '/blogs/test' },
      {
        path: '/blogs/test',
        name: '测试页面',
        Routes: [],
        // authority: Permissions.blogs.base.permission,
        component: './Test/index',
      },
      {
        path: '/blogs/list',
        name: '列表',
        // authority: Permissions.blogs.base.permission,
        component: './List/index',
      },
    ],
  },
];

export default blogs;
