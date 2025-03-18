import { world } from '@minecraft/server';

// プレイヤーの状態を管理するクラス
export class PlayerState {
    static states = new Map(); // プレイヤーごとの状態を保存するマップ

    constructor(player) {
        this.player = player;
        this.isInvincible = false; // 無敵状態
        this.isNightVision = false; // ナイトビジョン状態
        this.gamemode = player.getGameMode(); // 現在のゲームモード
        this.loadState(); // 保存された状態を読み込む
    }

    // プレイヤーの状態を取得する静的メソッド
    static getState(player) {
        if (!this.states.has(player.id)) {
            this.states.set(player.id, new PlayerState(player));
        }
        return this.states.get(player.id);
    }

    // 保存された状態を読み込む
    loadState() {
        try {
            const savedStateStr = this.player.getDynamicProperty("ct:playerState");
            if (savedStateStr) {
                const savedState = JSON.parse(savedStateStr);
                this.isInvincible = savedState.isInvincible || false;
                this.isNightVision = savedState.isNightVision || false;
            }
        } catch (e) {
            console.warn("プレイヤーの状態の読み込みに失敗しました:", e);
        }
    }

    // 現在の状態を保存する
    saveState() {
        try {
            const stateStr = JSON.stringify({
                isInvincible: this.isInvincible,
                isNightVision: this.isNightVision
            });
            this.player.setDynamicProperty("ct:playerState", stateStr);
        } catch (e) {
            console.warn("プレイヤーの状態の保存に失敗しました:", e);
        }
    }

    // 状態を切り替える汎用メソッド
    toggleState(stateKey, message) {
        this[stateKey] = !this[stateKey];
        this.player.onScreenDisplay.setActionBar(this[stateKey] ? `${message}が有効になりました` : `${message}が無効になりました`);
        this.saveState();
    }

    // 無敵状態を切り替える
    toggleInvincible() {
        this.toggleState("isInvincible", "無敵モード");
    }

    // ナイトビジョン状態を切り替える
    toggleNightVision() {
        this.toggleState("isNightVision", "ナイトビジョン");
    }
}