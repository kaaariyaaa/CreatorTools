import { blockCopy } from "./tool/blockCopy";
import { clickTP } from "./tool/clickTP";
import { killEnemy } from "./tool/killEnemy";

export default {
    tools: {
        protectPlayer: { itemId: "ct:protect_player" },
        setLevel: { itemId: "ct:set_level" },
        airBlock: { itemId: "ct:air_block" },
        clickTP: { itemId: "ct:click_tp" },
        killEnemy: { itemId: "ct:kill_enemy" },
        debugKill: { itemId: "ct:debug_kill" },
        gmChanger: { itemId: "ct:gm_changer" },
        timeChanger: { itemId: "ct:time_changer" },
        blockCopy: { itemId: "ct:block_copy" }
    }
};
