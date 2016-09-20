var roleHarvester = require('role.harvester');
var roleCarrierJnr = require('role.carrierjnr');
var roleCarrier = require('role.carrier');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleAttacker = require('role.attack');
var processSpawning = require('process.spawning');
var processTowers = require('process.towers');
var processLinks = require('process.links');

module.exports.loop = function () {

    //All Rooms
    processLinks.run();

    //For room W59S26
    if (Game.rooms['W59S26'].find(FIND_MY_CREEPS).length < 4) Game.notify('O balls; screep count in room W59S26 = ' + Game.rooms['W59S26'].find(FIND_MY_CREEPS).length);

    //params: builders, harvesters, upgraders, repairers, attackers, carriers
    processSpawning.run(1, Game.rooms['W59S26'].find(FIND_SOURCES).length, calculateUpgraderCount(), 0, 1);
   
    //run roles for room W59S26
    var myScreeps = Game.rooms['W59S26'].find(FIND_MY_CREEPS)
    for (var name in myScreeps) {
        var creep = myScreeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'carrierjnr') {
            roleCarrierJnr.run(creep);
        }
        if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
    }
    
    //run towers for room W59S26
    var towers = Game.rooms['W59S26'].find(FIND_MY_STRUCTURES, { filter: (x) => x.structureType == STRUCTURE_TOWER });
    for(var towerCounter = 0; towerCounter < towers.length; towerCounter++)
    {
        processTowers.run(towers[towerCounter]);
    }

    function calculateUpgraderCount() {
        return Math.ceil(Game.rooms['W59S26'].storage.store[RESOURCE_ENERGY] / 10000);
    }
}