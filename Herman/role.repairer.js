var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var ramparts = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_RAMPART && structure.hits < 200000);
            }
        });
	    var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_SPAWN && structure.hits < structure.hitsMax) ||
                            (structure.structureType == STRUCTURE_TOWER && structure.hits < structure.hitsMax) ||
                            (structure.structureType == STRUCTURE_RAMPART && structure.hits < 200000) ||
                            (structure.structureType == STRUCTURE_WALL && structure.hits < 250000) ||
                            (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax)
                            );
                }
	    });
	    if (ramparts.length > 0)
	    {
	        if (creep.repair(ramparts[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(ramparts[0]);
	        }
	    }
        else if(targets.length > 0) {
            if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
	}
};

module.exports = roleRepair;