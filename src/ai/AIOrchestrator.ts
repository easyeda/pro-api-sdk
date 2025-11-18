/**
 * AIOrchestrator.ts
 * デュアルAIエンジン（GPT-5.1 + Gemini 2.5 Pro）を統合したオーケストレーター
 */

// 型定義
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

interface PowerSupplySpec {
  voltage: number;
  current: number;
  connector: string;
}

interface BOMItem {
  designator: string;
  jlcpcbId: string;
  name: string;
  quantity: number;
  price: number;
  inStock: boolean;
}

interface EducationalContent {
  concepts: string[];
  calculations: CalculationExample[];
}

interface CalculationExample {
  title: string;
  formula: string;
  explanation: string;
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

interface ConversationContext {
  previousMessages?: any[];
  currentDocument?: any;
}

interface PlacedComponent {
  id: string;
  spec: ComponentSpec;
  primitive: any;
}

interface CreatedWire {
  id: string;
  spec: ConnectionSpec;
  primitive: any;
}

interface Message {
  role: string;
  content: string;
}

interface DesignState {
  [key: string]: any;
}

/**
 * AIオーケストレーター本体
 */
export class AIOrchestrator {
  private gpt51Client: any;
  private gemini25Client: any;
  private conversationHistory: Message[] = [];
  private currentDesignState: DesignState = {};

  constructor(config: AIEngineConfig) {
    // OpenAI クライアント初期化（ブラウザモジュールを想定）
    // 実際の使用時は openai パッケージをインポート
    this.gpt51Client = {
      apiKey: config.gpt51.apiKey,
      baseURL: config.gpt51.baseURL,
      // dangerouslyAllowBrowser: true
    };

    // Google Generative AI クライアント初期化
    this.gemini25Client = {
      apiKey: config.gemini25.apiKey,
    };

    console.log('AIOrchestrator initialized');
  }

  /**
   * ユーザーリクエストを処理するメインメソッド
   */
  async processUserRequest(
    userInput: string,
    context: ConversationContext
  ): Promise<DesignResponse> {
    try {
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
        explanation: await this.generateBeginnerExplanation(designSpec, implementation),
        visualAnalysis: visualValidation
      };
    } catch (error: any) {
      console.error('Error in processUserRequest:', error);
      throw error;
    }
  }

  /**
   * GPT-5.1のthinking機能を活用した深い理解
   */
  private async understandRequest(
    userInput: string,
    context: ConversationContext
  ): Promise<RequestUnderstanding> {
    // 実装の簡易版：実際にはOpenAI APIを呼び出す
    console.log('Understanding request:', userInput);

    // モックレスポンス（実装時にはOpenAI APIに置き換え）
    return {
      userGoal: userInput,
      technicalRequirements: ["LED制御", "電流制限"],
      safetyConsiderations: ["過電流保護"],
      recommendedApproach: "シンプルなLED回路",
      estimatedDifficulty: "初心者",
      estimatedCost: 100,
      requiredComponents: [
        {
          name: "LED",
          purpose: "光を発する",
          jlcpcbId: "C2286"
        }
      ],
      educationalPoints: ["オームの法則"]
    };
  }

