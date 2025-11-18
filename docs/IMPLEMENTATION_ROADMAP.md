# 実装ロードマップ - 初心者向けAI回路設計エージェント

## 🎯 プロジェクト目標

回路設計の知識が全くない初心者でも、自然言語で回路を設計し、マルチモーダルAIの視覚的フィードバックを受けながら、最終的にJLCPCBで基板を発注できるシステムを構築する。

---

## 📅 全体スケジュール（16週間）

### Phase 1: 基盤構築（Week 1-4）

### Phase 2: AI統合（Week 5-8）

### Phase 3: 初心者向けUI（Week 9-12）

### Phase 4: 統合テスト & 改善（Week 13-16）

---

## 🏗️ Phase 1: 基盤構築（4週間）

### Week 1: プロジェクトセットアップ

**目標**: 開発環境の準備とプロトタイプの基本構造を作成

**タスク**:

- [x] リポジトリのフォークと環境セットアップ
- [ ] プロジェクト構造の設計
- [ ] 基本的なiFrameインターフェースの作成
- [ ] EasyEDA API の動作確認

**成果物**:

```
pro-api-sdk-ai-powered/
├── src/
│   ├── index.ts              # エントリーポイント
│   ├── ai/
│   │   ├── AIOrchestrator.ts # AI統合の中核
│   │   ├── GPT51Client.ts    # GPT-5.1 ラッパー
│   │   └── Gemini25Client.ts # Gemini 2.5 ラッパー
│   ├── circuit/
│   │   ├── CircuitBuilder.ts # 回路生成エンジン
│   │   └── ComponentDB.ts    # JLCPCB部品データベース
│   └── ui/
│       └── MessageBus.ts     # iFrame通信
├── iframe/
│   ├── ai-designer.html      # メインUI
│   ├── styles/
│   │   └── main.css
│   └── scripts/
│       ├── main.js
│       ├── chat.js
│       └── preview.js
├── docs/
│   ├── AI_INTEGRATION_ARCHITECTURE.md
│   └── IMPLEMENTATION_ROADMAP.md
└── extension.json
```

**実装例**:

```typescript
// src/index.ts
export async function activate() {
	console.log('AI Circuit Designer activated');

	// API キー設定画面を表示（初回のみ）
	const hasApiKeys = await checkApiKeys();
	if (!hasApiKeys) {
		await showApiKeySetup();
	}
}

export async function openAIDesigner() {
	await eda.sys_IFrame.openIFrame('/iframe/ai-designer.html', 1200, 800, 'ai-designer');
}

async function checkApiKeys(): Promise<boolean> {
	const gptKey = await eda.sys_Setting.get('gpt51_api_key');
	const geminiKey = await eda.sys_Setting.get('gemini_api_key');
	return !!(gptKey && geminiKey);
}

async function showApiKeySetup() {
	// 設定ダイアログを表示
	await eda.sys_Dialog.showInformationMessage('AIエージェントを使用するには、OpenAIとGoogle Geminiの APIキーが必要です。', 'セットアップ');
}
```

### Week 2: 基本的なAI統合

**目標**: GPT-5.1とGemini 2.5 Proの基本的な統合

**タスク**:

- [ ] OpenAI GPT-5.1 API クライアントの実装
- [ ] Google Gemini 2.5 Pro API クライアントの実装
- [ ] 基本的なプロンプトテンプレートの作成
- [ ] エラーハンドリングの実装

**実装例**:

```typescript
// src/ai/GPT51Client.ts
import OpenAI from 'openai';

export class GPT51Client {
	private client: OpenAI;

	constructor(apiKey: string) {
		this.client = new OpenAI({
			apiKey,
			dangerouslyAllowBrowser: true,
		});
	}

	async analyzeRequest(userInput: string): Promise<DesignUnderstanding> {
		const response = await this.client.chat.completions.create({
			model: 'gpt-5.1-preview',
			messages: [
				{
					role: 'system',
					content: SYSTEM_PROMPT_UNDERSTANDING,
				},
				{
					role: 'user',
					content: userInput,
				},
			],
			temperature: 0.7,
			reasoning_effort: 'high',
			response_format: { type: 'json_object' },
		});

		return JSON.parse(response.choices[0].message.content);
	}

	async generateDesignSpec(understanding: DesignUnderstanding): Promise<DetailedSpec> {
		// 実装...
	}
}

// プロンプトテンプレート
const SYSTEM_PROMPT_UNDERSTANDING = `
あなたは電子回路設計の専門家で、初心者をサポートします。

