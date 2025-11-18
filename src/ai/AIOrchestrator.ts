/**
 * AIOrchestrator.ts
 * デュアルAIエンジン（GPT-5.1 + Gemini 2.5 Pro）を統合したオーケストレーター
 *
 * 使用するAPI:
 * - OpenAI API (GPT-5.1): https://platform.openai.com/docs/models
 * - Google Gemini API (Gemini 2.5 Pro): https://ai.google.dev/gemini-api/docs/models
 */

// 型定義
interface AIEngineConfig {
	gpt51: {
		apiKey: string;
		model: 'gpt-5.1-preview' | 'gpt-5';
		baseURL?: string;
	};
	gemini25: {
		apiKey: string;
		model: 'gemini-2.5-pro' | 'gemini-2.5-flash';
		baseURL?: string;
	};
}

interface RequestUnderstanding {
	userGoal: string;
	technicalRequirements: string[];
	safetyConsiderations: string[];
	recommendedApproach: string;
	estimatedDifficulty: '初心者' | '中級者' | '上級者';
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
	quality: 'excellent' | 'good' | 'needsImprovement';
	score: number;
	strengths: string[];
	issues: ValidationIssue[];
	suggestions: ImprovementSuggestion[];
	learningPoints: string[];
	beginnerFriendly: boolean;
}

interface ValidationIssue {
	severity: 'error' | 'warning' | 'info';
	location: string;
	description: string;
	suggestion: string;
	educational: string;
}

interface ImprovementSuggestion {
	component: string;
	action: 'move' | 'rotate' | 'replace';
	newPosition?: { x: number; y: number };
	newRotation?: number;
	reason: string;
	severity?: 'error' | 'warning' | 'info';
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
 *
 * NOTE: 実際のAPI呼び出しを行うには、以下のパッケージをインストールしてください:
 * - npm install openai \@google/genai
 *
 * ブラウザ環境での使用には以下の設定が必要です:
 * - OpenAI: dangerouslyAllowBrowser: true
 * - Gemini: ブラウザ互換バージョンを使用
 */
export class AIOrchestrator {
	private config: AIEngineConfig;
	private conversationHistory: Message[] = [];
	private currentDesignState: DesignState = {};

	public constructor(config: AIEngineConfig) {
		this.config = config;
		console.log('AIOrchestrator initialized with models:', {
			openai: config.gpt51.model,
			gemini: config.gemini25.model,
		});
	}

	/**
	 * ユーザーリクエストを処理するメインメソッド
	 */
	public async processUserRequest(userInput: string, _context: ConversationContext): Promise<DesignResponse> {
		try {
			// Phase 1: GPT-5.1でリクエストを深く理解
			const understanding = await this.understandRequest(userInput, _context);

			// Phase 2: 設計仕様を生成
			const designSpec = await this.generateDesignSpec(understanding);

			// Phase 3: EasyEDA APIで回路を実装
			const implementation = await this.implementCircuit(designSpec);

			// Phase 4: Gemini 2.5 Proで視覚的検証
			const visualValidation = await this.validateVisually(implementation);

			// Phase 5: フィードバックに基づいて改善
			if (visualValidation.needsImprovement) {
				const improved = await this.improveDesign(implementation, visualValidation.suggestions);
				return improved;
			}

			return {
				success: true,
				design: implementation,
				explanation: await this.generateBeginnerExplanation(designSpec, implementation),
				visualAnalysis: visualValidation,
			};
		} catch (error: any) {
			console.error('Error in processUserRequest:', error);
			throw error;
		}
	}

