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
var rolePath = require('role.claim');

module.exports.loop = function () {

    //All Rooms
    //processLinks.run();

    //For room E51N1
    //if (Game.rooms['E51N1'].find(FIND_MY_CREEPS).length < 4) Game.notify('O balls; screep count in room E51N1 = ' + Game.rooms['E51N1'].find(FIND_MY_CREEPS).length);

    //params: builders, harvesters, upgraders, attackers, carriers
    processSpawning.run(2, Game.rooms['E51N1'].find(FIND_SOURCES).length, calculateUpgraderCount(), calculateAttackerCount(), 0);

    //run roles for room E51N1
    var myScreeps = Game.creeps;
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
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
        if (creep.memory.role == 'claim') {
            rolePath.run(creep);
        }
    }

    //run towers for room E51N1
    var towers = Game.rooms['E51N1'].find(FIND_MY_STRUCTURES, { filter: (x) => x.structureType == STRUCTURE_TOWER });
    for (var towerCounter = 0; towerCounter < towers.length; towerCounter++) {
        processTowers.run(towers[towerCounter]);
    }

    function calculateUpgraderCount() {
        if (!Game.rooms['E51N1'].storage) return 3;
        return Math.ceil(Game.rooms['E51N1'].storage.store[RESOURCE_ENERGY] / 10000);
    }

    function calculateAttackerCount() {
        if (Game.rooms['E51N1'].find(FIND_HOSTILE_CREEPS).length > 1) return 3;
    }
}