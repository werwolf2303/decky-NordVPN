import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  quickAccessMenuClasses,
  ButtonItem,
  Router,
  Navigation
} from "decky-frontend-lib";
import { 
  VFC,
  useEffect,
  useState
} from "react";
import { Backend } from "./backend";
import { GenIcon, IconBaseProps } from "react-icons";
import { ConnectionInfo } from "./components/connectionInfo";
import { Connect } from "./components/connect";
import { Settings } from "./components/settings";
import { SettingsManager } from "./settings";
import { 
  showDialog
} from "./utils";
import { BrowserViewRouter } from "./browserStuff/BrowserView";

function NordVPNfa(props: IconBaseProps) {
  // @ts-ignore
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 48 48"},"child":[{"tag":"path","attr":{"d":"m6.59 36.89a21.71 21.71 0 0 1 17.41-34.39 21.71 21.71 0 0 1 17.41 34.39l-10.33-16.89-1.86 3.17 1.88 3.23-7.1-12.23-5.27 9 1.9 3.27-3.72-6.44z"}}]})(props); 
}

const Content: VFC<{ backend: Backend, settings: SettingsManager }> = ({backend, settings}) => {

  const [ loaded, setLoaded ] = useState(false);
  const [ installed, setInstalled ] = useState(false);
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ errorSwitch, setErrorSwitch ] = useState(false);
  const [ errorString, setErrorString ] = useState("");

  const loadNordVPN = async () => {

    try {
      const isInstalledResponse = backend.isInstalled();
      setInstalled(await isInstalledResponse);
    } catch(error) {
      triggerErrorSwitch(String(error));
    }

    try {
      const isLoggedInResponse = backend.isLoggedIn();
      setLoggedIn(await isLoggedInResponse);
    } catch (error) {
      triggerErrorSwitch(String(error));
    }
    
    await backend.initLanguage();

    setLoaded(true);
  }

  function triggerErrorSwitch(errorString: string) {
    setErrorString(errorString);
    setErrorSwitch(true);
  }

  backend.setErrorSwitchMethod(triggerErrorSwitch);

  useEffect(() => {
    loadNordVPN();
  }, []);
  
  if(errorSwitch) {
    return (
    <>
    <p>{backend.getLanguage().translate("ui.error.switch1")}</p>
    <p>{backend.getLanguage().translate("ui.error.switch2")}</p>
    <p>{backend.getLanguage().translate("ui.error.switch3")}</p>
    <p>{backend.getLanguage().translate("ui.error.switch4")}{errorString}</p>
    </>)
  }

  if(loaded && !installed) {
    return (
    <PanelSection title={backend.getLanguage().translate("general.error")}>
      <PanelSectionRow>
        <a>{backend.getLanguage().translate("ui.binary.txt1")}</a>
        <br />
        <a>{backend.getLanguage().translate("ui.binary.txt2")}</a>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
        onClick={() => {
          const exec = async() => {
            await backend.installNordVPN();
            showDialog("Info", "Please restart the SteamDeck to complete the installation")
          };
          exec();
        }}
        layout="below"
        >{backend.getLanguage().translate("ui.binary.button")}</ButtonItem>
      </PanelSectionRow>
    </PanelSection>);
  }

  if(loaded && !loggedIn) {
    return (<>
    <PanelSection title={backend.getLanguage().translate("ui.login.title")}>
      <a>{backend.getLanguage().translate("ui.login.txt1")}</a>
      <PanelSectionRow>
        <ButtonItem
        layout="below"
        onClick={() => {
          Navigation.Navigate("/dnvpnBrowser");
        }}
        >{backend.getLanguage().translate("ui.login.button")}</ButtonItem>
      </PanelSectionRow>
    </PanelSection>
    </>);
  }

  if(loaded && installed && loggedIn) {
    return (
    <>
    <ConnectionInfo backend={backend} /> 
    <Connect backend={backend} />
    <Settings settings={settings} backend={backend} /> 
    </>);
  }

  if(!loaded) {
    return (<p>{"Initializing..."}</p>);
  }

  return (
    <>
    <p>{backend.getLanguage().translate("general.error.unknown")}</p>
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  var settings = new SettingsManager(serverApi); 
  var backend = new Backend(serverApi, settings);
  backend.refreshCache();

  const BrowserRouter: VFC = () => {
    return (
      <div style={{ overflowY: 'scroll', marginTop: '60px', marginBottom: '60px', height: 'calc(100%-80px)' }}>
        <BrowserViewRouter backend={backend} />
      </div>
    )
  }

  serverApi.routerHook.addRoute("/dnvpnBrowser", BrowserRouter, {
    exact: true,
  });

  return {
    title: <div className={quickAccessMenuClasses.Title}>NordVPNdeck</div>,
    content: <Content settings={settings} backend={backend} />,
    icon: <NordVPNfa/>,
    onDismount() {
      serverApi.routerHook.removeRoute("/dnvpnBrowser");
    }
  };
});
