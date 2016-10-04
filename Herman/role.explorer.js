var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

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