# 役割
- ユーザーの要求を深く理解する
- 技術的に実現可能な方法を検討する
- 初心者でも実装できる最適な設計を提案する

# 制約
- JLCPCB在庫部品のみ使用
- 初心者が半田付けできる部品サイズ
- 安全性を最優先
- コストは1000円以下を目指す

# 出力形式
JSON形式で以下を返す：
{
  "userGoal": "ユーザーの目標",
  "technicalRequirements": [...],
  "recommendedComponents": [...],
  "estimatedDifficulty": "初心者",
  "estimatedCost": 500,
  "educationalPoints": [...]
}
`;
```

### Week 3: 回路生成エンジン

**目標**: EasyEDA APIを使った回路図自動生成

**タスク**:

- [ ] 部品配置アルゴリズムの実装
- [ ] 自動配線ロジックの実装
- [ ] レイアウト最適化
- [ ] JLCPCB部品データベースの統合

**実装例**:

```typescript
// src/circuit/CircuitBuilder.ts
export class CircuitBuilder {
	/**
	 * 設計仕様から回路図を生成
	 */
	async buildCircuit(spec: DetailedDesignSpec): Promise<BuildResult> {
		const result: BuildResult = {
			components: [],
			wires: [],
			success: false,
		};

		try {
			// 1. グリッドレイアウトを計算
			const layout = this.calculateLayout(spec.schematic.components);

			// 2. コンポーネントを配置
			for (const comp of spec.schematic.components) {
				const position = layout.get(comp.id);
				const placed = await this.placeComponent(comp, position);
				result.components.push(placed);
			}

			// 3. 配線
			for (const conn of spec.schematic.connections) {
				const wire = await this.createConnection(conn, result.components);
				result.wires.push(wire);
			}

			// 4. レイアウト最適化
			await this.optimizeLayout(result);

			result.success = true;
			return result;
		} catch (error) {
			throw new CircuitBuildError(
				error.message,
				'回路の生成に失敗しました。もう一度試すか、設計を簡略化してください。',
				['より簡単な回路から始める', '部品数を減らす'],
				true,
			);
		}
	}

	/**
	 * グリッドベースのレイアウト計算
	 */
	private calculateLayout(components: ComponentSpec[]): Map<string, Position> {
		const layout = new Map<string, Position>();
		const GRID_SIZE = 100; // 0.01inch単位
		const SPACING = 200;

		// シンプルな左から右への配置
		let currentX = GRID_SIZE;
		let currentY = GRID_SIZE;
		let maxHeight = 0;

		for (const comp of components) {
			layout.set(comp.id, { x: currentX, y: currentY });

			// 次の位置を計算
			currentX += SPACING;

			// 改行ロジック（4つごとに）
			if (layout.size % 4 === 0) {
				currentX = GRID_SIZE;
				currentY += SPACING;
			}
		}

		return layout;
	}

	/**
	 * 部品を配置
	 */
	private async placeComponent(spec: ComponentSpec, position: Position): Promise<PlacedComponent> {
		// JLCPCBから部品情報を取得
		const deviceInfo = await eda.lib_Device.getByLcscIds(spec.jlcpcbId);

		if (!deviceInfo) {
			throw new Error(`部品が見つかりません: ${spec.jlcpcbId} (${spec.name})`);
		}

		// 配置
		const primitive = await eda.sch_PrimitiveComponent.create(
			deviceInfo,
			position.x,
			position.y,
			undefined,
			spec.rotation || 0,
			false,
			true, // BOMに追加
			true, // PCBに転送
		);

		if (!primitive) {
			throw new Error(`部品の配置に失敗: ${spec.id}`);
		}

		return {
			id: primitive.getState_PrimitiveId(),
			spec,
			primitive,
			position,
		};
	}

	/**
	 * 配線を作成
	 */
	private async createConnection(conn: ConnectionSpec, components: PlacedComponent[]): Promise<CreatedWire> {
		// 始点と終点の座標を計算
		const fromComp = components.find((c) => c.spec.id === conn.from.component);
		const toComp = components.find((c) => c.spec.id === conn.to.component);

		if (!fromComp || !toComp) {
			throw new Error(`配線エラー: 部品が見つかりません`);
		}

		// 簡易的な配線パス（直線）
		const path = [fromComp.position.x, fromComp.position.y, toComp.position.x, toComp.position.y];

		const wire = await eda.sch_PrimitiveWire.create(path, conn.net);

		if (!wire) {
			throw new Error(`配線の作成に失敗: ${conn.net}`);
		}

		return {
			id: wire.getState_PrimitiveId(),
			spec: conn,
			primitive: wire,
		};
	}

	/**
	 * レイアウト最適化
	 */
	private async optimizeLayout(result: BuildResult): Promise<void> {
		// Phase 1 では簡易実装
		// Phase 2 以降で AI を使った最適化を実装
	}
}
```

