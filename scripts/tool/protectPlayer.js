// プレイヤーに効果を適用する関数
/**
 * @param {Player} player - 効果を適用する対象のプレイヤー
 * @param {Array} effects - 適用する効果のリスト
 */
function applyEffects(player, effects) {
    for (const { effect, duration, options } of effects) {
        player.addEffect(effect, duration, options);
    }
}

// プレイヤーから効果を削除する関数
/**
 * @param {Player} player - 効果を削除する対象のプレイヤー
 * @param {Array} effects - 削除する効果のリスト
 */
function removeEffects(player, effects) {
    for (const effect of effects) {
        if (player.getEffect(effect)) {
            player.removeEffect(effect);
        }
    }
}

// プレイヤーの体力を回復し、負の効果を除去します
/**
 * @param {Player} player - 体力回復を実行する対象のプレイヤー
 * @returns {boolean} 処理が成功したかどうか
 */
export function fullhealth(player) {
    try {
        const health = player.getComponent("minecraft:health");
        if (health) {
            health.setCurrentValue(health.effectiveMax);
        }

        applyEffects(player, [
            { effect: "minecraft:saturation", duration: 1, options: { amplifier: 255, showParticles: false } }
        ]);

        removeNegativeEffects(player);
        return true;
    } catch (e) {
        console.warn("体力回復処理に失敗しました:", e);
        return false;
    }
}

// プレイヤーを無敵状態にします
/**
 * @param {Player} player - 無敵化を実行する対象のプレイヤー
 * @returns {boolean} 処理が成功したかどうか
 */
export function invincible(player) {
    try {
        applyEffects(player, [
            { effect: "minecraft:resistance", duration: 2, options: { amplifier: 255, showParticles: false } },
            { effect: "minecraft:fire_resistance", duration: 2, options: { amplifier: 255, showParticles: false } }
        ]);

        removeNegativeEffects(player);
        return true;
    } catch (e) {
        console.warn("無敵化処理に失敗しました:", e);
        return false;
    }
}

// プレイヤーから負の効果を除去します
/**
 * @param {Player} player - 負の効果を除去する対象のプレイヤー
 * @returns {boolean} 処理が成功したかどうか
 */
function removeNegativeEffects(player) {
    try {
        const negativeEffects = [
            "minecraft:poison",
            "minecraft:wither",
            "minecraft:hunger",
            "minecraft:weakness",
            "minecraft:mining_fatigue"
        ];

        removeEffects(player, negativeEffects);
        return true;
    } catch (e) {
        console.warn("負の効果の除去に失敗しました:", e);
        return false;
    }
}

