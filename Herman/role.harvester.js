var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
	    }
	    if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.harvesting = false;
	    }
        
	    if (creep.memory.harvesting) {
	        var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 3, { filter: (x) => x.resourceType == RESOURCE_ENERGY });
	        if (targets.length > 0) {
	            if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(targets[0]);
	            }
	        }
	        else {
	            var sources = creep.room.find(FIND_SOURCES);
	            if (creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) creep.moveTo(sources[creep.memory.source]);
	        }
        }
        else {
	        var targetlink = creep.pos.findInRange(FIND_STRUCTURES, 6, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_LINK || structure.structureType == STRUCTURE_CONTAINER;
                    }
            });
	        if (targetlink) {
	            if (targetlink.hits < targetlink.hitsMax) {
	                if (creep.repair(targetlink) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(targetlink);
	                }
	            }
                else if(creep.transfer(targetlink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetlink);
                }
            }
            else {
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
            }
        }
	}
};

module.exports = roleHarvester;