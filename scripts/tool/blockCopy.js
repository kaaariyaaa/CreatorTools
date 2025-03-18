export function blockCopy(player, block) {
    try {
        const inventory = player.getComponent("minecraft:inventory");
        if (!inventory) throw new Error("インベントリが見つかりません");

        const container = inventory.container;
        container.addItem(block.getItemStack(1, true));
        return true;
    } catch (error) {
        console.warn("ブロックコピーに失敗しました:", error);
        player.sendMessage(`エラーが発生しました: ${error}`);
        return false;
    }
}