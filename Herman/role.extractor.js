var roleExtractor = {
    run: function (creep) {
        if (!creep.memory.harvesting && (creep.carry.energy == 0 || creep.carry.X == 0)) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && (creep.carry.energy == creep.carryCapacity || creep.carry.X == creep.carryCapacity)) {
            creep.memory.harvesting = false;
        }

        var terminal = creep.room.terminal;

        if (creep.memory.harvesting) {
            var targets = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 3);
            if (targets.length > 0) {
                if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                if (terminal.store[RESOURCE_ENERGY] > 10000)
                {
                    var mineral = creep.pos.findClosestByRange(FIND_MINERALS);
                    if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) creep.moveTo(mineral);

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
                if (creep.carry.energy > 0)
                {
                    if (creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal);
                    }
                }
                else if (creep.carry.X > 0)
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