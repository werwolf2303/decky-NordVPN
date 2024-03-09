import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  quickAccessMenuClasses
} from "decky-frontend-lib";
import { 
  VFC,
  useState
} from "react";
import { Backend } from "./backend";
import { GenIcon, IconBaseProps } from "react-icons";
import { CountryList } from "./components/countryList";

function NordVPNfa(props: IconBaseProps) {
  // @ts-ignore
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 48 48"},"child":[{"tag":"path","attr":{"d":"m6.59 36.89a21.71 21.71 0 0 1 17.41-34.39 21.71 21.71 0 0 1 17.41 34.39l-10.33-16.89-1.86 3.17 1.88 3.23-7.1-12.23-5.27 9 1.9 3.27-3.72-6.44z"}}]})(props); 
}

const Content: VFC<{ backend: Backend }> = ({backend}) => {

  const [ loaded, setLoaded ] = useState(false);
  const [ installed, setInstalled ] = useState(false);
  const [ countries, setCountries ] = useState("");
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
      const getCountriesResponse = backend.getCountries();
      setCountries(await getCountriesResponse);
    } catch (error) {
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

  loadNordVPN();
  
  if(errorSwitch) {
    return (
    <>
    <p>!An error occurred!</p>
    <p>Please try again later.</p>
    <p>When the issue persists please contact the developer</p>
    </>)
  }

  if(loaded && !installed) {
    return (
    <PanelSection title="Error">
      <PanelSectionRow>
      <p>!!!NordVPN binary is not installed!!!</p>
      <p>Please follow the instructions inside the txt file on the GitHub repository of NordVPNdeck</p>
      </PanelSectionRow>
      </PanelSection>);
  }

  if(loaded && !loggedIn) {
    return (<>
    <PanelSection title="Please log in">
      <PanelSectionRow>
      <p>Please open the console application inside Desktop Mode</p>
      <p>Type the following: 'nordvpn login'</p>
      <p>Open the url in a browser and follow the instructions</p>
      </PanelSectionRow>
    </PanelSection>
    </>);
  }

  if(loaded && installed && loggedIn) {
    return (
    <>
    <CountryList backend={backend} countries={countries} /> {/* A list containing all available countries */}
    </>);
  }

  if(!loaded) {
    return (<p>Please wait...</p>);
  }

  return (
    <>
    <p>Unknown error</p>
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
