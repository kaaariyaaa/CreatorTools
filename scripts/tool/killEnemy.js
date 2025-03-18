import { system } from '@minecraft/server';

/**
 * プレイヤー周囲の敵モブを削除します
 * @param {Player} player - 敵モブを削除する対象のプレイヤー
 * @returns {boolean} 処理が成功したかどうか
 */
export function killEnemy(player) {
    try {
        // プレイヤー周囲の敵モブを取得
        const entities = player.dimension.getEntities().filter(entity => {
            const family = entity.getComponent("minecraft:type_family");
            return family && family.hasTypeFamily("monster");
        });

        // 敵モブを削除
        for (const entity of entities) {
            entity.teleport({ x: 0, y: -100, z: 0 }); // 安全な場所に移動
            entity.kill();
        }
        return true;
    } catch (error) {
        console.error("敵の処理に失敗しました:", error);
        return false;
    }
}