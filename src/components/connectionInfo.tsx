import { ReactElement, useEffect, useState } from "react";
import { Backend, Connection, } from "../backend";
import { Field, PanelSection, PanelSectionRow, Spinner } from "decky-frontend-lib";

export function ConnectionInfo({backend}: {backend: Backend}): ReactElement {
    const [ connection, setConnection ] = useState<Connection>();
    const [ loaded, setLoaded ] = useState(false); 

    function refreshConnectionInfo(connection: Connection) {
        setConnection(connection);
    }

    backend.setConnectionInfoRefresh(refreshConnectionInfo);

    const init = async() => {
        refreshConnectionInfo(await backend.getConnection());
        setLoaded(true);
        console.log(connection)
    }

    useEffect(() => {
        init()
    });

    if(!loaded) {
        return (
            <PanelSection title={backend.getLanguage().translate("ui.connectioninfo.title")}>
                <PanelSectionRow>
                    <Field label={backend.getLanguage().translate("general.loading")}>
                        <Spinner />
                    </Field>
                </PanelSectionRow>
            </PanelSection>
        )
    }

    return (
        <PanelSection title={backend.getLanguage().translate("ui.connectioninfo.title")}>
            <PanelSectionRow>
                <div>{backend.getLanguage().translate("ui.connectioninfo.status")}: {connection?.Status}</div>
                {!connection?.Status.includes("Disconnected") && 
                <>
                <div>{backend.getLanguage().translate("ui.connectioninfo.ip")}: {connection?.IP}</div>
                <div>{backend.getLanguage().translate("ui.connectioninfo.country")}: {connection?.Country}</div>
                <div>{backend.getLanguage().translate("ui.connectioninfo.city")}: {connection?.City}</div>
                </>
                }
            </PanelSectionRow>
        </PanelSection>
    );
}