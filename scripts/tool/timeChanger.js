import { world, WeatherType } from "@minecraft/server";

// ゲーム内の時間を変更する関数
/**
 * @param {Player} player - 時間変更を実行する対象のプレイヤー
 */
export function timeChanger(player) {
    try {
        let time = world.getTimeOfDay();

        // 時間を昼または夜に変更
        if ((time >= 0 && time <= 12000) || (time >= 23961 && time <= 23999)) {
            time = 18000; // 夜
        } else if (time >= 12010 && time <= 23460) {
            time = 1000; // 昼
        }

        world.setTimeOfDay(time);
        player.onScreenDisplay.setActionBar(`時間を変更しました`);
        return true;
    } catch (error) {
        console.error("時間変更に失敗しました:", error);
        return false;
    }
}

// 天候を変更する関数
/**
 * @param {Player} player - 天候変更を実行する対象のプレイヤー
 */
export function weatherChanger(player) {
    try {
        const screenDisplay = player.onScreenDisplay;
        const currentWeather = world.getDynamicProperty("ct:weatherIndex") ?? 0;
        let nextWeather;

        // 天候を切り替え
        switch (currentWeather) {
            case 0: // 晴れ
                nextWeather = WeatherType.Rain;
                screenDisplay.setActionBar(`天気を雨に変更しました`);
                break;
            case 1: // 雨
                nextWeather = WeatherType.Clear;
                screenDisplay.setActionBar(`天気を晴れに変更しました`);
                break;
        }

        world.setDynamicProperty("ct:weatherIndex", (currentWeather + 1) % 2);
        player.dimension.setWeather(nextWeather, 24000);
        return true;
    } catch (error) {
        console.error("天気変更に失敗しました:", error);
        return false;
    }
}