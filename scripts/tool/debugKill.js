import { ParticleEffect } from '../effects/ParticleEffect';

// 指定されたエンティティをすべて削除
function killEntities(entities) {
    for (const entity of entities) {
        entity.kill();
    }
}

// プレイヤー周囲のエンティティを削除
export function debugKill(player) {
    try {
        const entities = player.dimension.getEntities().filter(entity => {
            const distance = Math.sqrt(
                Math.pow(entity.location.x - player.location.x, 2) +
                Math.pow(entity.location.y - player.location.y, 2) +
                Math.pow(entity.location.z - player.location.z, 2)
            );
            return distance <= 4;
        });

        killEntities(entities);
        return true;
    } catch (error) {
        player.sendMessage("エラーが発生しました");
        return false;
    }
}

// 視点の先のエンティティを削除
export function debugKillSelect(player) {
    try {
        const entities = player.getEntitiesFromViewDirection({
            maxDistance: 4,
            includeLiquidBlocks: false,
            includePassableBlocks: false
        }).map(data => data.entity);

        killEntities(entities);
        return true;
    } catch (error) {
        player.sendMessage("エラーが発生しました");
        return false;
    }
}

// プレイヤー周囲にパーティクルを表示
export function debugKillOverlay(player) {
    const effect = new ParticleEffect(player.dimension);
    effect.drawCircle(player.location, {
        radius: 4,
        particleCount: 25,
        particleType: "minecraft:balloon_gas_particle",
        color: { red: 1, green: 0, blue: 0 }
    });
}

// 視点の先のエンティティにパーティクルを表示
export function debugKillSelectOverlay(player) {
    const entities = player.getEntitiesFromViewDirection({
        maxDistance: 4,
        includeLiquidBlocks: false,
        includePassableBlocks: false
    });

    for (const entityData of entities) {
        const effect = new ParticleEffect(player.dimension);
        player.dimension.spawnParticle("minecraft:basic_flame_particle", entityData.entity.getHeadLocation());
    }
}