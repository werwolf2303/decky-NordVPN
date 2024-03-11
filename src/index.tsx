import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  quickAccessMenuClasses,
  Button
} from "decky-frontend-lib";
import { 
  VFC,
  useState
} from "react";
import { Backend } from "./backend";
import { GenIcon, IconBaseProps } from "react-icons";
import { ConnectionInfo } from "./components/connectionInfo";
import { Connect } from "./components/connect";
import { Settings } from "./components/settings";

function NordVPNfa(props: IconBaseProps) {
  // @ts-ignore
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 48 48"},"child":[{"tag":"path","attr":{"d":"m6.59 36.89a21.71 21.71 0 0 1 17.41-34.39 21.71 21.71 0 0 1 17.41 34.39l-10.33-16.89-1.86 3.17 1.88 3.23-7.1-12.23-5.27 9 1.9 3.27-3.72-6.44z"}}]})(props); 
}

const Content: VFC<{ backend: Backend }> = ({backend}) => {

  const [ loaded, setLoaded ] = useState(false);
  const [ installed, setInstalled ] = useState(false);
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ errorSwitch, setErrorSwitch ] = useState(false);

  const loadNordVPN = async () => {

    try {
      const isInstalledResponse = backend.isInstalled();
      setInstalled(await isInstalledResponse);
    } catch(error) {
      setErrorSwitch(true);
    }

    try {
      const isLoggedInResponse = backend.isLoggedIn();
      setLoggedIn(await isLoggedInResponse);
    } catch (error) {
      setErrorSwitch(true);
    }

    setLoaded(true);
  }

  function triggerErrorSwitch() {
    setErrorSwitch(true);
  }

  backend.setErrorSwitchMethod(triggerErrorSwitch);

  loadNordVPN();
  
  if(errorSwitch) {
    return (
    <>
    <p>{backend.getLanguage().translate("ui.error.switch1")}</p>
    <p>{backend.getLanguage().translate("ui.error.switch2")}</p>
    <p>{backend.getLanguage().translate("ui.error.switch3")}</p>
    </>)
  }

  if(loaded && !installed) {
    return (
    <PanelSection title={backend.getLanguage().translate("general.error")}>
      <PanelSectionRow>
      <p>{backend.getLanguage().translate("ui.error.binary1")}</p>
      <p>{backend.getLanguage().translate("ui.error.binary2")}</p>
      </PanelSectionRow>
      </PanelSection>);
  }

  if(loaded && !loggedIn) {
    return (<>
    <PanelSection title={backend.getLanguage().translate("ui.login.title")}>
      <PanelSectionRow>
      <p>{backend.getLanguage().translate("ui.login.txt1")}</p>
      <p>{backend.getLanguage().translate("ui.login.txt2")}</p>
      <p>{backend.getLanguage().translate("ui.login.txt3")}</p>
      </PanelSectionRow>
    </PanelSection>
    </>);
  }

  if(loaded && installed && loggedIn) {
    return (
    <>
    <ConnectionInfo backend={backend} /> 
    <Connect backend={backend} />
    <Settings backend={backend} /> 
    </>);
  }

  if(!loaded) {
    return (<p>{backend.getLanguage().translate("general.wait")}</p>);
  }

  return (
    <>
    <p>{backend.getLanguage().translate("general.error.unknown")}</p>
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  var backend = new Backend(serverApi);
  backend.refreshCache();
  return {
    title: <div className={quickAccessMenuClasses.Title}>NordVPNdeck</div>,
    content: <Content backend={backend} />,
    icon: <NordVPNfa/>
  };
});
