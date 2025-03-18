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
    const { blockPos } = RaycastUtils.calculateTargetAndBlockPos(player, distance);
    const finalBlockId = blockId && typeof blockId === 'string' ? blockId : "minecraft:glass";

    try {
        if (player.dimension.getBlock(blockPos).typeId === "minecraft:air") {
            player.dimension.setBlockType(blockPos, finalBlockId);
            return true;
        }
    } catch (error) {
        console.warn("ブロック設置に失敗しました:", error);
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
    const { blockPos } = RaycastUtils.calculateTargetAndBlockPos(player, distance);

    try {
        const effect = new ParticleEffect(player.dimension);
        effect.drawBlockOutline(
            { x: blockPos.x - 0.01, y: blockPos.y - 0.01, z: blockPos.z - 0.01 },
            { x: blockPos.x + 1, y: blockPos.y + 1, z: blockPos.z + 1 },
            {
                particleType: "minecraft:balloon_gas_particle",
                edgeParticleCount: 3,
                faceParticleCount: 1,
                showFaces: true,
                speed: 0.1,
                direction: { x: 0, y: 0.5, z: 0 }
            }
        );
        return true;
    } catch (error) {
        console.warn("パーティクル表示に失敗しました:", error);
        return false;
    }
}
