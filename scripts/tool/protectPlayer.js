/**
 * プレイヤーの体力を回復し、負の効果を除去します
 * @param {Player} player - 対象のプレイヤー
 * @returns {boolean} 処理が成功したかどうか
 */
export function fullhealth(player) {
    try {
        // 体力を最大値まで回復
        const health = player.getComponent("minecraft:health");
        if (health) {
            health.setCurrentValue(health.effectiveMax);
        }
        
        // 満腹度を回復
        player.addEffect("minecraft:saturation", 1, { amplifier: 255, showParticles: false });
        
        // 負の効果を除去
        removeNegativeEffects(player);
        return true;
    } catch (e) {
        console.warn("体力回復処理に失敗しました:", e);
        return false;
    }
}

/**
 * プレイヤーを無敵状態にします
 * @param {Player} player - 対象のプレイヤー
 * @returns {boolean} 処理が成功したかどうか
 */
export function invincible(player) {
    try {
        // 体力を最大値まで回復
        const health = player.getComponent("minecraft:health");
        if (health) {
            health.setCurrentValue(health.effectiveMax);
        }

        // 耐性効果を付与
        player.addEffect("minecraft:resistance", 2, { amplifier: 255, showParticles: false });
        player.addEffect("minecraft:fire_resistance", 2, { amplifier: 255, showParticles: false });
        
        // 負の効果を除去
        removeNegativeEffects(player);
        return true;
    } catch (e) {
        console.warn("無敵化処理に失敗しました:", e);
        return false;
    }
}

/**
 * プレイヤーから負の効果を除去します
 * @param {Player} player - 対象のプレイヤー
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

        for (const effect of negativeEffects) {
            if (player.getEffect(effect)) {
                player.removeEffect(effect);
            }
        }
        return true;
    } catch (e) {
        console.warn("負の効果の除去に失敗しました:", e);
        return false;
    }
}

