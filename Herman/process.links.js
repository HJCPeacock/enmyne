var processLinks = {
    run: function () {

        //room W59S26
        //at source 1
        var linkFrom1 = Game.spawns.Spawn1.room.lookForAt('structure', 20, 33)[0];
        var linkTo = Game.spawns.Spawn1.room.lookForAt('structure', 36, 24)[0];

        if (linkFrom1 && linkFrom1.cooldown == 0 && linkTo.energyCapacity - linkTo.energy >= linkFrom1.energy && linkFrom1.energy > 100)
            linkFrom1.transferEnergy(linkTo);

        //at source 2
        var linkFrom2 = Game.spawns.Spawn1.room.lookForAt('structure', 22, 42)[1];

        if (linkFrom2 && linkFrom2.cooldown == 0 && linkTo.energyCapacity - linkTo.energy >= linkFrom2.energy && linkFrom2.energy > 100)
            linkFrom2.transferEnergy(linkTo);
    }
};

module.exports = processLinks;