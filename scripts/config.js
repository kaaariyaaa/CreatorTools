import { blockCopy } from "./tool/blockCopy";
import { clickTP } from "./tool/clickTP";
import { killEnemy } from "./tool/killEnemy";

// 各ツールの設定を定義するオブジェクト
export default {
    tools: {
        protectPlayer: { itemId: "ct:protect_player" }, // 全回復 / 無敵
        setLevel: { itemId: "ct:set_level" }, // 経験値取得 / リセット
        airBlock: { itemId: "ct:air_block" }, // 空中ブロック設置
        clickTP: { itemId: "ct:click_tp" }, // 視点の先にテレポート
        killEnemy: { itemId: "ct:kill_enemy" }, // 敵をkill
        debugKill: { itemId: "ct:debug_kill" }, // Entityをkill
        gmChanger: { itemId: "ct:gm_changer" }, // ゲームモード変更 / ナイトビジョン
        timeChanger: { itemId: "ct:time_changer" }, // 時間 / 天候変更
        blockCopy: { itemId: "ct:block_copy" } // ブロックコピー
    }
};
