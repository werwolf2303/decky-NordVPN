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
  Panel,
  showModal,
  SimpleModal,
  ConfirmModal
} from "decky-frontend-lib";
import { 
  VFC,
  useEffect,
  useState,
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
  const [ countries, setCountries ] = useState(String);
  const [ loaded, setLoaded ] = useState(false);
  const [ loggedIn, setLoggedIn] = useState(false);

  const loadNordVPN = async () => {
    try {
      const checkInstalled = await serverAPI.callPluginMethod("isInstalled", {});
      setInstalled(Boolean(checkInstalled.result));
      const countriesResult = await serverAPI.callPluginMethod("getCountries", {});
      setCountries(countriesResult.result.toString());
      const loggedInResult = await serverAPI.callPluginMethod("isLoggedIn", {});
      setLoggedIn(Boolean(loggedInResult.result))
      console.log("Penis: " + loggedIn)
    } catch(error) {
      console.info(error);
    }
    setLoaded(true);
  }

  useEffect(() => {
    loadNordVPN()
  }, []);

  function displayCities(countryName: any, e: MouseEvent) {
    serverAPI.callPluginMethod("getCities", countryName).then((response) => {
      var cities = response.result.toString().split(", ");
      showContextMenu(
       <Menu 
       label={"Available cities in " + countryName.toString()}
       cancelText="Close"
       onCancel={() => {displayCountries(e)}}
       >
        {cities.map(city => (
          <MenuItem onClick={() => {
            console.log("Is logged in: " + loggedIn)
            if(loggedIn) {
              connect(countryName, city);
            }else{
              showDialog("Can't connect you right now", "Please login before trying to connect");
            }
          }}>{city.split("_").join(" ")}</MenuItem>
        ))}
       </Menu>
      )
    })
  }

  async function displayCountries(e: MouseEvent) {
    showContextMenu(
      <Menu
      label="Available countries"
      cancelText="Close"
      onCancel={() => {}}
      >
        {countries.split(", ").map(country => (
          <MenuItem onClick={() => {displayCities({country}, e)}}>{country.split("_").join(" ")}</MenuItem>
        ))}
      </Menu>,
      e.currentTarget ?? window
    )
  }

  async function connect(countryName: string, cityName: string) {
    serverAPI.callPluginMethod("connect", [countryName, cityName])
  }

  function showDialog(title: string, message: string, okText: string = "Cancel", cancelText: string = "Ok") {
    showModal(
      <ConfirmModal
      strTitle={title}
      strDescription={message}
      strCancelButtonText={cancelText}
      strOKButtonText={okText}
      />
    )
  }

  if(!installed && loaded) {
    return (<PanelSection title="Error"><PanelSectionRow><p>!!!NordVPN binary is not installed!!!</p></PanelSectionRow></PanelSection>);
  }

  if(loaded 
    && installed 
    && countries.length > 0) {
    return (
    <><PanelSection title="Countries">
        <ButtonItem
          onClick={(e) => {
            displayCountries(e);
          }}
        >Available countries</ButtonItem>
      </PanelSection><PanelSection title="Test">
        <p>Is logged in: {loggedIn}</p>
      </PanelSection>
    </>);
  }

  if(!loaded) {
    return (<p>Please wait...</p>);
  }

  return (
    <><p>Unknown error</p></>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>NordVPNdeck</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
  };
});
