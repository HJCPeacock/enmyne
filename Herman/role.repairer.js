var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var rampart = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_RAMPART && structure.hits < 300000);
            }
        });
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_SPAWN && structure.hits < structure.hitsMax) ||
                            (structure.structureType == STRUCTURE_TOWER && structure.hits < structure.hitsMax) ||
                            (structure.structureType == STRUCTURE_STORAGE && structure.hits < structure.hitsMax) ||
                            (structure.structureType == STRUCTURE_WALL && structure.hits < 300000) ||
                            (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax)
                            );
                }
	    });
	    if (rampart)
	    {
	        if (creep.repair(rampart) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(rampart);
	        }
	    }
        else if(target) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
	}
};

module.exports = roleRepair;