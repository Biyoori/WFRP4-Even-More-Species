const subspeciesPacks = [
    "bretonnia.json",
    "tilea.json",
    "other.json"
];

Hooks.once('init', async () => {
    const promises = subspeciesPacks.map(f => fetch(`modules/wfrp4e-nations-of-mankind-subspecies-pack/data/${f}`).then(res => res.json()));
    const datasets = await Promise.all(promises);

    for (const data of datasets) {
        foundry.utils.mergeObject(game.wfrp4e.config.subspecies.human, data);
    }

    fetch("modules/wfrp4e-nations-of-mankind-subspecies-pack/data/ogres.json")
    .then(res => res.json())
    .then(data => {
        const ogreData = data
        _loadOgreData(ogreData);
    });
});

function _loadOgreData(ogreData) {
    foundry.utils.mergeObject(game.wfrp4e.config.species, ogreData.species);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesTalents, ogreData.talents);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesSkills, ogreData.skills);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesCharacteristics, ogreData.characteristics);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesFate, ogreData.fate);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesRes, ogreData.res);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesMovement, ogreData.mov);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesExtra, ogreData.extra);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesAge, ogreData.age);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesHeight, ogreData.height);
    
}