### Week 4: 視覚的フィードバックの基礎

**目標**: Gemini 2.5 Proによる回路図の視覚的分析

**タスク**:

- [ ] スクリーンショット取得機能の実装
- [ ] Gemini 2.5 Proへの画像送信
- [ ] 分析結果の解析とUI表示
- [ ] 基本的な改善提案の適用

**実装例**:

```typescript
// src/ai/Gemini25Client.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export class Gemini25Client {
	private client: GoogleGenerativeAI;
	private model: any;

	constructor(apiKey: string) {
		this.client = new GoogleGenerativeAI(apiKey);
		this.model = this.client.getGenerativeModel({
			model: 'gemini-2.5-pro-preview',
		});
	}

	/**
	 * 回路図画像を分析
	 */
	async analyzeCircuitImage(imageBlob: Blob): Promise<VisualAnalysis> {
		// Blobを Base64に変換
		const base64 = await this.blobToBase64(imageBlob);

		const result = await this.model.generateContent({
			contents: [
				{
					parts: [
						{
							text: CIRCUIT_ANALYSIS_PROMPT,
						},
						{
							inlineData: {
								mimeType: 'image/png',
								data: base64,
							},
						},
					],
				},
			],
			generationConfig: {
				temperature: 0.4,
				responseMimeType: 'application/json',
			},
		});

		const analysis = JSON.parse(result.response.text());

		return {
			quality: analysis.overallQuality,
			score: analysis.layoutScore,
			strengths: analysis.strengths,
			issues: analysis.issues.map(this.mapIssue),
			suggestions: analysis.improvements.map(this.mapSuggestion),
			learningPoints: analysis.learningPoints,
			beginnerFriendly: analysis.beginnerFriendly,
		};
	}

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

	private mapIssue(raw: any): ValidationIssue {
		return {
			severity: raw.severity,
			location: raw.location,
			description: raw.description,
			suggestion: raw.suggestion,
			educational: raw.educational,
		};
	}

	private mapSuggestion(raw: any): ImprovementSuggestion {
		return {
			component: raw.component,
			action: raw.action,
			newPosition: raw.newPosition,
			newRotation: raw.newRotation,
			reason: raw.reason,
		};
	}
}

const CIRCUIT_ANALYSIS_PROMPT = `
この電子回路図を初心者向けに分析してください。

# 分析項目
1. **レイアウトの質**: 部品配置が適切か、見やすいか
2. **配線の最適性**: 交差、長さ、曲がり具合
3. **初心者が見落としやすいエラー**: 極性、接続ミス等
4. **安全性**: ショートのリスク、保護回路の有無
5. **実装の容易さ**: 半田付けのしやすさ

# 評価基準
- 初心者が理解しやすいか（図面の読みやすさ）
- 実装（半田付け）しやすいか（部品間隔、配線）
- 業界標準に沿っているか（慣習的な配置）

# 出力形式（JSON）
{
  "overallQuality": "excellent/good/needsImprovement",
  "layoutScore": 85,
  "strengths": [
    "電源とGNDが明確に分離されている",
    "IC周辺のデカップリングコンデンサが適切に配置"
  ],
  "issues": [
    {
      "severity": "warning",
      "location": "R1付近",
      "description": "抵抗R1が配線と重なって見づらい",
      "suggestion": "R1を右側に10mm移動",
      "educational": "部品と配線は重ならないように配置すると、回路図が読みやすくなります"
    }
  ],
  "improvements": [
    {
      "component": "R1",
      "action": "move",
      "newPosition": {"x": 150, "y": 100},
      "reason": "配線との重なりを解消し、視認性を向上"
    }
  ],
  "learningPoints": [
    "デカップリングコンデンサはICのすぐ近くに配置することで、ノイズを効果的に除去できます",
    "LEDには必ず電流制限抵抗を直列に接続します"
  ],
  "visualComplexity": "simple",
  "beginnerFriendly": true
}
`;
```

---

## 🤖 Phase 2: AI統合の深化（4週間）

