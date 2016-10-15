var processLinks = {
    run: function (room) {

        //room E51N1
        if (room.name != 'E51N1') return;
        if (!Game.spawns.Spawn1) return;

        //at source 1
        var linkFrom1 = Game.spawns.Spawn1.room.lookForAt('structure', 5, 11)[0];
        if (linkFrom1 == undefined) return;

        var linkTo = Game.spawns.Spawn1.room.lookForAt('structure', 17, 23)[0];
        if (linkTo == undefined) return;

        if (linkFrom1 && linkFrom1.cooldown == 0 && linkTo.energyCapacity - linkTo.energy >= linkFrom1.energy && linkFrom1.energy >= 200)
            linkFrom1.transferEnergy(linkTo);

        //at source 2
        var linkFrom2 = Game.spawns.Spawn1.room.lookForAt('structure', 36, 16)[0];
        if (linkFrom2 == undefined) return;

        if (linkFrom2 && linkFrom2.cooldown == 0 && linkTo.energyCapacity - linkTo.energy >= linkFrom2.energy && linkFrom2.energy >= 200)
            linkFrom2.transferEnergy(linkTo);
    }
};

module.exports = processLinks;