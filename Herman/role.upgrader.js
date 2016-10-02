var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
       
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    
	    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }
        
	    if(!creep.memory.upgrading) {
	        var sourceStorage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	            filter: (structure) => {
	                return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 2000;
	            }
	        });
	        if (sourceStorage) {
	            if (creep.withdraw(sourceStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(sourceStorage);
	            }
	        } else {
	            var source = creep.pos.findClosestByRange(FIND_SOURCES);
	            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(source);
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