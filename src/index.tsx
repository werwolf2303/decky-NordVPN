import {
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
  TextField,
} from "decky-frontend-lib";
import { 
  VFC,
  useEffect
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

  const loadNordVPN = async () => {
    try {
      const checkInstalled = await serverAPI.callPluginMethod("isInstalled", {})
      if(checkInstalled.result) {

      }
    } catch(error) {
      console.error(error)
    }
  }

  const isInstalled = async () => {
    await serverAPI.callPluginMethod("isInstalled", {})
  }

  useEffect(() => {
    loadNordVPN();
  }, [])

  return (
    <PanelSection title="Test">
      <PanelSectionRow>
        <TextField>NordVPN installed: {isInstalled}</TextField>
      </PanelSectionRow>
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>NordVPNdeck</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
  };
});
