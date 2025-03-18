import { world, system, EquipmentSlot, MolangVariableMap } from '@minecraft/server';
import { fullhealth, invincible } from '../tool/protectPlayer';
import { addLevel, removeLevel } from '../tool/setLevel';
import { airPlace, airBlockOverlay } from '../tool/airBlock';
import { clickTP, clickPierce } from '../tool/clickTP';
import { killEnemy } from '../tool/killEnemy';
import { debugKill, debugKillOverlay, debugKillSelect, debugKillSelectOverlay } from '../tool/debugKill';
import { timeChanger, weatherChanger } from '../tool/timeChanger';
import { gamemodeChanger } from '../tool/gmChanger';
import { PlayerState } from '../states/PlayerState';
import { blockCopy } from '../tool/blockCopy';
import config from '../config.js';

function handleItemUse(player, itemId, offItemId, playerState) {
    if (config.tools.protectPlayer.itemId === itemId) {
        if (!player.isSneaking) {
            if (fullhealth(player)) player.playSound("random.pop", { volume: 1.0, pitch: 1.0 });
        } else {
            playerState.toggleInvincible();
            player.playSound("random.click", { volume: 1.0, pitch: 1.0 });
        }
    } else if (config.tools.setLevel.itemId === itemId) {
        if (!player.isSneaking) {
            if (addLevel(player)) player.playSound("random.levelup", { volume: 1.0, pitch: 1.0 });
        } else {
            if (removeLevel(player)) player.playSound("random.fizz", { volume: 1.0, pitch: 1.0 });
        }
    } else if (config.tools.airBlock.itemId === itemId || config.tools.airBlock.itemId === offItemId) {
        const distance = config.tools.airBlock.itemId === offItemId ? 5 : 3;
        if (airPlace(player, "minecraft:glass", distance)) player.playSound("random.pop", { volume: 1.0, pitch: 1.0 });
    } else if (config.tools.clickTP.itemId === itemId) {
        if (!player.isSneaking) {
            if (clickTP(player)) player.playSound("mob.endermen.portal", { volume: 1.0, pitch: 1.0 });
        } else {
            if (clickPierce(player)) player.playSound("mob.endermen.portal", { volume: 1.0, pitch: 1.0 });
        }
    } else if (config.tools.killEnemy.itemId === itemId) {
        if (killEnemy(player)) player.playSound("mob.armor_stand.break", { volume: 1.0, pitch: 1.0 });
    } else if (config.tools.debugKill.itemId === itemId) {
        if (!player.isSneaking) {
            if (debugKill(player)) player.playSound("fire.ignite", { volume: 1.0, pitch: 1.0 });
        } else {
            if (debugKillSelect(player)) player.playSound("fire.ignite", { volume: 1.0, pitch: 1.0 });
        }
    } else if (config.tools.gmChanger.itemId === itemId) {
        if (!player.isSneaking) {
            if (gamemodeChanger(player)) player.playSound("random.click", { volume: 1.0, pitch: 1.0 });
        } else {
            playerState.toggleNightVision();
            player.playSound("block.end_portal_frame.fill", { volume: 1.0, pitch: 1.0 });
        }
    } else if (config.tools.timeChanger.itemId === itemId) {
        if (!player.isSneaking) {
            if (timeChanger(player)) player.playSound("item.spyglass.use", { volume: 1.0, pitch: 1.0 });
        } else {
            if (weatherChanger(player)) player.playSound("item.spyglass.use", { volume: 1.0, pitch: 1.0 });
        }
    }
}

export function setupPlayerEvents() {
    world.beforeEvents.itemUse.subscribe((ev) => {
        const player = ev.source;
        const itemId = ev.itemStack.typeId;
        const offItemId = player.getComponent("minecraft:equippable").getEquipment(EquipmentSlot.Offhand)?.typeId;
        const playerState = PlayerState.getState(player);

        system.runTimeout(() => handleItemUse(player, itemId, offItemId, playerState), 1);
    });

    world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
        if (!ev.isFirstEvent) return;

        const player = ev.player;
        const block = ev.block;
        const itemId = player.getComponent("minecraft:inventory").container.getItem(player.selectedSlotIndex)?.typeId;

        if (itemId === config.tools.blockCopy.itemId) {
            system.runTimeout(() => {
                if (blockCopy(player, block, player.selectedSlotIndex)) {
                    player.playSound("random.pop", { volume: 1.0, pitch: 1.0 });
                }
            }, 1);
        }
    });

    system.runInterval(() => {
        const color = { red: 0, green: 0, blue: 1 };
        const molang = new MolangVariableMap();
        molang.setColorRGB("variable.color", color);

        for (const [_, state] of PlayerState.states) {
            if (state.isInvincible) {
                invincible(state.player);
                state.player.dimension.spawnParticle("minecraft:arrow_spell_emitter", state.player.location, molang);
            }
            if (state.isNightVision) {
                state.player.addEffect("minecraft:night_vision", 2000, { amplifier: 1, showParticles: false });
            } else {
                state.player.removeEffect("minecraft:night_vision");
            }

            const equippable = state.player.getComponent("minecraft:equippable");
            const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
            const offhand = equippable.getEquipment(EquipmentSlot.Offhand);

            if (mainhand?.typeId === config.tools.airBlock.itemId) {
                airBlockOverlay(state.player, 3);
            } else if (offhand?.typeId === config.tools.airBlock.itemId) {
                airBlockOverlay(state.player, 5);
            } else if (mainhand?.typeId === config.tools.debugKill.itemId) {
                debugKillOverlay(state.player);
                if (state.player.isSneaking) debugKillSelectOverlay(state.player);
            }
        }
    }, 1);
}