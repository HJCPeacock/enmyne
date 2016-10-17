var roleMining = {
    run: function (creep) {
        if (creep.room.name != creep.memory.room) {
            var exitDir = Game.map.findExit(creep.room.name, creep.memory.room);
            var Exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(Exit);
        }
        else {

            if (creep.memory.mining && creep.carry.energy == 0) {
                creep.memory.mining = false;
            }
            if (!creep.memory.mining && creep.carry.energy == creep.carryCapacity) {
                creep.memory.mining = true;
            }

            if (!creep.memory.mining) {
                var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 3, { filter: (x) => x.resourceType == RESOURCE_ENERGY });
                if (targets.length > 0) {
                    if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
                else {
                    var sources = creep.room.find(FIND_SOURCES);
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) creep.moveTo(sources[0]);
                }
            }
            else {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER;
                    }
                });
                if (target.hits && target.hits < target.hitsMax) {
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if (target && target.store[RESOURCE_ENERGY] < target.storeCapacity) {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
        }
    }
};

module.exports = roleMining;