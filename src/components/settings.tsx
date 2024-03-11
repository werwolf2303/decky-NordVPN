import { ReactElement, useEffect, useState } from "react";
import { Backend } from "../backend";
import { PanelSection, PanelSectionRow, ToggleField } from "decky-frontend-lib";

export function Settings({backend}: {backend: Backend}): ReactElement {
    const [ firewall, setFirewall ] = useState(false);

    const loadSettings = async () => {
        setFirewall(await backend.getFirewall());
    };

    useEffect(() => {
        loadSettings();
    });

    return (
        <>
        <PanelSection 
        title={backend.getLanguage().translate("ui.settings.title")}>
            <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={firewall}
                label={backend.getLanguage().translate("ui.settings.firewall.title")}
                description={backend.getLanguage().translate("ui.settings.firewall.description")}
                onChange={(checked) => {
                    backend.setFirewall(checked);
                }}
                />
           </PanelSectionRow>
        </PanelSection>
        </>
    )
}