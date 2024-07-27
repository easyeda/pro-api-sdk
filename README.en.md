[简体中文](./README.md) | [English](#) | [繁體中文](./README.zh-Hant.md) | [日本語](./README.ja.md) | [Русский](./README.ru.md)

# pro-api-sdk

JLCEDA & EasyEDA Pro Extension API Development Kit

[![GitHub Repo Stars](https://img.shields.io/github/stars/jlceda/pro-api-sdk)](https://github.com/jlceda/pro-api-sdk)
[![GitHub Issues](https://img.shields.io/github/issues/jlceda/pro-api-sdk)](https://github.com/jlceda/pro-api-sdk/issues)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/jlceda/pro-api-sdk)](https://github.com/jlceda/pro-api-sdk)
[![GitHub License](https://img.shields.io/github/license/jlceda/pro-api-sdk)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/%40jlceda%2Fpro-api-types?label=pro-api-types)](https://www.npmjs.com/package/@jlceda/pro-api-types)
[![NPM Downloads](https://img.shields.io/npm/d18m/%40jlceda%2Fpro-api-types)](https://www.npmjs.com/package/@jlceda/pro-api-types)

> [!NOTE]
> For more information on the development of EasyEDA Pro Extension, please visit：[https://prodocs.easyeda.com/en/api/guide/](https://prodocs.easyeda.com/en/api/guide/)

## Enter Development

This development tool set contains all the environments and tools for developing the [EasyEDA Pro Edition](https://pro.easyeda.com/) extension package, and has built-in recommended rules for Prettier and ESLint.

1. Clone the [pro-api-sdk](https://github.com/jlceda/pro-api-sdk) project repository to your local computer

    ```shell
    git clone --depth=1 https://github.com/jlceda/pro-api-sdk.git
    ```

2. Initializing the development environment (installing dependencies)

    ```shell
    npm install
    ```

3. Make your changes ...

4. Compile the extension package

    ```shell
    npm run build
    ```

5. Install the extension package generated under `./build/dist/` in EasyEDA Pro Edition

## Open-source License

This development tool uses the [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) open source license agreement. You can only use the **嘉立创EDA** and **EasyEDA** trademark information for the **function description part** and **open source release title part** of the extension package developed based on this tool.
