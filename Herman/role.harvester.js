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
	        var targetlinks = creep.pos.findInRange(FIND_STRUCTURES, 3, {
	            filter: (structure) => {
	                return structure.structureType == STRUCTURE_LINK || structure.structureType == STRUCTURE_CONTAINER;
	            }
	        });

	        if (targetlinks.length > 0) {
	            if (targetlinks[0].hits < targetlinks[0].hitsMax) {
	                if (creep.repair(targetlinks[0]) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(targetlinks[0]);
	                }
	            }
	            else if (creep.transfer(targetlinks[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(targetlinks[0]);
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
	            } else {
	                if (creep.room.storage != undefined) {
	                    if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.storage);
	                }
	            }
	        }
        }
	}
};

module.exports = roleHarvester;