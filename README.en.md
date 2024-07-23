[简体中文](./README.md) | [English](#)

# pro-api-sdk

JLCEDA & EasyEDA Pro Extension API Development Kit

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
