import { LocationUtils } from './LocationUtils';

export class RaycastUtils {
    /**
     * 視点の向きから指定距離先の座標を計算します（高精度）
     * @param {Vector3} location - 開始位置
     * @param {number} yaw - 水平方向の角度（度）
     * @param {number} pitch - 垂直方向の角度（度）
     * @param {number} maxDistance - 最大距離（マス）
     * @param {number} stepSize - ステップサイズ（小さいほど精度が上がる）
     * @param {Dimension} dimension - ディメンション
     * @param {string[]} [targetBlocks] - 対象のブロックタイプID（指定がない場合は空気ブロックを探す）
     * @returns {Vector3 | null} 見つかった座標、または null
     */
    static raycast(location, yaw, pitch, maxDistance, stepSize, dimension, targetBlocks = ["minecraft:air"]) {
        const direction = LocationUtils.getDirectionVector(yaw, pitch);
        let currentPos = { ...location };
        let distance = 0;

        while (distance <= maxDistance) {
            const blockPos = {
                x: Math.floor(currentPos.x),
                y: Math.floor(currentPos.y),
                z: Math.floor(currentPos.z)
            };

            const block = dimension.getBlock(blockPos);
            if (block && targetBlocks.includes(block.typeId)) {
                return blockPos;
            }

            // 次のステップに進む
            currentPos.x += direction.x * stepSize;
            currentPos.y += direction.y * stepSize;
            currentPos.z += direction.z * stepSize;
            distance += stepSize;
        }

        return null;
    }

    /**
     * プレイヤーの視点から対象ブロックを探します（高精度）
     * @param {Player} player - プレイヤー
     * @param {number} maxDistance - 最大距離（マス）
     * @param {number} stepSize - ステップサイズ（小さいほど精度が上がる）
     * @param {string[]} [targetBlocks] - 対象のブロックタイプID（指定がない場合は空気ブロックを探す）
     * @returns {Vector3 | null} 見つかった座標、または null
     */
    static raycastFromPlayer(player, maxDistance, stepSize = 0.1, targetBlocks = ["minecraft:air"]) {
        const rotation = player.getRotation();
        return this.raycast(
            player.getHeadLocation(),
            rotation.y,  // yaw
            rotation.x,  // pitch
            maxDistance,
            stepSize,
            player.dimension,
            targetBlocks
        );
    }

    /**
     * 視点の向きから指定距離先の座標を計算します
     * @param {Vector3} location - 開始位置
     * @param {number} yaw - 水平方向の角度（度）
     * @param {number} pitch - 垂直方向の角度（度）
     * @param {number} distance - 視点からの距離（マス）
     * @returns {Vector3} 計算された座標
     */
    static getTargetPosition(location, yaw, pitch, distance) {
        const direction = LocationUtils.getDirectionVector(yaw, pitch);
        return LocationUtils.moveInDirection(location, direction, distance);
    }

    /**
     * プレイヤーの視点から指定距離先の座標を計算します
     * @param {Player} player - プレイヤー
     * @param {number} distance - 視点からの距離（マス）
     * @returns {Vector3} 計算された座標
     */
    static getPlayerTargetPosition(player, distance) {
        const rotation = player.getRotation();
        return this.getTargetPosition(
            player.location,
            rotation.y,  // yaw
            rotation.x,  // pitch
            distance
        );
    }
}