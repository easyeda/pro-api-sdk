# 1.6.2

# 修正

1. 使用 npx 初始化时未忽略 .git 目录和无关脚本

# 1.6.1

## 变更

1. 在 npx 初始化和 update 更新时均忽略部分无关脚本

# 1.6.0

## 新功能

1. 支持 `npx github:easyeda/pro-api-sdk my-extension` 初始化环境

## 变更

1. 日志和 CLI 语言修改为英语
2. 示例程序的描述修改为中英双语
3. 转换为 ESM 项目

# 1.5.0

## 新功能

1. 支持使用 `npm run update` 更新 pro-api-sdk 框架代码

# 1.4.0

## 新功能

1. 支持使用 `npm run debug` 命令与 EDA 进行在线联调

## 修正

1. 修正重复的 menuId

# 1.2.0

## 变更

1. 使用纯 ESLint 的代码格式化方式
2. 打包时额外进行压缩，可以获得更小的扩展包

# 1.1.1

## 变更

1. 为了符合隐私政策，禁止在 extension.json、README.md、CHANGELOG.md、LICENSE 内添加电子邮箱地址作为联系方式

# 1.1.0

## 新增

1. 新增扩展注册头部菜单的多语言翻译支持
2. 新增更新日志（CHANGELOG.md）

## 变更

1. 替换已弃用的方法（SYS_Dialog.showInformationMessage）

# 1.0.0

初始版本
