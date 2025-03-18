import { GameMode } from "@minecraft/server";

// プレイヤーのゲームモードを切り替える関数
/**
 * @param {Player} player - ゲームモードを切り替える対象のプレイヤー
 * @returns {boolean} 処理が成功したかどうか
 */
export function gamemodeChanger(player) {
    try {
        const gamemode = player.getGameMode();
        const screenDisplay = player.onScreenDisplay;

        // 現在のゲームモードに応じて切り替え
        switch (gamemode) {
            case GameMode.survival:
                player.setGameMode(GameMode.creative);
                screenDisplay.setActionBar(`ゲームモードをクリエイティブに変更しました`);
                break;
            case GameMode.creative:
                player.setGameMode(GameMode.survival);
                screenDisplay.setActionBar(`ゲームモードをサバイバルに変更しました`);
                break;
            case GameMode.adventure:
                player.setGameMode(GameMode.creative);
                screenDisplay.setActionBar(`ゲームモードをクリエイティブに変更しました`);
                break;
        }
        return true;
    } catch (error) {
        player.sendMessage("エラーが発生しました");
        return false;
    }
}
