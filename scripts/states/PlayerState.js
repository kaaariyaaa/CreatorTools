import { world } from '@minecraft/server';

export class PlayerState {
    static states = new Map();

    constructor(player) {
        this.player = player;
        this.isInvincible = false;
        this.loadState();
    }

    static getState(player) {
        if (!this.states.has(player.id)) {
            this.states.set(player.id, new PlayerState(player));
        }
        return this.states.get(player.id);
    }

    loadState() {
        const savedStateStr = this.player.getDynamicProperty("ct:playerState");
        if (savedStateStr) {
            try {
                const savedState = JSON.parse(savedStateStr);
                this.isInvincible = savedState.isInvincible;
            } catch (e) {
                console.warn("プレイヤーの状態の読み込みに失敗しました:", e);
            }
        }
    }

    saveState() {
        try {
            const stateStr = JSON.stringify({
                isInvincible: this.isInvincible
            });
            this.player.setDynamicProperty("ct:playerState", stateStr);
        } catch (e) {
            console.warn("プレイヤーの状態の保存に失敗しました:", e);
        }
    }

    toggleInvincible() {
        this.isInvincible = !this.isInvincible;
        this.player.sendMessage(this.isInvincible ? "無敵モードが有効になりました" : "無敵モードが無効になりました");
        this.saveState();
    }
} 