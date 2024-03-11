import { ReactElement, useEffect, useState } from "react";
import { Backend } from "../backend";
import { PanelSection, PanelSectionRow, ToggleField } from "decky-frontend-lib";

export function Settings({backend}: {backend: Backend}): ReactElement {
    const [ firewall, setFirewall ] = useState(false);
    const [ routing, setRouting ] = useState(false);
    const [ analytics, setAnalytics ] = useState(false);
    const [ killswitch, setKillSwitch ] = useState(false);
    const [ threatprotection, setThreatProtection ] = useState(false);
    const [ notify, setNotify ] = useState(false);
    const [ autoconnect, setAutoConnect ] = useState(false);
    const [ ipv6, setIPv6 ] = useState(false);
    const [ landiscovery, setLanDiscovery ] = useState(false);

    const loadSettings = async () => {
        setFirewall(await backend.getFirewall());
        setRouting(await backend.getRouting());
        setAnalytics(await backend.getAnalytics());
        setKillSwitch(await backend.getKillSwitch());
        setThreatProtection(await backend.getThreatProtectionLite());
        setNotify(await backend.getNotify());
        setAutoConnect(await backend.getAutoConnect());
        setIPv6(await backend.getIPv6());
        setLanDiscovery(await backend.getLanDiscovery());
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
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={routing}
                label={backend.getLanguage().translate("ui.settings.routing.title")}
                description={backend.getLanguage().translate("ui.settings.routing.description")}
                onChange={(checked) => {
                    backend.setRouting(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={analytics}
                label={backend.getLanguage().translate("ui.settings.analytics.title")}
                description={backend.getLanguage().translate("ui.settings.analytics.description")}
                onChange={(checked) => {
                    backend.setAnalytics(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={killswitch}
                label={backend.getLanguage().translate("ui.settings.killswitch.title")}
                description={backend.getLanguage().translate("ui.settings.killswitch.description")}
                onChange={(checked) => {
                    backend.setKillSwitch(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={threatprotection}
                label={backend.getLanguage().translate("ui.settings.threatprotection.title")}
                description={backend.getLanguage().translate("ui.settings.threatprotection.description")}
                onChange={(checked) => {
                    backend.setThreatProtectionLite(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={notify}
                label={backend.getLanguage().translate("ui.settings.notify.title")}
                description={backend.getLanguage().translate("ui.settings.notify.description")}
                onChange={(checked) => {
                    backend.setNotify(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={autoconnect}
                label={backend.getLanguage().translate("ui.settings.autoconnect.title")}
                description={backend.getLanguage().translate("ui.settings.autoconnect.description")}
                onChange={(checked) => {
                    backend.setAutoConnect(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={ipv6}
                label={backend.getLanguage().translate("ui.settings.ipv6.title")}
                description={backend.getLanguage().translate("ui.settings.ipv6.description")}
                onChange={(checked) => {
                    backend.setIPv6(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={landiscovery}
                label={backend.getLanguage().translate("ui.settings.landiscovery.title")}
                description={backend.getLanguage().translate("ui.settings.landiscovery.description")}
                onChange={(checked) => {
                    backend.setLanDiscovery(checked);
                }}
                />
           </PanelSectionRow>
        </PanelSection>
        </>
    )
}