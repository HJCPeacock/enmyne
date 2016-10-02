var roleRepairer = require('role.repairer');

var roleBuilder = {
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	        var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                roleRepairer.run(creep);
            }
	    }
	    else {
	        var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 3, { filter: (x) => x.resourceType == RESOURCE_ENERGY });
	        if (targets.length > 0) {
	            if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(targets[0]);
	            }
	        }
            else {
	            var sourceStorage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	                filter: (structure) => {
	                    return structure.structureType == STRUCTURE_STORAGE;
	                }
	            });
	            if (sourceStorage && sourceStorage.store[RESOURCE_ENERGY] > 2000) {
	                if (creep.withdraw(sourceStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(sourceStorage);
	                }
	            }
	            else {
	                var source = creep.pos.findClosestByRange(FIND_SOURCES);
	                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(source);
	                }
	            }
	        }
	    }
	}
};

module.exports = roleBuilder;