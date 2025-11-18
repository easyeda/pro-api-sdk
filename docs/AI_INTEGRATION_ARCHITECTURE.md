# AI統合アーキテクチャ詳細設計

 

## 1. デュアルAIオーケストレーター

 

### 1.1 AIエンジン管理クラス

 

```typescript

// src/ai/AIOrchestrator.ts

 

interface AIEngineConfig {

  gpt51: {

    apiKey: string;

    model: "gpt-5.1-preview";

    baseURL: string;

  };

  gemini25: {

    apiKey: string;

    model: "gemini-2.5-pro-preview";

    baseURL: string;

  };

}

 

export class AIOrchestrator {

  private gpt51Client: OpenAI;

  private gemini25Client: GoogleGenerativeAI;

  private conversationHistory: Message[] = [];

  private currentDesignState: DesignState;

 

  constructor(config: AIEngineConfig) {

    this.gpt51Client = new OpenAI({

      apiKey: config.gpt51.apiKey,

      baseURL: config.gpt51.baseURL,

      dangerouslyAllowBrowser: true // iFrame内での使用

    });

 

    this.gemini25Client = new GoogleGenerativeAI(config.gemini25.apiKey);

  }

 

  /**

   * ユーザーリクエストを処理するメインメソッド

   */

  async processUserRequest(

    userInput: string,

    context: ConversationContext

  ): Promise<DesignResponse> {

    // Phase 1: GPT-5.1でリクエストを深く理解

    const understanding = await this.understandRequest(userInput, context);

 

    // Phase 2: 設計仕様を生成

    const designSpec = await this.generateDesignSpec(understanding);

 

    // Phase 3: EasyEDA APIで回路を実装

    const implementation = await this.implementCircuit(designSpec);

 

    // Phase 4: Gemini 2.5 Proで視覚的検証

    const visualValidation = await this.validateVisually(implementation);

 

    // Phase 5: フィードバックに基づいて改善

    if (visualValidation.needsImprovement) {

      const improved = await this.improveDesign(

        implementation,

        visualValidation.suggestions

      );

      return improved;

    }

 

    return {

      success: true,

      design: implementation,

      explanation: this.generateBeginnerExplanation(designSpec, implementation),

      visualAnalysis: visualValidation

    };

  }

 

  /**

   * GPT-5.1のthinking機能を活用した深い理解

   */

  private async understandRequest(

    userInput: string,

    context: ConversationContext

  ): Promise<RequestUnderstanding> {

    const response = await this.gpt51Client.chat.completions.create({

      model: "gpt-5.1-preview",

      messages: [

        {

          role: "system",

          content: `あなたは初心者向け電子回路設計の専門家です。

 

          # あなたの役割

          1. ユーザーの本当のニーズを理解する

          2. 技術的に実現可能な方法を検討する

          3. 初心者でも実装できる最適な設計を提案する

          4. 安全性とコストを最優先する

 

          # 思考プロセス

          - まずユーザーが何を達成したいかを理解

          - 複数の実装方法を比較検討

          - 初心者の技術レベルを考慮

          - 最もシンプルで安全な方法を選択

 

          # 出力形式

          JSON形式で以下を返してください：

          {

            "userGoal": "ユーザーの最終目標",

            "technicalRequirements": ["技術要件1", "技術要件2"],

            "safetyConsiderations": ["安全上の考慮点"],

            "recommendedApproach": "推奨アプローチの詳細",

            "estimatedDifficulty": "初心者/中級者/上級者",

            "estimatedCost": 1000,

            "requiredComponents": [

              {

                "name": "部品名",

                "purpose": "役割の説明（初心者向け）",

                "jlcpcbId": "Cxxxxx"

              }

            ],

            "educationalPoints": [

              "この回路で学べること1",

              "この回路で学べること2"

            ]

          }`

        },

        ...this.conversationHistory,

        {

          role: "user",

          content: userInput

        }

      ],

      temperature: 0.7,

      reasoning_effort: "high", // Thinking機能を最大限活用

      response_format: { type: "json_object" }

    });

 

    // thinkingプロセスをログに記録（デバッグ用）

    console.log("GPT-5.1 Thinking Process:", response.reasoning);

 

    return JSON.parse(response.choices[0].message.content);

  }

 

  /**

   * 詳細な設計仕様を生成

   */

  private async generateDesignSpec(

    understanding: RequestUnderstanding

  ): Promise<DetailedDesignSpec> {

    const response = await this.gpt51Client.chat.completions.create({

      model: "gpt-5.1-preview",

      messages: [

        {

          role: "system",

          content: `回路設計の詳細仕様を生成してください。

 

          # 設計原則

          1. 初心者でも理解できるシンプルさ

          2. JLCPCB在庫部品のみを使用

          3. 安全性を最優先（逆接続保護、過電流保護など）

          4. 実装の容易さ（SMDより大きめのスルーホール部品優先）

 

          # 出力形式

          JSON形式で回路の完全な仕様を返してください：

          {

            "schematic": {

              "components": [

                {

                  "id": "R1",

                  "type": "resistor",

                  "value": "330",

                  "unit": "ohm",

                  "jlcpcbId": "C21190",

                  "position": { "x": 100, "y": 100 },

                  "rotation": 0,

                  "explanation": "LEDの電流を制限するための抵抗です"

                }

              ],

              "connections": [

                {

                  "from": { "component": "R1", "pin": "2" },

                  "to": { "component": "LED1", "pin": "anode" },

                  "net": "LED_ANODE",

                  "path": [[100, 100], [150, 100]]

                }

              ],

              "powerSupply": {

                "voltage": 5,

                "current": 0.02,

                "connector": "USB_MICRO"

              }

            },

            "bom": [

              {

                "designator": "R1",

                "jlcpcbId": "C21190",

                "name": "抵抗 330Ω",

                "quantity": 1,

                "price": 0.001,

                "inStock": true

              }

            ],

            "assemblyInstructions": [

              "1. 抵抗R1を基板に挿入します",

              "2. LEDを極性に注意して挿入します（長い方がプラス）"

            ],

            "safetyNotes": [

              "LEDには必ず抵抗をつけてください",

              "電源の極性を間違えないように"

            ],

            "educationalContent": {

              "concepts": ["オームの法則", "LED の動作原理"],

              "calculations": [

                {

                  "title": "抵抗値の計算",

                  "formula": "R = (Vs - Vled) / I",

                  "explanation": "電源電圧5VからLEDの電圧降下2Vを引いて、20mAで割ります"

                }

              ]

            }

          }`

        },

        {

          role: "user",

          content: JSON.stringify(understanding)

        }

      ],

      temperature: 0.5,

      reasoning_effort: "high",

      response_format: { type: "json_object" }

    });

 

    return JSON.parse(response.choices[0].message.content);

  }

 

  /**

   * EasyEDA APIで回路を実装

   */

  private async implementCircuit(

    spec: DetailedDesignSpec

  ): Promise<CircuitImplementation> {

    const result: CircuitImplementation = {

      componentIds: [],

      wireIds: [],

      screenshot: null,

      success: false

    };

 

    try {

      // 1. コンポーネントを配置

      for (const comp of spec.schematic.components) {

        const component = await this.placeComponent(comp);

        result.componentIds.push(component.id);

 

        // UIに進捗を表示

        await this.updateProgress(`${comp.id} を配置しました`);

      }

 

      // 2. 配線を追加

      for (const conn of spec.schematic.connections) {

        const wire = await this.createWire(conn);

        result.wireIds.push(wire.id);

 

        await this.updateProgress(`${conn.net} を配線しました`);

      }

 

      // 3. 回路図を整理

      await this.organizeLayout();

 

      // 4. スクリーンショットを取得

      result.screenshot = await eda.dmt_EditorControl.getCurrentRenderedAreaImage();

 

      result.success = true;

      return result;

 

    } catch (error) {

      console.error("Circuit implementation failed:", error);

      throw new Error(`回路の実装に失敗しました: ${error.message}`);

    }

  }

 

  /**

   * Gemini 2.5 Proで視覚的検証

   */

  private async validateVisually(

    implementation: CircuitImplementation

  ): Promise<VisualValidationResult> {

    if (!implementation.screenshot) {

      throw new Error("スクリーンショットが利用できません");

    }

 

    // Blobを Base64に変換

    const base64Image = await this.blobToBase64(implementation.screenshot);

 

    const model = this.gemini25Client.getGenerativeModel({

      model: "gemini-2.5-pro-preview"

    });

 

    const result = await model.generateContent({

      contents: [{

        parts: [

          {

            text: `この電子回路図を分析してください。

 

            # 分析項目

            1. レイアウトの質（部品配置の適切さ）

            2. 配線の最適性（交差、長さ、見やすさ）

            3. 初心者が見落としやすいエラー

            4. 安全性の問題

            5. 改善提案

 

            # 評価基準

            - 初心者が理解しやすいか

            - 実装（半田付け）しやすいか

            - 業界標準に沿っているか

 

            # 出力形式

            JSON形式で以下を返してください：

            {

              "overallQuality": "excellent/good/needsImprovement",

              "layoutScore": 0-100,

              "strengths": ["良い点1", "良い点2"],

              "issues": [

                {

                  "severity": "error/warning/info",

                  "location": "部品の位置または領域",

                  "description": "問題の説明",

                  "suggestion": "修正方法",

                  "educational": "初心者向けの説明"

                }

              ],

              "improvements": [

                {

                  "component": "部品ID",

                  "action": "move/rotate/replace",

                  "newPosition": {"x": 100, "y": 100},

                  "reason": "改善理由"

                }

              ],

              "learningPoints": [

                "この回路から学べる重要なポイント"

              ],

              "visualComplexity": "simple/moderate/complex",

              "beginnerFriendly": true/false

            }`

          },

          {

            inlineData: {

              mimeType: "image/png",

              data: base64Image

            }

          }

        ]

      }],

      generationConfig: {

        temperature: 0.4,

        responseMimeType: "application/json"

      }

    });

 

    const analysis = JSON.parse(result.response.text());

 

    return {

      needsImprovement: analysis.overallQuality === "needsImprovement",

      quality: analysis.overallQuality,

      score: analysis.layoutScore,

      strengths: analysis.strengths,

      issues: analysis.issues,

      suggestions: analysis.improvements,

      learningPoints: analysis.learningPoints,

      beginnerFriendly: analysis.beginnerFriendly

    };

  }

 

  /**

   * 視覚的フィードバックに基づいて設計を改善

   */

  private async improveDesign(

    current: CircuitImplementation,

    suggestions: ImprovementSuggestion[]

  ): Promise<DesignResponse> {

    for (const suggestion of suggestions) {

      if (suggestion.severity === "error") {

        // エラーレベルは必ず修正

        await this.applyImprovement(suggestion);

      } else if (suggestion.severity === "warning") {

        // 警告レベルはユーザーに確認

        const userApproved = await this.askUserApproval(suggestion);

        if (userApproved) {

          await this.applyImprovement(suggestion);

        }

      }

    }

 

    // 改善後に再度スクリーンショットを取得して検証

    const newScreenshot = await eda.dmt_EditorControl.getCurrentRenderedAreaImage();

    const finalValidation = await this.validateVisually({

      ...current,

      screenshot: newScreenshot

    });

 

    return {

      success: true,

      design: current,

      explanation: this.generateBeginnerExplanation(null, current),

      visualAnalysis: finalValidation,

      improvements: suggestions

    };

  }

 

  /**

   * 初心者向けの説明を生成

   */

  private async generateBeginnerExplanation(

    spec: DetailedDesignSpec | null,

    implementation: CircuitImplementation

  ): Promise<BeginnerExplanation> {

    // GPT-5.1で分かりやすい説明を生成

    const response = await this.gpt51Client.chat.completions.create({

      model: "gpt-5.1-preview",

      messages: [{

        role: "system",

        content: `完成した回路について、初心者向けの分かりやすい説明を生成してください。

 

        # 説明に含める内容

        1. この回路が何をするか（日常言語で）

        2. 各部品の役割（専門用語を使わず）

        3. なぜこの設計にしたか

        4. 注意点と安全に関するアドバイス

        5. 次のステップ（実装、テスト、改造アイデア）

 

        # 口調

        - 親しみやすく、励ますようなトーン

        - 難しい言葉は使わない

        - 絵文字を適度に使う

        - 「できました！」のような達成感を与える

 

        Markdown形式で出力してください。`

      }, {

        role: "user",

        content: JSON.stringify({ spec, implementation })

      }],

      temperature: 0.8,

      reasoning_effort: "medium"

    });

 

    return {

      markdown: response.choices[0].message.content,

      htmlRendered: await this.markdownToHTML(response.choices[0].message.content)

    };

  }

 

  // ヘルパーメソッド

  private async blobToBase64(blob: Blob): Promise<string> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onloadend = () => {

        const base64 = (reader.result as string).split(',')[1];

        resolve(base64);

      };

      reader.onerror = reject;

      reader.readAsDataURL(blob);

    });

  }

 

  private async updateProgress(message: string): Promise<void> {

    // UIに進捗を通知

    window.postMessage({

      type: 'DESIGN_PROGRESS',

      message

    }, '*');

  }

 

  private async placeComponent(comp: ComponentSpec): Promise<PlacedComponent> {

    // JLCPCBパーツ番号から部品を検索

    const deviceInfo = await eda.lib_Device.getByLcscIds(comp.jlcpcbId);

 

    if (!deviceInfo) {

      throw new Error(`部品が見つかりません: ${comp.jlcpcbId}`);

    }

 

    // 部品を配置

    const placed = await eda.sch_PrimitiveComponent.create(

      deviceInfo,

      comp.position.x,

      comp.position.y,

      undefined, // subPartName

      comp.rotation || 0,

      false, // mirror

      true, // addIntoBom

      true  // addIntoPcb

    );

 

    if (!placed) {

      throw new Error(`部品の配置に失敗しました: ${comp.id}`);

    }

 

    return {

      id: placed.getState_PrimitiveId(),

      spec: comp,

      primitive: placed

    };

  }

 

  private async createWire(conn: ConnectionSpec): Promise<CreatedWire> {

    const wire = await eda.sch_PrimitiveWire.create(

      conn.path,

      conn.net

    );

 

    if (!wire) {

      throw new Error(`配線の作成に失敗しました: ${conn.net}`);

    }

 

    return {

      id: wire.getState_PrimitiveId(),

      spec: conn,

      primitive: wire

    };

  }

 

  private async organizeLayout(): Promise<void> {

    // 自動レイアウト最適化（将来実装）

    // 現時点では手動配置のまま

  }

 

  private async applyImprovement(suggestion: ImprovementSuggestion): Promise<void> {

    switch (suggestion.action) {

      case 'move':

        // 部品を移動

        const comp = await eda.sch_Primitive.getPrimitiveByPrimitiveId(suggestion.component);

        if (comp) {

          await eda.sch_PrimitiveComponent.modify(suggestion.component, {

            x: suggestion.newPosition.x,

            y: suggestion.newPosition.y

          });

        }

        break;

 

      case 'rotate':

        // 部品を回転

        await eda.sch_PrimitiveComponent.modify(suggestion.component, {

          rotation: suggestion.newRotation

        });

        break;

 

      case 'replace':

        // 部品を置き換え（高度な機能）

        break;

    }

  }

 

  private async askUserApproval(suggestion: ImprovementSuggestion): Promise<boolean> {

    return new Promise((resolve) => {

      // UIにダイアログを表示してユーザーに確認

      window.postMessage({

        type: 'ASK_APPROVAL',

        suggestion,

        callback: (approved: boolean) => resolve(approved)

      }, '*');

    });

  }

 

  private async markdownToHTML(markdown: string): Promise<string> {

    // Markdown を HTML に変換（ライブラリ使用）

    // 簡易実装

    return markdown

      .replace(/^# (.*$)/gim, '<h1>$1</h1>')

      .replace(/^## (.*$)/gim, '<h2>$1</h2>')

      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')

      .replace(/\n/gim, '<br>');

  }

}

 

// 型定義

interface RequestUnderstanding {

  userGoal: string;

  technicalRequirements: string[];

  safetyConsiderations: string[];

  recommendedApproach: string;

  estimatedDifficulty: "初心者" | "中級者" | "上級者";

  estimatedCost: number;

  requiredComponents: ComponentRequirement[];

  educationalPoints: string[];

}

 

interface ComponentRequirement {

  name: string;

  purpose: string;

  jlcpcbId: string;

}

 

interface DetailedDesignSpec {

  schematic: {

    components: ComponentSpec[];

    connections: ConnectionSpec[];

    powerSupply: PowerSupplySpec;

  };

  bom: BOMItem[];

  assemblyInstructions: string[];

  safetyNotes: string[];

  educationalContent: EducationalContent;

}

 

interface ComponentSpec {

  id: string;

  type: string;

  value: string;

  unit: string;

  jlcpcbId: string;

  position: { x: number; y: number };

  rotation: number;

  explanation: string;

}

 

interface ConnectionSpec {

  from: { component: string; pin: string };

  to: { component: string; pin: string };

  net: string;

  path: number[][];

}

 

interface CircuitImplementation {

  componentIds: string[];

  wireIds: string[];

  screenshot: Blob | null;

  success: boolean;

}

 

interface VisualValidationResult {

  needsImprovement: boolean;

  quality: "excellent" | "good" | "needsImprovement";

  score: number;

  strengths: string[];

  issues: ValidationIssue[];

  suggestions: ImprovementSuggestion[];

  learningPoints: string[];

  beginnerFriendly: boolean;

}

 

interface ValidationIssue {

  severity: "error" | "warning" | "info";

  location: string;

  description: string;

  suggestion: string;

  educational: string;

}

 

interface ImprovementSuggestion {

  component: string;

  action: "move" | "rotate" | "replace";

  newPosition?: { x: number; y: number };

  newRotation?: number;

  reason: string;

  severity?: "error" | "warning" | "info";

}

 

interface DesignResponse {

  success: boolean;

  design: CircuitImplementation;

  explanation: BeginnerExplanation;

  visualAnalysis: VisualValidationResult;

  improvements?: ImprovementSuggestion[];

}

 

interface BeginnerExplanation {

  markdown: string;

  htmlRendered: string;

}

 

export default AIOrchestrator;

```

 