### Week 5: デュアルAIオーケストレーション

**目標**: GPT-5.1とGemini 2.5 Proの協調動作

**タスク**:

- [ ] AIOrchestrator クラスの完成
- [ ] 役割分担の最適化
- [ ] 結果の統合ロジック
- [ ] エラーリカバリー機構

**主要機能**:

```typescript
// AIOrchestratorの主要メソッド
class AIOrchestrator {
	// 1. ユーザーリクエストの理解（GPT-5.1 Thinking）
	async understandRequest(input: string): Promise<Understanding>;

	// 2. 設計仕様の生成（GPT-5.1 Thinking）
	async generateDesignSpec(understanding: Understanding): Promise<Spec>;

	// 3. 回路の実装（EasyEDA API）
	async implementCircuit(spec: Spec): Promise<Implementation>;

	// 4. 視覚的検証（Gemini 2.5 Pro Multimodal）
	async validateVisually(impl: Implementation): Promise<Validation>;

	// 5. 改善の適用（統合）
	async improveDesign(impl: Implementation, validation: Validation): Promise<Final>;
}
```

### Week 6: 初心者向け説明生成

**目標**: AI生成の教育的コンテンツ

**タスク**:

- [ ] 段階的な説明生成
- [ ] 視覚的な注釈の追加
- [ ] インタラクティブなチュートリアル
- [ ] 用語集の自動生成

**実装例**:

```typescript
// 教育的説明の生成
async function generateEducationalContent(design: CircuitDesign): Promise<EducationalContent> {
	const explanation = await gpt51.chat({
		messages: [
			{
				role: 'system',
				content: `
        完成した回路について、中学生でも理解できる説明を生成してください。

        # 説明の構成
        1. **この回路は何をするか**（1文で）
        2. **使用部品の説明**（各部品の役割を日常用語で）
        3. **動作原理**（ステップバイステップで）
        4. **重要な注意点**（安全面、よくある間違い）
        5. **次のステップ**（実装、テスト、応用）

        # トーン
        - 親しみやすく、励ます
        - 専門用語は必ず説明
        - 絵文字を適度に使用
        - 達成感を与える

        Markdown形式で、図解のための画像参照も含めてください。
      `,
			},
		],
		temperature: 0.8,
	});

	return {
		markdown: explanation,
		htmlRendered: await markdownToHTML(explanation),
		interactive: await generateInteractiveSteps(design),
	};
}
```

### Week 7: 部品データベースとコスト最適化

**目標**: JLCPCB部品の自動選択と最適化

**タスク**:

- [ ] JLCPCB部品データベースの構築
- [ ] 在庫状況の確認機能
- [ ] コスト最適化アルゴリズム
- [ ] 代替部品の提案

**実装例**:

```typescript
// src/circuit/ComponentDB.ts
export class ComponentDatabase {
	/**
	 * 仕様に基づいて最適な部品を検索
	 */
	async findOptimalComponent(spec: ComponentRequirement, constraints: Constraints): Promise<JLCPCBComponent> {
		// 1. 仕様に合う部品を検索
		const candidates = await this.searchComponents(spec);

		// 2. 制約でフィルタリング
		const filtered = candidates.filter((c) => c.inStock && c.price <= constraints.maxPrice && c.package in constraints.allowedPackages);

		// 3. スコアリング
		const scored = filtered.map((c) => ({
			component: c,
			score: this.calculateScore(c, constraints),
		}));

		// 4. 最適な部品を選択
		scored.sort((a, b) => b.score - a.score);

		if (scored.length === 0) {
			throw new Error(`適切な部品が見つかりません: ${spec.type}`);
		}

		return scored[0].component;
	}

	private calculateScore(component: JLCPCBComponent, constraints: Constraints): number {
		let score = 0;

		// 在庫状況（最重要）
		if (component.inStock) score += 100;

		// 価格（安い方が高得点）
		score += ((constraints.maxPrice - component.price) / constraints.maxPrice) * 50;

		// パッケージサイズ（初心者向けは大きい方が良い）
		if (component.package.includes('TH')) score += 30; // スルーホール優先
		if (component.package.includes('0805')) score += 20;
		if (component.package.includes('0603')) score += 10;

		// 納期（短い方が良い）
		score += ((30 - component.leadTime) / 30) * 20;

		return score;
	}

	private async searchComponents(spec: ComponentRequirement): Promise<JLCPCBComponent[]> {
		// EasyEDA APIで検索
		const results = await eda.lib_Device.search(
			spec.searchQuery,
			undefined, // システムライブラリ
			spec.classification,
		);

		return results.map(this.mapToComponent);
	}
}
```