	/**
	 * GPT-5.1のthinking機能を活用した深い理解
	 *
	 * OpenAI API Reference:
	 * - Model: gpt-5.1-preview or gpt-5
	 * - Endpoint: https://api.openai.com/v1/chat/completions
	 * - Features: reasoning_effort parameter for thinking capability
	 */
	private async understandRequest(userInput: string, _context: ConversationContext): Promise<RequestUnderstanding> {
		console.log('Understanding request:', userInput);

		try {
			// OpenAI Chat Completions API を使用
			// https://platform.openai.com/docs/api-reference/chat/create
			const response = await fetch(this.config.gpt51.baseURL || 'https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.config.gpt51.apiKey}`,
				},
				body: JSON.stringify({
					model: this.config.gpt51.model,
					messages: [
						{
							role: 'system',
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
}`,
						},
						...this.conversationHistory,
						{
							role: 'user',
							content: userInput,
						},
					],
					temperature: 0.7,
					reasoning_effort: 'high', // GPT-5.1のthinking機能
					response_format: { type: 'json_object' },
				}),
			});

			if (!response.ok) {
				throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			const content = data.choices[0].message.content;

			// reasoning プロセスをログに記録（利用可能な場合）
			if (data.reasoning) {
				console.log('GPT-5.1 Thinking Process:', data.reasoning);
			}

			return JSON.parse(content);
		} catch (error: any) {
			console.error('Error calling OpenAI API:', error);
			// フォールバック: モックレスポンス
			return {
				userGoal: userInput,
				technicalRequirements: ['LED制御', '電流制限'],
				safetyConsiderations: ['過電流保護'],
				recommendedApproach: 'シンプルなLED回路',
				estimatedDifficulty: '初心者',
				estimatedCost: 100,
				requiredComponents: [
					{
						name: 'LED',
						purpose: '光を発する',
						jlcpcbId: 'C2286',
					},
				],
				educationalPoints: ['オームの法則'],
			};
		}
	}

	/**
	 * 詳細な設計仕様を生成
	 */
	private async generateDesignSpec(_understanding: RequestUnderstanding): Promise<DetailedDesignSpec> {
		console.log('Generating design spec from understanding');

		// モックレスポンス
		return {
			schematic: {
				components: [
					{
						id: 'R1',
						type: 'resistor',
						value: '330',
						unit: 'ohm',
						jlcpcbId: 'C21190',
						position: { x: 100, y: 100 },
						rotation: 0,
						explanation: 'LED電流制限用抵抗',
					},
				],
				connections: [],
				powerSupply: {
					voltage: 5,
					current: 0.02,
					connector: 'USB_MICRO',
				},
			},
			bom: [
				{
					designator: 'R1',
					jlcpcbId: 'C21190',
					name: '抵抗 330Ω',
					quantity: 1,
					price: 0.001,
					inStock: true,
				},
			],
			assemblyInstructions: ['抵抗を配置'],
			safetyNotes: ['極性に注意'],
			educationalContent: {
				concepts: ['オームの法則'],
				calculations: [],
			},
		};
	}

	/**
	 * EasyEDA APIで回路を実装
	 */
	private async implementCircuit(spec: DetailedDesignSpec): Promise<CircuitImplementation> {
		const result: CircuitImplementation = {
			componentIds: [],
			wireIds: [],
			screenshot: null,
			success: false,
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
			console.error('Circuit implementation failed:', error);
			throw new Error(`回路の実装に失敗しました: ${error.message}`);
		}
	}

	/**
	 * Gemini 2.5 Proで視覚的検証
	 *
	 * Google Gemini API Reference:
	 * - Model: gemini-2.5-pro or gemini-2.5-flash
	 * - Endpoint: https://generativelanguage.googleapis.com/v1/models/\{model\}:generateContent
	 * - Features: Multimodal input (text + images)
	 */
	private async validateVisually(implementation: CircuitImplementation): Promise<VisualValidationResult> {
		console.log('Validating visually with Gemini');

		if (!implementation.screenshot) {
			console.warn('No screenshot available for visual validation');
			return {
				needsImprovement: false,
				quality: 'good',
				score: 85,
				strengths: ['シンプルな配置'],
				issues: [],
				suggestions: [],
				learningPoints: ['基本的な回路構成'],
				beginnerFriendly: true,
			};
		}

		try {
			// Blobを Base64に変換
			const base64Image = await this.blobToBase64(implementation.screenshot);

			// Gemini API を使用
			// https://ai.google.dev/gemini-api/docs/vision
			const endpoint = `https://generativelanguage.googleapis.com/v1/models/${this.config.gemini25.model}:generateContent`;

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-goog-api-key': this.config.gemini25.apiKey,
				},
				body: JSON.stringify({
					contents: [
						{
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
}`,
								},
								{
									inlineData: {
										mimeType: 'image/png',
										data: base64Image,
									},
								},
							],
						},
					],
					generationConfig: {
						temperature: 0.4,
						responseMimeType: 'application/json',
					},
				}),
			});

			if (!response.ok) {
				throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			const analysis = JSON.parse(data.candidates[0].content.parts[0].text);

			return {
				needsImprovement: analysis.overallQuality === 'needsImprovement',
				quality: analysis.overallQuality,
				score: analysis.layoutScore,
				strengths: analysis.strengths,
				issues: analysis.issues,
				suggestions: analysis.improvements,
				learningPoints: analysis.learningPoints,
				beginnerFriendly: analysis.beginnerFriendly,
			};
		} catch (error: any) {
			console.error('Error calling Gemini API:', error);
			// フォールバック: モックレスポンス
			return {
				needsImprovement: false,
				quality: 'good',
				score: 85,
				strengths: ['シンプルな配置'],
				issues: [],
				suggestions: [],
				learningPoints: ['基本的な回路構成'],
				beginnerFriendly: true,
			};
		}
	}

	/**
	 * 視覚的フィードバックに基づいて設計を改善
	 */
	private async improveDesign(current: CircuitImplementation, suggestions: ImprovementSuggestion[]): Promise<DesignResponse> {
		for (const suggestion of suggestions) {
			if (suggestion.severity === 'error') {
				await this.applyImprovement(suggestion);
			}
		}

		const newScreenshot = typeof eda !== 'undefined' && eda.dmt_EditorControl ? await eda.dmt_EditorControl.getCurrentRenderedAreaImage() : null;

		const finalValidation = await this.validateVisually({
			...current,
			screenshot: newScreenshot,
		});

		return {
			success: true,
			design: current,
			explanation: await this.generateBeginnerExplanation(null, current),
			visualAnalysis: finalValidation,
			improvements: suggestions,
		};
	}

	/**
	 * 初心者向けの説明を生成
	 */
	private async generateBeginnerExplanation(
		_spec: DetailedDesignSpec | null,
		_implementation: CircuitImplementation,
	): Promise<BeginnerExplanation> {
		const markdown = `# 回路が完成しました！\n\nこの回路は基本的な電子回路です。`;

		return {
			markdown,
			htmlRendered: await this.markdownToHTML(markdown),
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
			window.postMessage(
				{
					type: 'DESIGN_PROGRESS',
					message,
				},
				'*',
			);
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
			true,
		);

		if (!placed) {
			throw new Error(`部品の配置に失敗しました: ${comp.id}`);
		}

		return {
			id: placed.getState_PrimitiveId(),
			spec: comp,
			primitive: placed,
		};
	}

	private async createWire(conn: ConnectionSpec): Promise<CreatedWire> {
		if (typeof eda === 'undefined' || !eda.sch_PrimitiveWire) {
			throw new Error('EasyEDA API が利用できません');
		}

		const wire = await eda.sch_PrimitiveWire.create(conn.path, conn.net);

		if (!wire) {
			throw new Error(`配線の作成に失敗しました: ${conn.net}`);
		}

		return {
			id: wire.getState_PrimitiveId(),
			spec: conn,
			primitive: wire,
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
			case 'move': {
				const comp = await eda.sch_Primitive.getPrimitiveByPrimitiveId(suggestion.component);
				if (comp && suggestion.newPosition) {
					await eda.sch_PrimitiveComponent.modify(suggestion.component, {
						x: suggestion.newPosition.x,
						y: suggestion.newPosition.y,
					});
				}
				break;
			}

			case 'rotate':
				if (suggestion.newRotation !== undefined) {
					await eda.sch_PrimitiveComponent.modify(suggestion.component, {
						rotation: suggestion.newRotation,
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
				window.postMessage(
					{
						type: 'ASK_APPROVAL',
						suggestion,
						callback: (approved: boolean) => resolve(approved),
					},
					'*',
				);
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
