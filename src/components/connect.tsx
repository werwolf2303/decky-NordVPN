import { PanelSection, ButtonItem } from "decky-frontend-lib";
import { ReactElement, useEffect, useState } from "react";
import { Backend, Connection } from "../backend";
import { CountryList } from "./countryList";

export function Connect({backend}: {backend: Backend}): ReactElement {
    const [ countries, setCountries ] = useState("");
    const [ connectionInfo, setConnectionInfo ] = useState<Connection>();
    var subscribed = false;

    const loadValues = async() => {
      try {
        setCountries(await backend.getCountries());
      } catch (error) {
        backend.triggerErrorSwitch(String(error));
      }

      try {
        setConnectionInfo(await backend.getConnection());
      }catch (error) {
        backend.triggerErrorSwitch(String(error));
      }
    }

    function refreshConnectionMethod(connection: Connection) {
      try {
        setConnectionInfo(connection);
      }catch (error) {
        backend.triggerErrorSwitch(String(error));
      }
    }

    useEffect(() => {
      if(!subscribed) {
        backend.subscribeToConnectionInfoRefresh(refreshConnectionMethod);
        subscribed = true;
      }
      loadValues();
    }, [])

    return (
      <PanelSection title={backend.getLanguage().translate("ui.connection.title")}>
        <CountryList backend={backend} countries={countries} /> {/* A list containing all available countries */}
        <ButtonItem
        layout="below"
        onClick={() => {backend.autoConnect()}}
        >
          {backend.getLanguage().translate("ui.connection.autoconnect")}
        </ButtonItem>
        <ButtonItem
        layout="below"
        onClick={() => {backend.disconnect()}}
        disabled={connectionInfo?.Status === "ui.connectioninfo.disconnected"}
        >{backend.getLanguage().translate("ui.connection.disconnect")}</ButtonItem>
      </PanelSection>
    );
}