## 2. 使用例

 

```typescript

// src/index.ts での使用例

import AIOrchestrator from './ai/AIOrchestrator';

 

let orchestrator: AIOrchestrator;

 

export async function activate() {

  // API キーを設定から取得（またはユーザーに入力してもらう）

  const config = {

    gpt51: {

      apiKey: await eda.sys_Setting.get('gpt51_api_key'),

      model: "gpt-5.1-preview",

      baseURL: "https://api.openai.com/v1"

    },

    gemini25: {

      apiKey: await eda.sys_Setting.get('gemini_api_key'),

      model: "gemini-2.5-pro-preview",

      baseURL: "https://generativelanguage.googleapis.com/v1"

    }

  };

 

  orchestrator = new AIOrchestrator(config);

}

 

export async function openAICircuitDesigner() {

  // iFrameダイアログを開く

  await eda.sys_IFrame.openIFrame(

    '/iframe/ai-designer.html',

    1200,

    800,

    'ai-designer-main',

    {

      maximizeButton: true,

      minimizeButton: false,

      grayscaleMask: true

    }

  );

}

 

// iFrame からのメッセージを受信

window.addEventListener('message', async (event) => {

  if (event.data.type === 'PROCESS_USER_INPUT') {

    const response = await orchestrator.processUserRequest(

      event.data.input,

      event.data.context

    );

 

    // 結果を iFrame に送信

    event.source.postMessage({

      type: 'DESIGN_RESPONSE',

      response

    }, event.origin);

  }

});

```

 

## 3. エラーハンドリング戦略

 

```typescript

class DesignError extends Error {

  constructor(

    message: string,

    public userFriendlyMessage: string,

    public suggestions: string[],

    public recoverable: boolean

  ) {

    super(message);

  }

}

 

// 使用例

try {

  const result = await orchestrator.processUserRequest(input, context);

} catch (error) {

  if (error instanceof DesignError) {

    // 初心者向けのエラーメッセージを表示

    await eda.sys_Dialog.showInformationMessage(

      error.userFriendlyMessage,

      "エラー"

    );

 

    if (error.recoverable && error.suggestions.length > 0) {

      // 解決策を提示

      const choice = await eda.sys_Dialog.showQuestionMessage(

        `以下の方法を試してみますか？\n\n${error.suggestions.join('\n')}`,

        "解決方法"

      );

 

      if (choice) {

        // リトライロジック

      }

    }

  }

}

```
