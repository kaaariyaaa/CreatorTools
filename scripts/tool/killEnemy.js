import { system } from '@minecraft/server';

export function killEnemy(player) {
    try {
        const entities = player.dimension.getEntities().filter(entity => {
            const family = entity.getComponent("minecraft:type_family");
            return family && family.hasTypeFamily("monster");
        });

        for (const entity of entities) {
            entity.teleport({ x: 0, y: -100, z: 0 });
            entity.kill();
        }
        return true;
    } catch (error) {
        console.error("敵の処理に失敗しました:", error);
        return false;
    }
}