import english from "../../assets/language/en.json"

export interface LanguageModule {
    translate(name: string): string;
}

export class Language {
    private language: LanguageModule = {
        translate(name: string): string {
            return name
        }
    }
    
    constructor() {
        switch(navigator.language.split("-")[0].toLocaleLowerCase()) {
            case "en": {
                this.language = {
                    translate(name: string): string {
                        return english[name]
                    }
                }
            }
        }
    }    

    translate(name: string): string {
        return this.language.translate(name);
    }
}