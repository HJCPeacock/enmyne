var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var rampart = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_RAMPART && structure.hits < 200000);
            }
        });
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_SPAWN && structure.hits < structure.hitsMax) ||
                            (structure.structureType == STRUCTURE_TOWER && structure.hits < structure.hitsMax) ||
                            (structure.structureType == STRUCTURE_RAMPART && structure.hits < 200000) ||
                            (structure.structureType == STRUCTURE_WALL && structure.hits < 250000) ||
                            (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax)
                            );
                }
	    });
	    if (rampart)
	    {
	        if (creep.repair(rampart, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(rampart);
	        }
	    }
        else if(target) {
            if(creep.repair(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
	}
};

module.exports = roleRepair;