var roleAttack = {
    run: function (creep) {
        var canHeal = _.filter(creep.body, (x) => x.type == 'heal').length > 0;
        if (canHeal && creep.hits < creep.hitsMax) creep.heal(creep);

        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 22);
        if(targets.length > 0) {
            if (creep.rangedAttack(targets[0]) == ERR_NOT_IN_RANGE) creep.moveTo(targets[0]);
        }
	}
};

module.exports = roleAttack;