import { MolangVariableMap } from '@minecraft/server';
import { LocationUtils } from '../utils/LocationUtils';

// パーティクルエフェクトを管理するクラス
export class ParticleEffect {
    /**
     * パーティクルエフェクトを初期化します
     * @param {Dimension} dimension - パーティクルを表示するディメンション
     */
    constructor(dimension) {
        this.dimension = dimension;
    }

    /**
     * プレイヤーの視線方向の座標を計算します
     * @param {Vector3} position - 開始位置
     * @param {number} yaw - 水平角度（度）
     * @param {number} pitch - 垂直角度（度）
     * @param {number} distance - 距離
     * @returns {Vector3} 計算された座標
     */
    static calculateTargetPosition(position, yaw, pitch, distance = 5) {
        return LocationUtils.calculateTargetPosition(position, yaw, pitch, distance);
    }

    /**
     * Molang変数マップを作成します
     * @param {Object} color - パーティクルの色 (RGB)
     * @param {number} speed - パーティクルの速度
     * @param {Vector3} direction - パーティクルの方向
     * @returns {MolangVariableMap} Molang変数マップ
     */
    createMolang(color, speed, direction) {
        const molang = new MolangVariableMap();
        molang.setColorRGB("variable.color", color);
        if (speed !== 0) {
            molang.setSpeedAndDirection("variable.speed", speed, direction);
        }
        return molang;
    }

    /**
     * 2点間にパーティクルの線を描画します
     * @param {Vector3} start - 開始座標
     * @param {Vector3} end - 終了座標
     * @param {Object} options - オプション
     */
    drawLine(start, end, options = {}) {
        const {
            particleCount = 50,
            particleType = "minecraft:dust",
            color = { red: 1, green: 1, blue: 1 },
            speed = 0,
            direction = { x: 0, y: 0, z: 0 }
        } = options;

        const molang = this.createMolang(color, speed, direction);

        for (let i = 0; i <= particleCount; i++) {
            const t = i / particleCount;
            const x = start.x + (end.x - start.x) * t;
            const y = start.y + (end.y - start.y) * t;
            const z = start.z + (end.z - start.z) * t;

            this.dimension.spawnParticle(
                particleType,
                { x, y, z },
                molang
            );
        }
    }

    /**
     * 座標を円で囲むパーティクルを表示します
     * @param {Vector3} position - 中心座標
     * @param {Object} options - オプション
     */
    drawCircle(position, options = {}) {
        const {
            radius = 1.5,
            particleCount = 32,
            height = 0.1,
            particleType = "minecraft:dust",
            color = { red: 1, green: 1, blue: 1 },
            speed = 0,
            direction = { x: 0, y: 0, z: 0 }
        } = options;

        const molang = this.createMolang(color, speed, direction);

        for (let i = 0; i < particleCount; i++) {
            const angle = (2 * Math.PI * i) / particleCount;
            const particleX = position.x + radius * Math.cos(angle);
            const particleZ = position.z + radius * Math.sin(angle);

            this.dimension.spawnParticle(
                particleType,
                { x: particleX, y: position.y + height, z: particleZ },
                molang
            );
        }
    }

    /**
     * 座標に単一のパーティクルを表示します
     * @param {Vector3} position - 座標
     * @param {Object} options - オプション
     * @param {string} options.particleType - パーティクルの種類
     * @param {Object} options.color - パーティクルの色 (RGB)
     * @param {number} options.height - 地面からの高さ
     * @param {number} options.speed - パーティクルの速度
     * @param {Vector3} options.direction - パーティクルの方向
     */
    spawnParticle(position, options = {}) {
        const {
            particleType = "minecraft:dust",
            color = { red: 1, green: 1, blue: 1 },
            height = 0.1,
            speed = 0,
            direction = { x: 0, y: 0, z: 0 }
        } = options;

        const molang = this.createMolang(color, speed, direction);

        this.dimension.spawnParticle(
            particleType,
            { x: position.x, y: position.y + height, z: position.z },
            molang
        );
    }

