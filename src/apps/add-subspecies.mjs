export class AddSubspecies extends FormApplication {

    constructor(...args) {
        super(...args);
        this.name = "";
        this.skills = [];
        this.talents = [];
        this.species = "";
        this.randomTalents = 0;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ['application', 'warhammer', 'standard-form', 'add-subspecies-app'],
        width: 500,
        height: 'auto',
        popOut: true,
        template: `modules/wfrp4e-even-more-species/templates/add-subspecies.hbs`,
        title: 'Add Custom Subspecies',
        });
    }

    getData() {
        const context = super.getData();

        context.name = this.name;
        context.skills = this.skills;
        context.talents = this.talents;
        context.species = this.species;
        context.speciesOptions = game.wfrp4e.config.species;
        context.randomTalents = this.randomTalents;


        return context;
    }
    
    activateListeners(html) {
        super.activateListeners(html);
        this.element.removeClass('window-app');
        this.element.removeClass('app');
        this.element.removeClass('theme-light');
        this.element.find('header').removeClass("flexrow")

        this.skillInput = html.find('.subspecies-skill-input');
        this.talentInput = html.find('.subspecies-talent-input');
        
        html.find('.species-select').change(event => {
            this.species = event.target.value;
            this.render(false);
        });
        html.find('.subspecies-name-input').on('change', event => {
            this.name = event.target.value;
            this.render(false);
        });
        html.find('.random-talents').on('input', event => {
            this.randomTalents = Number(event.target.value);
            html.find('.random-talents-value').text(this.randomTalents);
        });
        html.find('.random-talents').on('change', event => {
            this.randomTalents = Number(event.target.value);
            this.render(false);
        });
        
        html.find('.add-subspecies-skill').click(event => this._addEntry(event, 'skill'));
        html.find('.add-subspecies-talent').click(event => this._addEntry(event, 'talent'));
        html.find('.subspecies-list-item').click(event => this._removeEntry(event));
        html.find('.submit-subspecies-button').click(event => this._submitSubspecies(event));
    }

    _addEntry(event, entryType) {
        event.preventDefault();

        if (entryType === 'skill') {
            const value = this.skillInput.val();
            if (value && !this.skills.includes(value)) {
                this.skills.push(value);
                this.skillInput.val('');
            }
            else return;
        }
        else {
            const value = this.talentInput.val();
            if (value && !this.talents.includes(value)) {
                this.talents.push(value);
                this.talentInput.val('');
            }
            else return;
        }

        this.render(false);
    }

    _removeEntry(event) {
        event.preventDefault();

        const item = event.currentTarget;
        const value = item.dataset.value;

        if (this.skills.includes(value)) {
            this.skills = this.skills.filter(s => s !== value);
        }
        else if (this.talents.includes(value)) {
            this.talents = this.talents.filter(t => t !== value);
        }

        this.render(false);
    }

    async _submitSubspecies(event) {
        event.preventDefault();

        const validators = [
            this._validateName(),
            this._validateSpecies(),
            this._validateSkillsAndTalents()
        ];

        const error = validators.find(v => v !== true);
        if (error) {
            ui.notifications.warn(error);
            return;
        }

        const talentsMixed = [...this.talents, this.randomTalents];
        const speciesNameLowercase = this.name.toLowerCase();

        let subspeciesData = game.settings.get("wfrp4e-even-more-species", "customSubspeciesData") || {};

        subspeciesData[speciesNameLowercase] = {
                name: this.name,
                species: this.species,
                skills: this.skills,
                talents: talentsMixed,
        }

        await game.settings.set("wfrp4e-even-more-species", "customSubspeciesData", subspeciesData);
        ui.notifications.info(`Custom subspecies "${this.name}" added successfully.`);
        this.close();
    }

    _validateName(){
        if (!this.name || this.name.length < 3) return "Name must be at least 3 characters.";

        const key = this.name.toLowerCase();
        const existingData = game.settings.get("wfrp4e-even-more-species", "customSubspeciesData");
        if (existingData && existingData[key]) return "A subspecies with this name already exists.";

        return true;
    }
    _validateSpecies(){
        if (!this.species) return "Please select a species.";
        return true;
    }
    _validateSkillsAndTalents(){
        if (this.skills.length === 0 || this.talents.length === 0) return "Please add at least one skill and one talent for the subspecies.";
        return true;
    }
}