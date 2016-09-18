var roleCarrierJnr = {
    run: function (creep) {
       
        if (creep.carry.energy == 0) {
            var targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, 3, { filter: (x) => x.resourceType == RESOURCE_ENERGY });
            if (targets.length > 0) {
                var res = creep.pickup(targets[0]);
                if (res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                } else if (res == OK) {
                    console.log('found ' + targets[0].energy + 'energy');
                }
            }
            else {
                var source = Game.spawns.Spawn1.room.lookForAt('structure', 36, 24)[0];
                if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(source);
            }
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE;
                }
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};

module.exports = roleCarrierJnr;