    /**
     * ブロックの範囲を輪郭をパーティクルで表示します
     * @param {Vector3} start - 開始座標
     * @param {Vector3} end - 終了座標
     * @param {Object} options - オプション
     * @param {string} options.particleType - パーティクルの種類
     * @param {Object} options.color - パーティクルの色 (RGB)
     * @param {number} options.edgeParticleCount - 1辺あたりのパーティクル数
     * @param {number} options.faceParticleCount - 1面あたりの1辺のパーティクル数（面の分割数）
     * @param {boolean} options.showFaces - 面にもパーティクルを表示するかどうか
     * @param {number} options.speed - パーティクルの速度
     * @param {Vector3} options.direction - パーティクルの方向
     */
    drawBlockOutline(start, end, options = {}) {
        const {
            particleType = "minecraft:dust",
            color = { red: 0, green: 0, blue: 0 },
            edgeParticleCount = 10,
            faceParticleCount = 5,
            showFaces = false,
            speed = 0,
            direction = { x: 0, y: 0, z: 0 }
        } = options;

        // 座標を正規化（startが小さい値、endが大きい値になるように）
        const minX = Math.min(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const minZ = Math.min(start.z, end.z);
        const maxX = Math.max(start.x, end.x);
        const maxY = Math.max(start.y, end.y);
        const maxZ = Math.max(start.z, end.z);

        // ブロックの各頂点の座標を計算
        const vertices = [
            { x: minX, y: minY, z: minZ }, // 0: 手前下左
            { x: maxX, y: minY, z: minZ }, // 1: 手前下右
            { x: maxX, y: minY, z: maxZ }, // 2: 奥下右
            { x: minX, y: minY, z: maxZ }, // 3: 奥下左
            { x: minX, y: maxY, z: minZ }, // 4: 手前上左
            { x: maxX, y: maxY, z: minZ }, // 5: 手前上右
            { x: maxX, y: maxY, z: maxZ }, // 6: 奥上右
            { x: minX, y: maxY, z: maxZ }  // 7: 奥上左
        ];

        // 辺のパーティクルを描画
        const drawEdge = (v1, v2) => {
            this.drawLine(v1, v2, { particleCount: edgeParticleCount, particleType, color, speed, direction });
        };

        // 面のパーティクルを描画
        const drawFace = (v1, v2, v3, v4) => {
            if (!showFaces) return;

            const molang = this.createMolang(color, speed, direction);

            for (let i = 0; i <= faceParticleCount; i++) {
                for (let j = 0; j <= faceParticleCount; j++) {
                    const t1 = i / faceParticleCount;
                    const t2 = j / faceParticleCount;

                    // 面上の点を補間で計算
                    const x1 = v1.x + (v2.x - v1.x) * t1;
                    const y1 = v1.y + (v2.y - v1.y) * t1;
                    const z1 = v1.z + (v2.z - v1.z) * t1;

                    const x2 = v4.x + (v3.x - v4.x) * t1;
                    const y2 = v4.y + (v3.y - v4.y) * t1;
                    const z2 = v4.z + (v3.z - v4.z) * t1;

                    const x = x1 + (x2 - x1) * t2;
                    const y = y1 + (y2 - y1) * t2;
                    const z = z1 + (z2 - z1) * t2;

                    this.dimension.spawnParticle(
                        particleType,
                        { x, y, z },
                        molang
                    );
                }
            }
        };

        // 下面の辺
        drawEdge(vertices[0], vertices[1]);
        drawEdge(vertices[1], vertices[2]);
        drawEdge(vertices[2], vertices[3]);
        drawEdge(vertices[3], vertices[0]);

        // 上面の辺
        drawEdge(vertices[4], vertices[5]);
        drawEdge(vertices[5], vertices[6]);
        drawEdge(vertices[6], vertices[7]);
        drawEdge(vertices[7], vertices[4]);

        // 垂直の辺
        drawEdge(vertices[0], vertices[4]);
        drawEdge(vertices[1], vertices[5]);
        drawEdge(vertices[2], vertices[6]);
        drawEdge(vertices[3], vertices[7]);

        // 面のパーティクル
        drawFace(vertices[0], vertices[1], vertices[2], vertices[3]); // 下面
        drawFace(vertices[4], vertices[5], vertices[6], vertices[7]); // 上面
        drawFace(vertices[0], vertices[1], vertices[5], vertices[4]); // 前面
        drawFace(vertices[2], vertices[3], vertices[7], vertices[6]); // 後面
        drawFace(vertices[0], vertices[3], vertices[7], vertices[4]); // 左面
        drawFace(vertices[1], vertices[2], vertices[6], vertices[5]); // 右面
    }
}