import { LocationUtils } from './LocationUtils';

export class RaycastUtils {
    static calculateTargetPos(headLoc, direction, distance) {
        return {
            x: headLoc.x + direction.x * distance,
            y: headLoc.y + direction.y * distance,
            z: headLoc.z + direction.z * distance
        };
    }

    static calculateBlockPos(targetPos) {
        return {
            x: Math.floor(targetPos.x),
            y: Math.floor(targetPos.y),
            z: Math.floor(targetPos.z)
        };
    }

    /**
     * プレイヤーの視点から指定距離先のターゲット位置とブロック位置を計算します
     * @param {Player} player - プレイヤー
     * @param {number} distance - 視点からの距離
     * @returns {{ targetPos: { x: number, y: number, z: number }, blockPos: { x: number, y: number, z: number } }}
     */
    static calculateTargetAndBlockPos(player, distance) {
        const { x: pitch, y: yaw } = player.getRotation();
        const headLoc = player.getHeadLocation();
        const direction = LocationUtils.getDirectionVector(yaw, pitch);

        const targetPos = this.calculateTargetPos(headLoc, direction, distance);
        const blockPos = this.calculateBlockPos(targetPos);

        return { targetPos, blockPos };
    }

    /**
     * 視点の先のブロックの中で一番近いブロックの座標のxマス前の座標を取得します
     * @param {Player} player - プレイヤー
     * @param {number} maxDistance - 最大距離
     * @param {number} offset - ブロックの手前のオフセット
     * @returns {{ x: number, y: number, z: number }} - ブロックの座標
     */
    static getClosestBlockPosWithOffset(player, maxDistance, offset = 1) {
        const { x: pitch, y: yaw } = player.getRotation();
        const headLoc = player.getHeadLocation();
        const direction = LocationUtils.getDirectionVector(yaw, pitch);

        let previousPos = null;

        for (let i = 0; i <= maxDistance; i++) {
            const targetPos = this.calculateTargetPos(headLoc, direction, i);
            const blockPos = this.calculateBlockPos(targetPos);

            if (player.dimension.getBlock(blockPos).typeId !== "minecraft:air") {
                if (previousPos) {
                    return this.calculateTargetPos(previousPos, direction, -offset);
                }
                return null;
            }

            previousPos = blockPos;
        }

        return null;
    }
}