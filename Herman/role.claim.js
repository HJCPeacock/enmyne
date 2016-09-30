var rolePath = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.name != 'E51N3') {
            var exitDir = Game.map.findExit(creep.room.name, 'E51N3');
            var Exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(Exit);
        }
        else {
            var targetlink = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
            if (targetlink) {
                if (creep.dismantle(targetlink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetlink);
                }
            }
            else {
                if (creep.memory.upgrading && creep.carry.energy == 0) {
                    creep.memory.upgrading = false;
                }

                if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                    creep.memory.upgrading = true;
                }

                if (!creep.memory.upgrading) {
                    var sourceStorage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_STORAGE;
                        }
                    });
                    if (sourceStorage) {
                        if (creep.withdraw(sourceStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sourceStorage);
                        }
                    } else {
                        var sources = creep.room.find(FIND_SOURCES);
                        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0]);
                        }
                    }
                }
                else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }

        }
    }
};

module.exports = rolePath;