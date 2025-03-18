// プレイヤーのインベントリにブロックをコピーする関数
/**
 * @param {Player} player - ブロックをコピーする対象のプレイヤー
 * @param {Block} block - コピーするブロック
 * @param {number} slot - コピー先のインベントリスロット番号
 * @returns {boolean} 処理が成功したかどうか
 */
export function blockCopy(player, block, slot) {
    try {
        // プレイヤーのインベントリを取得
        const inventory = player.getComponent("minecraft:inventory");
        if (!inventory) throw new Error("インベントリが見つかりません");

        // 指定されたスロットにブロックをコピー
        const container = inventory.container;
        container.setItem(slot, block.getItemStack(1, true));
        return true;
    } catch (error) {
        console.error("ブロックコピーに失敗しました:", error);
        return false;
    }
}