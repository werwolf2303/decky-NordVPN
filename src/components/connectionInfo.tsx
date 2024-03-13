import { ReactElement, useEffect, useState } from "react";
import { Backend, Connection, } from "../backend";
import { Field, PanelSection, PanelSectionRow, Spinner } from "decky-frontend-lib";

export function ConnectionInfo({backend}: {backend: Backend}): ReactElement {
    const [ connection, setConnection ] = useState<Connection>();
    const [ connectionTrans, setConnectionTrans ] = useState<string>(); 
    const [ loaded, setLoaded ] = useState(false); 

    function refreshConnectionInfo(connection: Connection) {
        setConnection(connection);
    }

    backend.setConnectionInfoRefresh(refreshConnectionInfo);

    const init = async() => {
        refreshConnectionInfo(await backend.getConnection());

        if(connection?.Status.includes("Disconnected")) {
            setConnectionTrans(backend.getLanguage().translate("ui.connectioninfo.disconnected"));
        }else{
            setConnectionTrans(backend.getLanguage().translate("ui.connectioninfo.connected"));
        }

        setLoaded(true);
    }

    useEffect(() => {
        init()
    }, []);

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
                <Field
                label={backend.getLanguage().translate("ui.connectioninfo.status")}
                >{connectionTrans}</Field>    
            </PanelSectionRow>
            {!connection?.Status.includes("Disconnected") && 
                <>
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