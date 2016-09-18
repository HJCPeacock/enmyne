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
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                roleRepairer.run(creep);
            }
	    }
	    else {
	        var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 3, { filter: (x) => x.resourceType == RESOURCE_ENERGY });
	        if (targets.length > 0) {
	            var res = creep.pickup(targets[0]);
	            if (res == ERR_NOT_IN_RANGE) {
	                creep.moveTo(targets[0]);
	            } else if (res == OK)
	            {
	                console.log('found ' + targets[0].energy + 'energy');
	            }
	        }
            else {
	            var sourceStorage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	                filter: (structure) => {
	                    return structure.structureType == STRUCTURE_STORAGE;
	                }
	            });
	            if (sourceStorage) {
	                if (creep.withdraw(sourceStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(sourceStorage);
	                }
	            }
	            else {
	                var sources = creep.room.find(FIND_SOURCES);
	                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(sources[0]);
	                }
	            }
	        }
	    }
	}
};

module.exports = roleBuilder;