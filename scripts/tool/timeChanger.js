import { world, WeatherType } from "@minecraft/server";

export function timeChanger(player) {
    try {
        let time = world.getTimeOfDay();

        if ((time >= 0 && time <= 12000) || (time >= 23961 && time <= 23999)) {
            time = 18000;
        } else if (time >= 12010 && time <= 23460) {
            time = 1000;
        }

        world.setTimeOfDay(time);
        player.onScreenDisplay.setActionBar(`時間を変更しました`);
        return true;
    } catch (error) {
        console.error("時間変更に失敗しました:", error);
        return false;
    }
}

export function weatherChanger(player) {
    try {
        const screenDisplay = player.onScreenDisplay;
        const currentWeather = world.getDynamicProperty("ct:weatherIndex") ?? 0;
        let nextWeather;

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