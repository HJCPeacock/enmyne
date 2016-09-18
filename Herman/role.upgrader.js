var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
       
         if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
	    }
	    
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('upgrading');
	    }
        
	    if(!creep.memory.upgrading) {
	        var sourceStorage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	            filter: (structure) => {
	                return structure.structureType == STRUCTURE_STORAGE;
	            }
	        });
	        if (sourceStorage) {
	            if (creep.withdraw(sourceStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(sourceStorage);
	            }
	        } else {
	            var sources = creep.room.find(FIND_SOURCES);
	            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(sources[0]);
	            }
	        }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;