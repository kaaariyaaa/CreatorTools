export function blockCopy(player, block, slot) {
    try {
        const inventory = player.getComponent("minecraft:inventory");
        if (!inventory) throw new Error("インベントリが見つかりません");

        const container = inventory.container;
        container.setItem(slot, block.getItemStack(1, true));
        return true;
    } catch (error) {
        console.error("ブロックコピーに失敗しました:", error);
        return false;
    }
}