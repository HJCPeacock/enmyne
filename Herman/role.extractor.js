var roleExtractor = {
    run: function (creep) {
        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }

        var terminal = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TERMINAL;
            }
        });

        if (creep.memory.harvesting) {
            var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 3);
            if (targets.length > 0) {
                if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                if (terminal.store[RESOURCE_ENERGY] > 10000)
                {
                    var extractor = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_EXTRACTOR;
                        }
                    });
                    if (creep.harvest(extractor) == ERR_NOT_IN_RANGE) creep.moveTo(extractor);
                } else {
                    var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] >= creep.carryCapacity;
                        }
                    });
                    if (source) {
                        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(source);
                    }
                }
            }
        }
        else {
            if (terminal)
            {
                if (creep.carry[RESOURCE_ENERGY] > 0)
                {
                    if (creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal);
                    }
                }
                else if (creep.carry[RESOURCE_CATALYST])
                {
                    if (creep.transfer(terminal, RESOURCE_CATALYST) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal);
                    }
                }
            }
        }
    }
};

module.exports = roleExtractor;