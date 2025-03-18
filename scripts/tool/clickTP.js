import { Direction } from '@minecraft/server';

export function clickTP(player) {
    try {
        const blockRaycastHit = player.getBlockFromViewDirection({ includeLiquidBlocks: false, includePassableBlocks: false });
        const blockPos = blockRaycastHit.block.location;
        const direction = blockRaycastHit.face;

        if (blockPos) {
            let teleportPos = { x: blockPos.x + 0.5, y: blockPos.y, z: blockPos.z + 0.5 };
            switch (direction) {
                case Direction.Down:
                    teleportPos.y -= 1.83;
                    break;
                case Direction.East:
                    teleportPos.x += 1;
                    break;
                case Direction.North:
                    teleportPos.z -= 1;
                    break;
                case Direction.South:
                    teleportPos.z += 1;
                    break;
                case Direction.Up:
                    teleportPos.y += 1;
                    break;
                case Direction.West:
                    teleportPos.x -= 1;
                    break;
            }
            player.teleport(teleportPos);
            player.onScreenDisplay.setActionBar("テレポートしました");
            return true;
        }
    } catch (error) {
        console.error("テレポートに失敗しました:", error);
        return false;
    }
}

export function clickPierce(player) {
    try {
        const blockRaycastHit = player.getBlockFromViewDirection({ includeLiquidBlocks: false, includePassableBlocks: false });
        const blockPos = blockRaycastHit.block.location;
        const direction = blockRaycastHit.face;

        if (blockPos) {
            let teleportPos = { x: blockPos.x + 0.5, y: blockPos.y, z: blockPos.z + 0.5 };
            let max = 0;
            for (let i = 0; i <= max; i++) {
                switch (direction) {
                    case Direction.Down:
                        teleportPos.y += 1.83;
                        break;
                    case Direction.East:
                        teleportPos.x -= 1;
                        break;
                    case Direction.North:
                        teleportPos.z += 1;
                        break;
                    case Direction.South:
                        teleportPos.z -= 1;
                        break;
                    case Direction.Up:
                        teleportPos.y -= 1;
                        break;
                    case Direction.West:
                        teleportPos.x += 1;
                        break;
                }
                if (player.dimension.getBlock(teleportPos).typeId !== "minecraft:air") {
                    max++;
                } else if (player.dimension.getBlock(teleportPos).typeId === "minecraft:air") {
                    if (direction === Direction.Up) teleportPos.y -= 1;
                    player.teleport(teleportPos);
                    player.onScreenDisplay.setActionBar("テレポートしました");
                    return true;
                }
            }
        }
    } catch (error) {
        console.error("貫通テレポートに失敗しました:", error);
        return false;
    }
}