import { Player } from '@minecraft/server';

/**
 * プレイヤーのレベルを最大値に設定します
 * @param {Player} player - 対象のプレイヤー
 * @returns {boolean} 処理が成功したかどうか
 */
export function addLevel(player) {
    try {
        player.resetLevel();
        player.addLevels(99999);
        return true;
    } catch (e) {
        console.warn("レベル追加処理に失敗しました:", e);
        return false;
    }
}

/**
 * プレイヤーのレベルをリセットします
 * @param {Player} player - 対象のプレイヤー
 * @returns {boolean} 処理が成功したかどうか
 */
export function removeLevel(player) {
    try {
        player.resetLevel();
        return true;
    } catch (e) {
        console.warn("レベルリセット処理に失敗しました:", e);
        return false;
    }
}




