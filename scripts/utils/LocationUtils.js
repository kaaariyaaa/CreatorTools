export class LocationUtils {
    /**
     * 角度をラジアンに変換します
     * @param {number} degrees - 角度（度）
     * @returns {number} ラジアン
     */
    static toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    /**
     * 方向ベクトルを計算します
     * @param {number} yaw - 水平方向の角度（度）
     * @param {number} pitch - 垂直方向の角度（度）
     * @returns {{ x: number, y: number, z: number }} 方向ベクトル（正規化済み）
     */
    static getDirectionVector(yaw, pitch) {
        // ラジアンに変換
        const yawRad = this.toRadians(yaw + 90);
        const pitchRad = this.toRadians(-pitch);

        // 三角関数で方向ベクトルを計算
        const cosPitch = Math.cos(pitchRad);
        const sinPitch = Math.sin(pitchRad);
        const cosYaw = Math.cos(yawRad);
        const sinYaw = Math.sin(yawRad);

        return {
            x: cosPitch * cosYaw,
            y: sinPitch,
            z: cosPitch * sinYaw
        };
    }

    /**
     * 位置と方向ベクトルから新しい位置を計算します
     * @param {Vector3} location - 開始位置
     * @param {{ x: number, y: number, z: number }} direction - 方向ベクトル
     * @param {number} distance - 距離
     * @returns {Vector3} 新しい位置
     */
    static moveInDirection(location, direction, distance) {
        return {
            x: location.x + direction.x * distance,
            y: location.y + direction.y * distance,
            z: location.z + direction.z * distance
        };
    }
}
