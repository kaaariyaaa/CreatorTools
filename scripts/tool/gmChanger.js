import { GameMode } from "@minecraft/server";

export function gamemodeChanger(player) {
    try {
        const gamemode = player.getGameMode();
        const screenDisplay = player.onScreenDisplay;

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
