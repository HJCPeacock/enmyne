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
                        return ((structure.structureType == STRUCTURE_LINK && structure.energyCapacity) || (structure.structureType == STRUCTURE_CONTAINER && structure.storeCapacitynumber));
                    }
	        });

	        var hasLinks = creep.room.find(FIND_STRUCTURES, {
	            filter: (structure) => {
	                return structure.structureType == STRUCTURE_LINK;
	            }
	        }).length > 1;

	        if (targetlink.length > 0 && hasLinks) {
	            if (targetlink[0].hits < targetlink[0].hitsMax) {
	                if (creep.repair(targetlink[0]) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(targetlink[0]);
	                }
	            }
                else if(creep.transfer(targetlink[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetlink[0]);
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