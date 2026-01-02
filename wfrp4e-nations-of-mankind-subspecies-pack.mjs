const subspeciesPacks = [
    "bretonnia.json",
    "tilea.json",
    "other.json"
];

Hooks.once('init', async () => {
    const promises = subspeciesPacks.map(f => fetch(`modules/wfrp4e-nations-of-mankind-subspecies-pack/data/${f}`).then(res => res.json()));
    const datasets = await Promise.all(promises);
    console.log(datasets);

    for (const data of datasets) {
        foundry.utils.mergeObject(game.wfrp4e.config.subspecies.human, data);
    }
    
});