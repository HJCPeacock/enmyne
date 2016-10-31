var roleMover = {
    run: function (creep) {
        if (!creep.memory.inHouse) {
            if (creep.carry.energy == 0) {
                if (creep.room.name != creep.memory.room) {
                    var exitDir = Game.map.findExit(creep.room.name, creep.memory.room);
                    var Exit = creep.pos.findClosestByRange(exitDir);
                    creep.moveTo(Exit);
                } else {
                    var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= creep.carryCapacity;
                        }
                    });
                    if (source) {
                        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source);
                        }
                    } else {
                        creep.moveTo(Game.flags[creep.memory.flag]);
                    }
                }
            }
            if (creep.carry.energy > 0) {
                if (creep.room.name != creep.memory.sourceroom) {
                    var exitDir = Game.map.findExit(creep.room.name, creep.memory.sourceroom);
                    var Exit = creep.pos.findClosestByRange(exitDir);

                    var building = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                    var repairUnits = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax;
                        }
                    });

                    if (building) {
                        if (creep.build(building) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(building);
                        }
                    }
                    else if (repairUnits.length > 0) {
                        if (creep.repair(repairUnits[0]) == ERR_NOT_IN_RANGE);
                        creep.moveTo(Exit);
                    }
                    else creep.moveTo(Exit);
                } else {
                    var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_STORAGE;
                        }
                    });
                    if (storage) {
                        if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    }
                }
            }
        } else {
            if (creep.carry.energy == 0)
            {
                var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 3, { filter: (x) => x.resourceType == RESOURCE_ENERGY });
                if (targets.length > 0) {
                    if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                } else {
                    var sources = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= creep.carryCapacity;
                        }
                    });
                    if (sources.length > 0) {
                        if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0]);
                        }
                    } else {
                        var energySources = creep.room.find(FIND_SOURCES);
                        creep.moveTo(energySources[creep.memory.source]);
                    }
                }
            }
            else if (creep.carry.energy > 0)
            {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_STORAGE;
                        }
                    });
                    if (storage) {
                        if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleMover;