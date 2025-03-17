import { Direction } from '@minecraft/server';

export function clickTP(player) {
    try {
        const blockRaycastHit = player.getBlockFromViewDirection({includeLiquidBlocks: false, includePassableBlocks: false });
        const playerLoc = player.location;
        const hedloc = player.getHeadLocation();
        const blockPos = blockRaycastHit.block.location;
        const direction = blockRaycastHit.face;
        const hedHeight = hedloc.y - playerLoc.y;

        
        if (blockPos) {
            // テレポート位置を方向に基づいて調整
            let teleportPos = { x: blockPos.x + 0.5, y: blockPos.y, z: blockPos.z + 0.5 };
            switch (direction) {
                case Direction.Down:
                    teleportPos.y -= (hedHeight + 0.3);
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
            // プレイヤーを指定位置にテレポート
            player.teleport(teleportPos);
            return true;
        }
    } catch (error) {
        player.sendMessage("視点の先にブロックがないのでテレポートできません");
        return false;
    }
}

export function clickPierce(player) {
    try {
        const blockRaycastHit = player.getBlockFromViewDirection({includeLiquidBlocks: false, includePassableBlocks: false });
        const playerLoc = player.location;
        const hedloc = player.getHeadLocation();
        const blockPos = blockRaycastHit.block.location;
        const direction = blockRaycastHit.face;
        const hedHeight = hedloc.y - playerLoc.y;

        if (blockPos) {
            // テレポート位置を方向に基づいて調整
            let teleportPos = { x: blockPos.x + 0.5, y: blockPos.y, z: blockPos.z + 0.5 };
            let max = 0;
            for(let i = 0; i <= max; i++) {
                switch (direction) {
                    case Direction.Down:
                        teleportPos.y += (hedHeight + 0.3);
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
                if(player.dimension.getBlock(teleportPos).typeId !== "minecraft:air") {
                    max++;
                } 
                else if (player.dimension.getBlock(teleportPos).typeId === "minecraft:air") {
                    if(direction === Direction.Up) {
                        teleportPos.y -= 1;
                    }
                    player.teleport(teleportPos);
                    return true;
                }
            }
        }
    } catch (error) {     
        player.sendMessage("視点の先にブロックがないのでテレポートできません");
        return false;
    }
}   