### Week 8: 統合テストとデバッグ

**目標**: Phase 1-2の統合とバグ修正

**タスク**:

- [ ] エンドツーエンドテストの実装
- [ ] エラーケースの網羅的テスト
- [ ] パフォーマンス最適化
- [ ] ドキュメント更新

---

## 🎨 Phase 3: 初心者向けUI/UX（4週間）

### Week 9: チャットインターフェース

**目標**: 直感的な対話型UI

**タスク**:

- [ ] チャット UI の実装
- [ ] リアルタイムプレビュー
- [ ] 進捗表示とローディング
- [ ] エラーメッセージの洗練

**UI例**:

```html
<!-- iframe/components/ChatInterface.html -->
<div class="chat-interface">
	<!-- メッセージ表示エリア -->
	<div class="messages-container" id="messages">
		<!-- AIメッセージ -->
		<div class="message assistant">
			<div class="avatar">🤖</div>
			<div class="content">
				<div class="text">
					LEDを光らせる回路を設計しますね！
					<br /><br />
					💡 <strong>必要な部品:</strong>
				</div>
				<div class="component-cards">
					<div class="card">
						<img src="led-icon.png" />
						<div class="name">LED (赤)</div>
						<div class="jlcpcb-id">C2286</div>
						<div class="price">¥5</div>
					</div>
					<div class="card">
						<img src="resistor-icon.png" />
						<div class="name">抵抗 330Ω</div>
						<div class="jlcpcb-id">C21190</div>
						<div class="price">¥2</div>
					</div>
				</div>
				<div class="thinking-process">
					<summary>🤔 AIの思考プロセスを見る</summary>
					<details>
						<p>
							1. LEDを光らせるには電流制限が必要<br />
							2. 5V電源、LED電圧降下2V、電流20mA想定<br />
							3. 抵抗値 = (5-2)/0.02 = 150Ω<br />
							4. 安全マージンを考慮して330Ωを選択
						</p>
					</details>
				</div>
			</div>
		</div>

		<!-- ユーザーメッセージ -->
		<div class="message user">
			<div class="content">LEDを光らせたい</div>
			<div class="avatar">👤</div>
		</div>
	</div>

	<!-- 入力エリア -->
	<div class="input-container">
		<textarea id="userInput" placeholder="例: Arduino で温度を測りたい" rows="2"></textarea>
		<button id="sendBtn" class="send-button">送信 ✨</button>
	</div>

	<!-- クイックアクション -->
	<div class="quick-actions">
		<button class="quick-btn">💡 例を見る</button>
		<button class="quick-btn">❓ ヘルプ</button>
		<button class="quick-btn">🔄 やり直し</button>
	</div>
</div>
```

### Week 10: ビジュアルフィードバックUI

**目標**: Geminiの分析結果を視覚的に表示

**タスク**:

- [ ] 回路図上への注釈表示
- [ ] 改善提案のビジュアル化
- [ ] Before/After比較
- [ ] インタラクティブな修正

**実装例**:

```typescript
// iframe/scripts/visual-feedback.ts
class VisualFeedbackRenderer {
	/**
	 * Geminiの分析結果を視覚的に表示
	 */
	async renderFeedback(analysis: VisualAnalysis, screenshotUrl: string): Promise<void> {
		const container = document.getElementById('visual-feedback');

		// 1. 回路図を表示
		const imgEl = document.createElement('img');
		imgEl.src = screenshotUrl;
		imgEl.className = 'circuit-screenshot';

		// 2. 注釈を重ねて表示
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// 画像読み込み後に注釈を描画
		imgEl.onload = () => {
			canvas.width = imgEl.width;
			canvas.height = imgEl.height;

			// 元画像を描画
			ctx.drawImage(imgEl, 0, 0);

			// 問題箇所に注釈
			analysis.issues.forEach((issue, index) => {
				this.drawAnnotation(ctx, issue, index);
			});

			// 改善提案を矢印で表示
			analysis.suggestions.forEach((suggestion) => {
				this.drawImprovement(ctx, suggestion);
			});
		};

		// 3. テキストフィードバック
		const feedbackList = document.createElement('div');
		feedbackList.className = 'feedback-list';

		analysis.issues.forEach((issue) => {
			const item = this.createFeedbackItem(issue);
			feedbackList.appendChild(item);
		});

		container.innerHTML = '';
		container.appendChild(canvas);
		container.appendChild(feedbackList);
	}

	private drawAnnotation(ctx: CanvasRenderingContext2D, issue: ValidationIssue, index: number): void {
		// 問題箇所に円と番号を描画
		const color = issue.severity === 'error' ? '#ef4444' : '#f59e0b';

		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 3;

		// 円を描画（位置は簡易的に推定）
		const x = 100 + index * 50; // 実際は座標を解析
		const y = 100;
		const radius = 20;

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.stroke();

		// 番号を描画
		ctx.font = 'bold 16px sans-serif';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText((index + 1).toString(), x, y);
	}

	private createFeedbackItem(issue: ValidationIssue): HTMLElement {
		const item = document.createElement('div');
		item.className = `feedback-item ${issue.severity}`;

		const icon = issue.severity === 'error' ? '❌' : '⚠️';

		item.innerHTML = `
      <div class="feedback-header">
        <span class="icon">${icon}</span>
        <span class="location">${issue.location}</span>
      </div>
      <div class="feedback-content">
        <p class="description">${issue.description}</p>
        <p class="suggestion">💡 ${issue.suggestion}</p>
        <div class="educational">
          <details>
            <summary>📚 詳しく学ぶ</summary>
            <p>${issue.educational}</p>
          </details>
        </div>
      </div>
      <button class="apply-fix-btn" data-issue='${JSON.stringify(issue)}'>
        修正を適用
      </button>
    `;

		return item;
	}
}
```

### Week 11: 学習モードとチュートリアル

**目標**: 段階的な学習をサポート

**タスク**:

- [ ] インタラクティブチュートリアル
- [ ] 進捗トラッキング
- [ ] 知識ベースの構築
- [ ] バッジ・達成システム

### Week 12: JLCPCB発注フロー

**目標**: ワンクリック発注の実現

**タスク**:

- [ ] 発注前チェックリスト
- [ ] BOM自動生成
- [ ] 価格見積もり
- [ ] 発注ガイド

---

## 🧪 Phase 4: 統合テスト & 改善（4週間）

### Week 13-14: ベータテスト

**目標**: 実際のユーザーでテスト

**タスク**:

- [ ] テストユーザーの募集
- [ ] フィードバック収集
- [ ] バグ修正
- [ ] UX改善

### Week 15: パフォーマンス最適化

**タスク**:

- [ ] AI応答速度の改善
- [ ] UI レスポンスの最適化
- [ ] キャッシング実装
- [ ] エラーハンドリングの強化

### Week 16: リリース準備

**タスク**:

- [ ] ドキュメント完成
- [ ] デモビデオ作成
- [ ] リリースノート作成
- [ ] 公開

---

## 📊 成功指標（KPI）

### 技術指標

- [ ] AI応答時間 < 10秒
- [ ] 回路生成成功率 > 95%
- [ ] DRCエラー率 < 5%
- [ ] 視覚的検証精度 > 90%

### ユーザー体験指標

- [ ] 初回設計完了時間 < 5分
- [ ] ユーザー満足度 > 4.5/5
- [ ] チュートリアル完了率 > 80%
- [ ] JLCPCB発注成功率 > 90%

### 教育効果指標

- [ ] 基礎概念理解度テスト > 70%
- [ ] 2回目以降の自立設計率 > 60%
- [ ] コミュニティ貢献（設計共有）> 30%

---

## 💰 予算見積もり

### 開発コスト

- AI API使用料（開発中）: $500/月 × 4ヶ月 = $2,000
- テスト用基板発注: $500
- 開発者リソース: （既存リソース活用）

### 運用コスト（月額）

- GPT-5.1 API: $200-500/月（ユーザー数による）
- Gemini 2.5 Pro API: $100-300/月
- ホスティング: $0（EasyEDA拡張として）

---

## 🚀 次のステップ

1. **即座に開始できること**:

    - プロジェクト構造のセットアップ
    - 基本的なiFrame UIの実装
    - GPT-5.1 APIの動作確認

2. **準備が必要なこと**:

    - OpenAI GPT-5.1 APIキーの取得
    - Google Gemini 2.5 Pro APIキーの取得
    - テストユーザーの確保

3. **実装を開始しますか？**
    - どのPhaseから始めるか決定
    - 最初の機能を選択
    - コードのプロトタイプ作成

この計画について質問や調整が必要な箇所があれば、お気軽にお知らせください！
