[简体中文](./README.md) | [English](./README.en.md) | [繁體中文](./README.zh-Hant.md) | [日本語](#) | [Русский](./README.ru.md)

# pro-api-sdk

嘉立创EDA & EasyEDA Pro Edition は API 開発ツールを拡張します

<a href="https://github.com/easyeda/pro-api-sdk" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/stars/easyeda/pro-api-sdk" alt="GitHub Repo Stars" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://github.com/easyeda/pro-api-sdk/issues" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/issues/easyeda/pro-api-sdk" alt="GitHub Issues" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://github.com/easyeda/pro-api-sdk" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/repo-size/easyeda/pro-api-sdk" alt="GitHub Repo Size" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/easyeda/pro-api-sdk" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://www.npmjs.com/package/@jlceda/pro-api-types" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/npm/v/%40jlceda%2Fpro-api-types?label=pro-api-types" alt="NPM Version" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://www.npmjs.com/package/@jlceda/pro-api-types" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/npm/d18m/%40jlceda%2Fpro-api-types" alt="NPM Downloads" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>

> [!NOTE]
>
> 詳細な開発ドキュメントについては、以下をご覧ください：[https://prodocs.easyeda.com/en/api/guide/](https://prodocs.easyeda.com/en/api/guide/)

## 開発に入る

この開発ツールセットには、[EasyEDA Pro Edition](https://pro.easyeda.com/) 拡張パッケージを開発するためのすべての環境とツールが含まれており、Prettier と ESLint の推奨ルールが組み込まれています。

1. プロジェクト [pro-api-sdk](https://github.com/easyeda/pro-api-sdk) リポジトリをローカル コンピューターにクローンします

    ```shell
    git clone --depth=1 https://github.com/easyeda/pro-api-sdk.git
    ```

2. 開発環境の初期化 (依存関係のインストール)

    ```shell
    npm install
    ```

3. いくつかの変更を加えます...

4. 拡張機能パッケージをコンパイルする

    ```shell
    npm run build
    ```

5. EasyEDA Pro Edition の `./build/dist/` の下に生成された拡張パッケージをインストールします

## AI 機能

この拡張機能は、デュアル AI エンジン（GPT-5.1 + Gemini 2.5 Pro）を統合した AI 回路設計アシスタントを搭載しており、初心者でも簡単に電子回路を設計できます。

### 主な機能

- **AI 回路デザイナー**：自然言語による説明から、自動的に回路設計を生成
- **デュアル AI エンジン**：
  - GPT-5.1：ユーザー要求の深い理解と詳細な設計仕様の生成
  - Gemini 2.5 Pro：視覚的検証と最適化提案
- **初心者向け**：詳細な説明と安全に関する推奨事項を提供
- **JLCPCB 統合**：JLCPCB の在庫部品を自動的に使用

### 使い方

1. メニューから **「API SDK」 > 「AI設定...」** を選択
2. OpenAI API キーを入力（GPT-5.1 用）
3. Google Gemini API キーを入力（Gemini 2.5 用）
4. **「API SDK」 > 「AI回路デザイナー」** をクリックして使用開始

### 必要な API キー

- **OpenAI API キー**：GPT-5.1 モデル用（GPT-5.1-preview へのアクセスが必要）
- **Google Gemini API キー**：Gemini 2.5 Pro モデル用

AI 統合アーキテクチャの詳細については、[AI_INTEGRATION_ARCHITECTURE.md](./docs/AI_INTEGRATION_ARCHITECTURE.md) をご覧ください

## オープンソースライセンス

<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/easyeda/pro-api-sdk" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>

この開発ツールグループは、[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) オープンソースライセンス契約を使用しており、このツールグループに基づいて開発された拡張パッケージの **機能説明部分** および **オープンソースリリースタイトル部分** の **嘉立创EDA**、**EasyEDA** 商標情報のみを使用することができます。