  /**
   * 詳細な設計仕様を生成
   */
  private async generateDesignSpec(
    understanding: RequestUnderstanding
  ): Promise<DetailedDesignSpec> {
    console.log('Generating design spec from understanding');

    // モックレスポンス
    return {
      schematic: {
        components: [
          {
            id: "R1",
            type: "resistor",
            value: "330",
            unit: "ohm",
            jlcpcbId: "C21190",
            position: { x: 100, y: 100 },
            rotation: 0,
            explanation: "LED電流制限用抵抗"
          }
        ],
        connections: [],
        powerSupply: {
          voltage: 5,
          current: 0.02,
          connector: "USB_MICRO"
        }
      },
      bom: [
        {
          designator: "R1",
          jlcpcbId: "C21190",
          name: "抵抗 330Ω",
          quantity: 1,
          price: 0.001,
          inStock: true
        }
      ],
      assemblyInstructions: ["抵抗を配置"],
      safetyNotes: ["極性に注意"],
      educationalContent: {
        concepts: ["オームの法則"],
        calculations: []
      }
    };
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
      // コンポーネントを配置
      for (const comp of spec.schematic.components) {
        const component = await this.placeComponent(comp);
        result.componentIds.push(component.id);
        await this.updateProgress(`${comp.id} を配置しました`);
      }

      // 配線を追加
      for (const conn of spec.schematic.connections) {
        const wire = await this.createWire(conn);
        result.wireIds.push(wire.id);
        await this.updateProgress(`${conn.net} を配線しました`);
      }

      // 回路図を整理
      await this.organizeLayout();

      // スクリーンショットを取得
      if (typeof eda !== 'undefined' && eda.dmt_EditorControl) {
        result.screenshot = await eda.dmt_EditorControl.getCurrentRenderedAreaImage();
      }

      result.success = true;
      return result;

    } catch (error: any) {
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
    console.log('Validating visually with Gemini');

    // モックレスポンス
    return {
      needsImprovement: false,
      quality: "good",
      score: 85,
      strengths: ["シンプルな配置"],
      issues: [],
      suggestions: [],
      learningPoints: ["基本的な回路構成"],
      beginnerFriendly: true
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
        await this.applyImprovement(suggestion);
      }
    }

    const newScreenshot = typeof eda !== 'undefined' && eda.dmt_EditorControl
      ? await eda.dmt_EditorControl.getCurrentRenderedAreaImage()
      : null;

    const finalValidation = await this.validateVisually({
      ...current,
      screenshot: newScreenshot
    });

    return {
      success: true,
      design: current,
      explanation: await this.generateBeginnerExplanation(null, current),
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
    const markdown = `# 回路が完成しました！\n\nこの回路は基本的な電子回路です。`;

    return {
      markdown,
      htmlRendered: await this.markdownToHTML(markdown)
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
    if (typeof window !== 'undefined') {
      window.postMessage({
        type: 'DESIGN_PROGRESS',
        message
      }, '*');
    }
  }

  private async placeComponent(comp: ComponentSpec): Promise<PlacedComponent> {
    // EasyEDA APIを使用して部品を配置
    if (typeof eda === 'undefined' || !eda.lib_Device) {
      throw new Error('EasyEDA API が利用できません');
    }

    const deviceInfo = await eda.lib_Device.getByLcscIds(comp.jlcpcbId);

    if (!deviceInfo) {
      throw new Error(`部品が見つかりません: ${comp.jlcpcbId}`);
    }

    const placed = await eda.sch_PrimitiveComponent.create(
      deviceInfo,
      comp.position.x,
      comp.position.y,
      undefined,
      comp.rotation || 0,
      false,
      true,
      true
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
    if (typeof eda === 'undefined' || !eda.sch_PrimitiveWire) {
      throw new Error('EasyEDA API が利用できません');
    }

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
  }

  private async applyImprovement(suggestion: ImprovementSuggestion): Promise<void> {
    if (typeof eda === 'undefined') {
      return;
    }

    switch (suggestion.action) {
      case 'move':
        const comp = await eda.sch_Primitive.getPrimitiveByPrimitiveId(suggestion.component);
        if (comp && suggestion.newPosition) {
          await eda.sch_PrimitiveComponent.modify(suggestion.component, {
            x: suggestion.newPosition.x,
            y: suggestion.newPosition.y
          });
        }
        break;

      case 'rotate':
        if (suggestion.newRotation !== undefined) {
          await eda.sch_PrimitiveComponent.modify(suggestion.component, {
            rotation: suggestion.newRotation
          });
        }
        break;

      case 'replace':
        // 部品を置き換え（高度な機能）
        break;
    }
  }

  private async askUserApproval(suggestion: ImprovementSuggestion): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        window.postMessage({
          type: 'ASK_APPROVAL',
          suggestion,
          callback: (approved: boolean) => resolve(approved)
        }, '*');
      } else {
        resolve(false);
      }
    });
  }

  private async markdownToHTML(markdown: string): Promise<string> {
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\n/gim, '<br>');
  }
}

export default AIOrchestrator;
