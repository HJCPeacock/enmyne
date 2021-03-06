var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleClaim = require('role.claim');
var roleAttack = require('role.attack');

var roleExplorer = {
    run: function (creep) {
        if (creep.room.name != creep.memory.room) {
            var exitDir = Game.map.findExit(creep.room.name, creep.memory.room);
            var Exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(Exit);
        }
        else {
            if (creep.memory.dismantel != undefined) {
                var targetlink = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_EXTENSION;
                    }
                });
                if (targetlink) {
                    if (creep.dismantle(targetlink) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetlink);
                    }
                }
            }
            else if (creep.memory.upgrading != undefined) {
                roleUpgrader.run(creep);
            }
            else if (creep.memory.building != undefined) {
                roleBuilder.run(creep);
            }
            else if (creep.memory.claim != undefined) {
                roleClaim.run(creep);
            }
            else if (creep.memory.attack != undefined) {
                roleAttack.run(creep);
            }
            else if (creep.memory.claimController != undefined) {
                if (creep.room.controller) {
                    if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    }
};

module.exports = roleExplorer;