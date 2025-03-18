import { world } from '@minecraft/server';

export class PlayerState {
    static states = new Map();

    constructor(player) {
        this.player = player;
        this.isInvincible = false;
        this.isNightVision = false;
        this.gamemode = player.getGameMode();
        this.loadState();
    }

    static getState(player) {
        if (!this.states.has(player.id)) {
            this.states.set(player.id, new PlayerState(player));
        }
        return this.states.get(player.id);
    }

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

    toggleState(stateKey, message) {
        this[stateKey] = !this[stateKey];
        this.player.sendMessage(this[stateKey] ? `${message}が有効になりました` : `${message}が無効になりました`);
        this.saveState();
    }

    toggleInvincible() {
        this.toggleState("isInvincible", "無敵モード");
    }

    toggleNightVision() {
        this.toggleState("isNightVision", "ナイトビジョン");
    }
}