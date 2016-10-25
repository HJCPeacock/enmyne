var roleAttack = {
    run: function (creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var rampartPromise = creep.pos.lookFor(LOOK_STRUCTURES);
        var isOnRampart = rampartPromise.length > 0 && _.filter(rampartPromise, (x) => x.structureType == STRUCTURE_RAMPART).length > 0;

        //Heal
        var canHeal = _.filter(creep.body, (x) => x.type == 'heal').length > 0;
        if (canHeal && creep.hits < creep.hitsMax) creep.heal(creep);

        //Ranged Attack
        var canRangedAttack = _.filter(creep.body, (x) => x.type == 'ranged_attack').length > 0;
        if(target && canRangedAttack) {
            if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE && !isOnRampart) creep.moveTo(target);
        }

        //Attack
        var canAttack = _.filter(creep.body, (x) => x.type == 'attack').length > 0;
        if (target && canAttack) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE && !isOnRampart) creep.moveTo(target);
            else if (isOnRampart && !creep.pos.inRangeTo(target, 3)) creep.moveTo(Game.flags[creep.memory.flag]);
        }

        if (!target) creep.moveTo(Game.flags[creep.memory.flag]);
	}
};

module.exports = roleAttack;