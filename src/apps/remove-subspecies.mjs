export class RemoveSubspecies extends FormApplication {

    constructor(...args) {
        super(...args);
        this.subspeciesData = game.settings.get("wfrp4e-even-more-species", "customSubspeciesData");
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ['application', 'warhammer', 'standard-form', 'remove-subspecies-app'],
        width: 500,
        height: 'auto',
        popOut: true,
        template: `modules/wfrp4e-even-more-species/templates/remove-subspecies.hbs`,
        title: 'Remove Custom Subspecies',
        });
    }

    getData() {
        const context = super.getData();

        context.subspeciesData = this.subspeciesData;

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        this.element.removeClass('window-app');
        this.element.removeClass('app');
        this.element.removeClass('theme-light');
        this.element.find('header').removeClass("flexrow")

        this.selectField = html.find('.subspecies-select');

        html.find('.remove-subspecies-button').click(event => this._removeSubspecies(event));
    }

    async _removeSubspecies(event) {
        const selectedSubspecies = this.selectField.val();

        if (!selectedSubspecies) {
            ui.notifications.warn("No subspecies selected to remove.");
            return;
        }

        this.subspeciesData = Object.entries(this.subspeciesData)
            .reduce((acc, [subspeciesKey, subspeciesValue]) => {
                if (subspeciesKey !== selectedSubspecies) acc[subspeciesKey] = subspeciesValue;
                return acc;
            }, {});
            
        await game.settings.set("wfrp4e-even-more-species", "customSubspeciesData", this.subspeciesData);
        ui.notifications.info(`Removed subspecies: ${selectedSubspecies.capitalize()}`);
        this.render(false);
    }
}

