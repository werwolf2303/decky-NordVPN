import { ReactElement, useEffect, useState } from "react";
import { Backend, Connection, } from "../backend";
import { Field, PanelSection, PanelSectionRow, Spinner } from "decky-frontend-lib";

export function ConnectionInfo({backend}: {backend: Backend}): ReactElement {
    const [ connection, setConnection ] = useState<Connection>();
    const [ loaded, setLoaded ] = useState(false); 
    var subscribed = false;

    function refreshConnectionInfo(connection: Connection) {
        setLoaded(false);
        setConnection(connection);
        setLoaded(true);
    }

    const init = async() => {
        if(!subscribed) {
            backend.subscribeToConnectionInfoRefresh(refreshConnectionInfo);
            subscribed = true;
        } 
        refreshConnectionInfo(await backend.getConnection());
        setLoaded(true);
    }

    useEffect(() => {
        init()
    }, []);

    return (
        <PanelSection title={backend.getLanguage().translate("ui.connectioninfo.title")}>
            {!loaded && <PanelSectionRow>
                <Field label={backend.getLanguage().translate("general.loading")}>
                   <Spinner />
                </Field>
            </PanelSectionRow>}
            {(connection?.Status === "ui.connectioninfo.disconnected") &&
            <PanelSectionRow>
                <Field
                label={backend.getLanguage().translate("ui.connectioninfo.status")}
                >{backend.getLanguage().translate("ui.connectioninfo.disconnected")}</Field>    
            </PanelSectionRow>}
            {(connection?.Status === "ui.connectioninfo.connected") && 
                <>
                <PanelSectionRow>
                <Field
                label={backend.getLanguage().translate("ui.connectioninfo.status")}
                >{backend.getLanguage().translate("ui.connectioninfo.connected")}</Field>   
                </PanelSectionRow>
                <PanelSectionRow>
                <Field
                label={backend.getLanguage().translate("ui.connectioninfo.country")}
                >{connection?.Country}</Field>
                </PanelSectionRow>
                <PanelSectionRow>
                <Field
                label={backend.getLanguage().translate("ui.connectioninfo.city")}
                >{connection?.City}</Field>
                </PanelSectionRow>
                <PanelSectionRow>
                <Field
                label={backend.getLanguage().translate("ui.connectioninfo.ip")}
                >{connection?.IP}</Field>
                </PanelSectionRow>
                </>}
        </PanelSection>
    );
}