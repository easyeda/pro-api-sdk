[简体中文](./README.md) | [English](./README.en.md) | [繁體中文](#) | [日本語](./README.ja.md) | [Русский](./README.ru.md)

# pro-api-sdk

嘉立創EDA & EasyEDA 專業版擴展 API 開發工具

<a href="https://github.com/easyeda/pro-api-sdk" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/stars/easyeda/pro-api-sdk" alt="GitHub Repo Stars" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://github.com/easyeda/pro-api-sdk/issues" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/issues/easyeda/pro-api-sdk" alt="GitHub Issues" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://github.com/easyeda/pro-api-sdk" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/repo-size/easyeda/pro-api-sdk" alt="GitHub Repo Size" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/easyeda/pro-api-sdk" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://www.npmjs.com/package/@jlceda/pro-api-types" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/npm/v/%40jlceda%2Fpro-api-types?label=pro-api-types" alt="NPM Version" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://www.npmjs.com/package/@jlceda/pro-api-types" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/npm/d18m/%40jlceda%2Fpro-api-types" alt="NPM Downloads" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>

> [!NOTE]
>
> 有關 嘉立創EDA專業版 擴展程式開發的更多資訊，請訪問：[https://prodocs.easyeda.com/cn/api/guide/](https://prodocs.easyeda.com/cn/api/guide/)

## 進入開發

本開發工具組包含了用於開發 [嘉立創EDA專業版](https://pro.easyeda.com/) 擴展程式的所有環境和工具，並內置了 Prettier 和 ESLint 的推薦規則。

1. 克隆 [pro-api-sdk](https://github.com/easyeda/pro-api-sdk) 項目倉庫到本地

    ```shell
    git clone --depth=1 https://github.com/easyeda/pro-api-sdk.git
    ```

2. 初始化開發環境（安裝依賴）

    ```shell
    npm install
    ```

3. 進行些許變更 ...

4. 編譯擴展程式

    ```shell
    npm run build
    ```

5. 在 嘉立創EDA專業版 中安裝生成在 `./build/dist/` 下的擴展程式

## AI 功能

本擴展集成了雙 AI 引擎（GPT-5.1 + Gemini 2.5 Pro）的 AI 電路設計助手，可以幫助初學者輕鬆設計電子電路。

### 主要功能

- **AI 電路設計器**：透過自然語言描述，自動生成電路設計
- **雙 AI 引擎**：
  - GPT-5.1：深度理解使用者需求，生成詳細設計規範
  - Gemini 2.5 Pro：視覺驗證和優化建議
- **初學者友好**：提供詳細的說明和安全建議
- **JLCPCB 集成**：自動使用 JLCPCB 庫存元件

### 使用方法

1. 在選單中選擇 **「API SDK」 > 「AI設定...」**
2. 輸入您的 OpenAI API 金鑰（用於 GPT-5.1）
3. 輸入您的 Google Gemini API 金鑰（用於 Gemini 2.5）
4. 點擊 **「API SDK」 > 「AI電路設計器」** 開始使用

### 所需 API 金鑰

- **OpenAI API Key**：用於 GPT-5.1 模型（需要訪問 GPT-5.1-preview）
- **Google Gemini API Key**：用於 Gemini 2.5 Pro 模型

有關 AI 集成架構的詳細資訊，請參閱 [AI_INTEGRATION_ARCHITECTURE.md](./docs/AI_INTEGRATION_ARCHITECTURE.md)

## 開源許可

<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/easyeda/pro-api-sdk" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>

本開發工具組使用 [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) 開源許可協定，你僅可以將 **嘉立创EDA**、**嘉立創EDA**、**EasyEDA** 商標資訊用於依託於本工具組開發的擴展程式的 **功能描述部分** 和 **開源發佈的標題部分**。
