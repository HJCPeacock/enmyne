var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleClaim = require('role.claim');
var roleAttack = require('role.attack');

var roleExplorer = {
    run: function (creep) {
        if (creep.room.name != 'E52N1') {
            var exitDir = Game.map.findExit(creep.room.name, 'E52N1');
            var Exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(Exit);
        }
        else {
            if (creep.memory.dismantel != undefined) {
                var targetlink = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER;
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
        }
    }
};

module.exports = roleExplorer;