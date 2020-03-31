# @wetrial/plugin-module

## Use

安装

```bash
npm i @wetrial/plugin-module --save
```

在 umirc.js，或 config/config.js 中配置

```tsx
plugins: ['@wetrial/plugin-module'];
```

配置:

```tsx |pure
{
  wetrial_module: {
    // 模块名称列表
    modules?:string[]
  }
}
```

## API

@wetrial/plugin-module 是一个模块化的插件，只需要一个配置名称就可以让 umi 支持模块化子应用。
