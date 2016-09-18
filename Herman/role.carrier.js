var roleCarrier = {
    run: function (creep) {
        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting) {
            var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 3, { filter: (x) => x.resourceType == RESOURCE_ENERGY });
            if (targets.length > 0) {
                var res = creep.pickup(targets[0]);
                if (res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                } else if (res == OK) {
                    console.log('carrier found ' + targets[0].energy + ' energy');
                }
            }
            else {
                var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE;
                    }
                });
                if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(source);
            }
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity;
                }
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else creep.memory.harvesting = true;
        }
    }
};

module.exports = roleCarrier;