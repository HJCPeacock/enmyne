var processSpawning = {
    run: function(builderLimit, hervesterlimit, upgraderLimit, repairerLimit, attackerLimit, carrierLimit) {
        
        var spawn = Game.spawns['Spawn1'];

        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        var carrierJnrs = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrierjnr');
        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
        
        //Body Parts
        //time
        //t = ceil(k * W / M)

        //Where:
        //t = time (game ticks)
        //k = terrain factor (1x for plain, 0.5x for road, 5x for swamp)
        //W = creep weight (Number of body parts, excluding MOVE and empty CARRY parts)
        //M = number of MOVE parts

        //Fatigue
        //F = W * K - 2 * M

        //Where:
        //F = initial fatigue value
        //W = creep weight (Number of body parts, excluding MOVE and empty CARRY parts)
        //K = terrain factor (1x for road, 2x for plain, 10x for swamp)
        //M = number of MOVE parts
        var harvesterBody = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]; //1200 | 0.5 * 10 / 5 = 1  | 8 * 1 - 2 * 4 = 8 - 8 = 0
        var carrierJnrBody = [CARRY, MOVE]; //250 | | 4 * 2 - 2 * 3 = 2
        var carrierBody = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]; //550 | 0.5 * 10 / 5 = 1  | 10 * 1 - 2 * 5 = 10 - 10 = 0
        var builderBody = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];//950 | 1 * 8 / 8 = 1 | 8 * 2 - 2 * 8 = 0
        var upgraderBody = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]; //950 | 0.5 * 10 / 5 = 1  | 10 * 1 - 2 * 5 = 10 - 10 = 0
        var repairerBody = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];//950 | 1 * 8 / 8 = 1 | 8 * 2 - 2 * 8 = 0
        var attackerBody = [WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK];
    
        if (harvesters.length < hervesterlimit && spawn.canCreateCreep(harvesterBody, undefined) == OK) {
            var newName = spawn.createCreep(harvesterBody, undefined, {role: 'harvester', harvesting: true, source: getSourceCount() == 0 ? 0 : 1});
            console.log('Spawning new harvester: ' + newName);
        }
        else if (carrierJnrs.length < 1 && spawn.canCreateCreep(carrierJnrBody, undefined) == OK) {
            var newName = spawn.createCreep(carrierJnrBody, undefined, { role: 'carrierjnr' });
            console.log('Spawning new carrierjnr: ' + newName);
        }
        else if (carriers.length < carrierLimit && spawn.canCreateCreep(carrierBody, undefined) == OK) {
            var newName = spawn.createCreep(carrierBody, undefined, { role: 'carrier', harvesting: true });
            console.log('Spawning new carrier: ' + newName);
        }
        else if (builders.length < builderLimit && spawn.canCreateCreep(builderBody, undefined) == OK) {
            var newName = spawn.createCreep(builderBody, undefined, {role: 'builder', building: false, repairing: false});
            console.log('Spawning new builder: ' + newName);
        }
        else if (upgraders.length < upgraderLimit && spawn.canCreateCreep(upgraderBody, undefined) == OK) {
            var newName = spawn.createCreep(upgraderBody, undefined, {role: 'upgrader', upgrading: false});
            console.log('Spawning new upgrader: ' + newName);
        }
        else if (repairers.length < repairerLimit && spawn.canCreateCreep(repairerBody, undefined) == OK) {
            var newName = spawn.createCreep(repairerBody, undefined, {role: 'repairer', repairing: false});
            console.log('Spawning new repairer: ' + newName);
        }
        else if (attackers.length < attackerLimit && spawn.canCreateCreep(attackerBody, undefined) == OK) {
            var newName = spawn.createCreep(attackerBody, undefined, {role: 'attacker', repairing: false});
            console.log('Spawning new attacker: ' + newName);
        }

        function getSourceCount () {
            return _.filter(harvesters, (creep) => creep.memory.source == 0).length;
        }
	}
};

module.exports = processSpawning;