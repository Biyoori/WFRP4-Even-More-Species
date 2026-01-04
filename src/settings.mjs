import { AddSubspecies } from "./apps/add-subspecies.mjs";

export async function registerSettings() {
    await game.settings.registerMenu("wfrp4e-even-more-species", "addSubspecies", {
        name: "Add Custom Subspecies",
        label: "Add Subspecies",
        hint: "Add additional subspecies options to the species selection.",
        type: AddSubspecies,
        restricted: true
    });

    game.settings.register("wfrp4e-even-more-species", "customSubspeciesData", {
        name: "Custom Subspecies Data",
        scope: "world",
        config: false,
        type: Object,
        default: {}
    });
}