import { RaycastUtils } from '../utils/RaycastUtils';
import { ParticleEffect } from '../effects/ParticleEffect';

/**
 * 指定された位置にブロックを設置します
 * @param {Player} player - プレイヤー
 * @param {string} [blockId="minecraft:glass"] - 設置するブロックのID
 * @param {number} distance - 視点からの距離
 * @returns {boolean} ブロックの設置に成功したかどうか
 */
export function airPlace(player, blockId = "minecraft:glass", distance) {
    const { targetPos, blockPos } = RaycastUtils.calculateTargetAndBlockPos(player, distance);

    // blockIdが未定義または無効な場合はglassを使用
    const finalBlockId = (!blockId || typeof blockId !== 'string') ? "minecraft:glass" : blockId;

    if(player.dimension.getBlock(blockPos).typeId === "minecraft:air") {
        try {
            player.dimension.setBlockType(blockPos, finalBlockId);

            return true;
        } catch (error) {
            // ブロックの設置に失敗した場合はglassを使用
            try {
                player.dimension.setBlockType(blockPos, "minecraft:glass");
                return true;
            } catch {
                return false;
            }
        }
    }
    return false;
}

/**
 * 指定された位置にパーティクルを表示します
 * @param {Player} player - プレイヤー
 * @param {number} distance - 視点からの距離
 * @returns {boolean} パーティクルの表示に成功したかどうか
 */
export function airBlockOverlay(player, distance) {
    const { targetPos, blockPos } = RaycastUtils.calculateTargetAndBlockPos(player, distance);

    try {
        // パーティクルエフェクトを初期化して使用
        const effect = new ParticleEffect(player.dimension);
        effect.drawBlockOutline(
            { x: blockPos.x + -0.01, y: blockPos.y + -0.01, z: blockPos.z + -0.01 },                      // 開始座標
            { x: blockPos.x + 1, y: blockPos.y + 1, z: blockPos.z + 1 }, // 終了座標
            {
                particleType: "minecraft:balloon_gas_particle",
                color: { red: 0, green: 0, blue: 1 },  // 青色
                edgeParticleCount: 3,    // 辺のパーティクル数
                faceParticleCount: 1,    // 面の分割数
                showFaces: true,         // 面にもパーティクルを表示
                speed: 0.1,              // パーティクルの速度
                direction: { x: 0, y: 0.5, z: 0 }  // 上向きの動き
            }
        );
        return true;
    } catch (error) {
        return false;
    }
}
