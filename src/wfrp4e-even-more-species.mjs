import { registerSettings } from "./settings.mjs";

const subspeciesPacks = [
    "bretonnia.json",
    "tilea.json",
    "other.json",
];

Hooks.once('init', async () => {
    await registerSettings();

    const promises = subspeciesPacks.map(f => fetch(`modules/wfrp4e-even-more-species/data/${f}`).then(res => res.json()));
    const datasets = await Promise.all(promises);

    const customDatasets = game.settings.get("wfrp4e-even-more-species", "customSubspeciesData") || {};

    datasets.push(customDatasets);

    for (const data of datasets) {
        for (const [subraceKey, subraceData] of Object.entries(data)) {
            if (!subraceData.species) {
                game.wfrp4e.config.subspecies.human[subraceKey] = subraceData;
                continue;
            }
            const speciesKey = subraceData.species.toLowerCase();
            if (!game.wfrp4e.config.subspecies[speciesKey]) {
                game.wfrp4e.config.subspecies[speciesKey] = {};
            }
            const {species, ...rest} = subraceData;
            game.wfrp4e.config.subspecies[speciesKey][subraceKey] = rest;
        }
    }

    fetch("modules/wfrp4e-even-more-species/data/ogres.json")
    .then(res => res.json())
    .then(data => {
        const ogreData = data
        _loadOgreData(ogreData);
    });

    fetch("modules/wfrp4e-even-more-species/data/gnomes.json")
    .then(res => res.json())
    .then(data => {
        const gnomeData = data
        _loadGnomeData(gnomeData);
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

function _loadGnomeData(gnomeData) {
    foundry.utils.mergeObject(game.wfrp4e.config.species, gnomeData.species);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesTalents, gnomeData.talents);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesSkills, gnomeData.skills);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesCharacteristics, gnomeData.characteristics);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesFate, gnomeData.fate);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesRes, gnomeData.res);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesMovement, gnomeData.mov);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesExtra, gnomeData.extra);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesAge, gnomeData.age);
    foundry.utils.mergeObject(game.wfrp4e.config.speciesHeight, gnomeData.height);
}