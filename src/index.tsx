import {
  Button,
  ButtonItem,
  definePlugin,
  DialogButton,
  Menu,
  MenuItem,
  Navigation,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  showContextMenu,
  staticClasses,
  Field,
  ToggleField,
  Panel
} from "decky-frontend-lib";
import { 
  VFC,
  useEffect,
  useState
} from "react";
import { FaShip } from "react-icons/fa";

import logo from "../assets/logo.png";

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
  // const [result, setResult] = useState<number | undefined>();

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };
  const [ installed, setInstalled ] = useState(false);
  const [ countries, setCountries ] = useState(Array<String>);

  const [ loaded, setLoaded ] = useState(false)

  const loadNordVPN = async () => {
    try {
      const checkInstalled = await serverAPI.callPluginMethod("isInstalled", {})
      setInstalled(Boolean(checkInstalled.result))
      const countriesResult = await serverAPI.callPluginMethod("getCountries", {})
      setCountries(countriesResult.result as Array<String>) 
      console.log("RAW Result of countries: " + countriesResult.result)
    } catch(error) {
      console.info(error)
    }
    setLoaded(true)
  }

  useEffect(() => {
    loadNordVPN()
  }, []);

  return (
    <>
    {/*{loaded && <PanelSection title="Countries">
      {countries.length > 0 && countries.map((country) => [
        <p>{country}</p>
      ])}
    </PanelSection>
    && <PanelSection>
      <p>Is NordVPN installed: {String(installed)}</p>
    </PanelSection>
    } */}
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>NordVPNdeck</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
  };
});
