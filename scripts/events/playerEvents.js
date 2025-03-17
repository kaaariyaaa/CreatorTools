import { world, system, EquipmentSlot, MolangVariableMap } from '@minecraft/server';
import { fullhealth, invincible } from '../tool/protectPlayer';
import { addLevel, removeLevel } from '../tool/setLevel';
import { airPlace, airBlockOverlay } from '../tool/airBlock';
import { clickTP, clickPierce } from '../tool/clickTP';
import { PlayerState } from '../states/PlayerState';
import config from '../config.js';

export function setupPlayerEvents() {
    world.beforeEvents.itemUse.subscribe((ev) => {
        const player = ev.source;
        //const location = player.location;
        //player.sendMessage(`x: ${location.x}, y: ${location.y}, z: ${location.z}`);
        const itemId = ev.itemStack.typeId;
        const offItemId = player.getComponent("minecraft:equippable").getEquipment(EquipmentSlot.Offhand)?.typeId;
        const playerState = PlayerState.getState(player);

        system.runTimeout(() => {
            if (config.protectPlayer.itemId === itemId && !player.isSneaking) {
                if (fullhealth(player)) {
                    player.playSound("random.pop", {
                        volume: 1.0,
                        pitch: 1.0
                    });
                }
            } 
            else if (config.protectPlayer.itemId === itemId && player.isSneaking) {
                playerState.toggleInvincible();
                player.playSound("random.click", {
                    volume: 1.0,
                    pitch: 1.0
                });
            } 
            else if (config.setLevel.itemId === itemId && !player.isSneaking) {
                if (addLevel(player)) {
                    player.playSound("random.levelup", {
                        volume: 1.0,
                        pitch: 1.0
                    });
                }
            }
            else if (config.setLevel.itemId === itemId && player.isSneaking) {
                if (removeLevel(player)) {
                    player.playSound("random.fizz", {
                        volume: 1.0,
                        pitch: 1.0
                    });
                }
            } 
            else if (config.airBlock.itemId === itemId) {
                if (airPlace(player, "minecraft:glass", 3)) {
                    player.playSound("random.pop", {
                        volume: 1.0,
                        pitch: 1.0
                    });
                }
            }
            else if (config.airBlock.itemId === offItemId) {
                if (airPlace(player, itemId, 5)) {
                    player.playSound("random.pop", {
                        volume: 1.0,
                        pitch: 1.0
                    });
                }
            }
            else if (config.clickTP.itemId === itemId && !player.isSneaking) {
                if (clickTP(player)) {
                    player.playSound("enderman.teleport", {
                        volume: 1.0,
                        pitch: 1.0
                    });
                }
            }
            else if (config.clickTP.itemId === itemId && player.isSneaking) {
                if (clickPierce(player)) {
                    player.playSound("enderman.teleport", {
                        volume: 1.0,
                        pitch: 1.0
                    });
                }
            }
        }, 1);
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
            const selectedSlotIndex = state.player.selectedSlotIndex;
            const equippable = state.player.getComponent("minecraft:equippable");
            const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
            const offhand = equippable.getEquipment(EquipmentSlot.Offhand);
            if(mainhand && mainhand.typeId === config.airBlock.itemId) {
                airBlockOverlay(state.player, 3);
            }
            else if(offhand && offhand.typeId === config.airBlock.itemId) {
                airBlockOverlay(state.player, 5);
            }
        }
    }, 1);
} 