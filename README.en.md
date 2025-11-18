[简体中文](./README.md) | [English](#) | [繁體中文](./README.zh-Hant.md) | [日本語](./README.ja.md) | [Русский](./README.ru.md)

# pro-api-sdk

JLCEDA & EasyEDA Pro Extension API Development Kit

<a href="https://github.com/easyeda/pro-api-sdk" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/stars/easyeda/pro-api-sdk" alt="GitHub Repo Stars" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://github.com/easyeda/pro-api-sdk/issues" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/issues/easyeda/pro-api-sdk" alt="GitHub Issues" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://github.com/easyeda/pro-api-sdk" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/repo-size/easyeda/pro-api-sdk" alt="GitHub Repo Size" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/easyeda/pro-api-sdk" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://www.npmjs.com/package/@jlceda/pro-api-types" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/npm/v/%40jlceda%2Fpro-api-types?label=pro-api-types" alt="NPM Version" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://www.npmjs.com/package/@jlceda/pro-api-types" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/npm/d18m/%40jlceda%2Fpro-api-types" alt="NPM Downloads" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>

> [!NOTE]
>
> For more information on the development of EasyEDA Pro Extension, please visit：[https://prodocs.easyeda.com/en/api/guide/](https://prodocs.easyeda.com/en/api/guide/)

## Enter Development

This development tool set contains all the environments and tools for developing the [EasyEDA Pro Edition](https://pro.easyeda.com/) extension package, and has built-in recommended rules for Prettier and ESLint.

1. Clone the [pro-api-sdk](https://github.com/easyeda/pro-api-sdk) project repository to your local computer

    ```shell
    git clone --depth=1 https://github.com/easyeda/pro-api-sdk.git
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

## AI Features

This extension integrates a dual AI engine (GPT-5.1 + Gemini 2.5 Pro) circuit design assistant to help beginners easily design electronic circuits.

### Key Features

- **AI Circuit Designer**: Automatically generate circuit designs from natural language descriptions
- **Dual AI Engines**:
  - GPT-5.1: Deep understanding of user requirements and detailed design specification generation
  - Gemini 2.5 Pro: Visual validation and optimization suggestions
- **Beginner-Friendly**: Provides detailed explanations and safety recommendations
- **JLCPCB Integration**: Automatically uses JLCPCB stock components

### How to Use

1. Select **"API SDK" > "AI Settings..."** from the menu
2. Enter your OpenAI API key (for GPT-5.1)
3. Enter your Google Gemini API key (for Gemini 2.5)
4. Click **"API SDK" > "AI Circuit Designer"** to start using

### Required API Keys

- **OpenAI API Key**: For GPT-5.1 model (requires access to GPT-5.1-preview)
- **Google Gemini API Key**: For Gemini 2.5 Pro model

For detailed information about the AI integration architecture, see [AI_INTEGRATION_ARCHITECTURE.md](./docs/AI_INTEGRATION_ARCHITECTURE.md)

## Open-source License

<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/easyeda/pro-api-sdk" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>

This development tool uses the [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) open source license agreement. You can only use the **嘉立创EDA** and **EasyEDA** trademark information for the **function description part** and **open source release title part** of the extension package developed based on this tool.
