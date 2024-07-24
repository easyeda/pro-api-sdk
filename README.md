[简体中文](#) | [English](./README.en.md)

# pro-api-sdk

嘉立创EDA & EasyEDA 专业版扩展 API 开发工具

> [!NOTE]
> 详细开发文档请访问：[https://prodocs.lceda.cn/cn/api/guide/](https://prodocs.lceda.cn/cn/api/guide/)

## 进入开发

本开发工具组包含了用于开发 [嘉立创EDA专业版](https://pro.lceda.cn/) 扩展包的所有环境和工具，并内置了 Prettier 和 ESLint 的推荐规则。

1. 克隆 [pro-api-sdk](https://github.com/jlceda/pro-api-sdk) 项目仓库到本地


    ```shell
    git clone --depth=1 https://github.com/jlceda/pro-api-sdk.git
    ```

2. 初始化开发环境（安装依赖）

    ```shell
    npm install
    ```

3. 进行些许变更 ...

4. 编译扩展包

    ```shell
    npm run build
    ```

5. 在 嘉立创EDA专业版 中安装生成在 `./build/dist/` 下的扩展包

## 开源许可

本开发工具组使用 [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) 开源许可协议，你仅可以将 **嘉立创EDA**、**EasyEDA** 商标信息用于依托于本工具组开发的扩展包的 **功能描述部分** 和 **开源发布的标题部分**。
