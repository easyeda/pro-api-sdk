[简体中文](#) | [English](./README.en.md) | [繁體中文](./README.zh-Hant.md) | [日本語](./README.ja.md) | [Русский](./README.ru.md)

# pro-api-sdk

嘉立创EDA & EasyEDA 专业版扩展 API 开发工具

<a href="https://github.com/easyeda/pro-api-sdk" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/stars/easyeda/pro-api-sdk" alt="GitHub Repo Stars" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://github.com/easyeda/pro-api-sdk/issues" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/issues/easyeda/pro-api-sdk" alt="GitHub Issues" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://github.com/easyeda/pro-api-sdk" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/repo-size/easyeda/pro-api-sdk" alt="GitHub Repo Size" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/easyeda/pro-api-sdk" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://www.npmjs.com/package/@jlceda/pro-api-types" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/npm/v/%40jlceda%2Fpro-api-types?label=pro-api-types" alt="NPM Version" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://www.npmjs.com/package/@jlceda/pro-api-types" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/npm/d18m/%40jlceda%2Fpro-api-types" alt="NPM Downloads" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>

> [!NOTE]
>
> 详细开发文档请访问：[https://prodocs.lceda.cn/cn/api/guide/](https://prodocs.lceda.cn/cn/api/guide/)

## 进入开发

本开发工具组包含了用于开发 [嘉立创EDA专业版](https://pro.lceda.cn/) 扩展包的所有环境和工具，并内置了 Prettier 和 ESLint 的推荐规则。

1. 克隆 [pro-api-sdk](https://github.com/easyeda/pro-api-sdk) 项目仓库到本地

    Gitee:

    ```shell
    git clone --depth=1 https://gitee.com/jlceda/pro-api-sdk.git
    ```

    GitHub:

    ```shell
    git clone --depth=1 https://github.com/easyeda/pro-api-sdk.git
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

## AI 功能

本扩展集成了双 AI 引擎（GPT-5.1 + Gemini 2.5 Pro）的 AI 回路设计助手，可以帮助初学者轻松设计电子电路。

### 主要功能

- **AI 回路设计器**：通过自然语言描述，自动生成电路设计
- **双 AI 引擎**：
  - GPT-5.1：深度理解用户需求，生成详细设计规范
  - Gemini 2.5 Pro：视觉验证和优化建议
- **初学者友好**：提供详细的说明和安全建议
- **JLCPCB 集成**：自动使用 JLCPCB 库存部件

### 使用方法

1. 在菜单中选择 **"API SDK" > "AI设定..."**
2. 输入您的 OpenAI API 密钥（用于 GPT-5.1）
3. 输入您的 Google Gemini API 密钥（用于 Gemini 2.5）
4. 点击 **"API SDK" > "AI回路设计器"** 开始使用

### 所需 API 密钥

- **OpenAI API Key**：用于 GPT-5.1 模型（需要访问 GPT-5.1-preview）
- **Google Gemini API Key**：用于 Gemini 2.5 Pro 模型

有关 AI 集成架构的详细信息，请参阅 [AI_INTEGRATION_ARCHITECTURE.md](./docs/AI_INTEGRATION_ARCHITECTURE.md)

## 开源许可

<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/easyeda/pro-api-sdk" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>

本开发工具组使用 [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) 开源许可协议，你仅可以将 **嘉立创EDA**、**EasyEDA** 商标信息用于依托于本工具组开发的扩展包的 **功能描述部分** 和 **开源发布的标题部分**。
