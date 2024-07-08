import { ReactElement, useEffect, useState, VFC} from "react";
import { BrowserContainer } from "./BrowserContainer";
import { Backend } from "../backend";
import { afterPatch, findClassModule, GamepadEvent, Focusable, Router, Navigation} from "decky-frontend-lib"

function BrowserViewRouter({backend}: {backend: Backend}): ReactElement {
    type BrowserClasses = Record<
    'duration-app-launch'
    | 'MainBrowserContainer'
    | 'ExternalBrowserContainer'
    | 'MicroTxnContainer'
    | 'Visible'
    | 'BrowserNavRoot'
    | 'MainBrowser'
    | 'URLBar'
    | 'StatusIcon'
    | 'NavigationButton'
    | 'Disabled'
    | 'Toggled'
    | 'URL'
    | 'URLInput'
    | 'InputSupportLevel'
    | 'showSupportLevel'
    | 'RequireTouchscreenLabel'
    | 'BrowserContainer'
    | 'Browser',
    string
    >;
    var navNode: any = null;
    const browserClasses = findClassModule(m => !!m['MainBrowserContainer']) as BrowserClasses;

    const getNavNode = (browserTabElement: any) => {
        if (!navNode) {
            afterPatch(browserTabElement.type, 'render', (_: any, ret: any) => {
                navNode = ret.props.value
                return ret
            }, { singleShot: true })
        }
    }

    useEffect(() => {
        return () => clearNavNode()
    }, [])

    const clearNavNode = () => {
        navNode = null
    }

    const [ loaded, setLoaded ] = useState(false);
    const [ browserObj, setBrowserObj ] = useState(null);

    const asyncLoad = async() => {
        const url = await backend.login();
        //@ts-ignore
        const browser = Router.WindowStore?.GamepadUIMainWindowInstance?.CreateBrowserView("DNVPNBrowserView");
        setBrowserObj(browser);
        browser.m_browserView.on("set-title", (title: string) => {
            const browserURL = browser.URL;
            if(browserURL.includes("https://auth.nordvpn.com/product/nordvpn/login/success?")) {
                try {
                console.log("Catched the callback URL");
                const login = async() => {
                    var craftedNordVPNEndpoint = "nordvpn://login?action=login&exchange_token=" + browserURL.split("&exchange_token=")[1] + "&status=done";
                    const returned = await backend.loginCallback(craftedNordVPNEndpoint);
                    console.log(returned);
                }
                login();
                Navigation.NavigateBack();
                browser.Destroy();
                backend.refreshCache();
                backend.getServerAPI().toaster.toast({ title: backend.getLanguage().translate("ui.login.error.toast.title"), body: backend.getLanguage().translate("ui.login.error.toast.msg") });
            }catch{
                backend.getServerAPI().toaster.toast({ title: backend.getLanguage().translate("ui.login.toast.title"), body: backend.getLanguage().translate("ui.login.toast.msg") });
            }
            }
        })
        browser.LoadURL(url);
        setLoaded(true);
    }

    useEffect(() => {
        asyncLoad();
    }, []);

    if(loaded) {
        const element = (
            <Focusable
            noFocusRing={true}
            onGamepadFocus={(evt: GamepadEvent) => {
                // @ts-ignore
                if (evt.target?.classList[0] !== browserClasses.BrowserContainer) { //prevents from triggering twice
                    setTimeout(() => {
                        // @ts-ignore
                        evt.detail.focusedNode?.m_rgChildren[0]?.BTakeFocus(3)
                    }, 1100)
                }
            }}

            //A button
            onOKButton={(evt: GamepadEvent) => {
                if (browserObj.m_gamepadBridge.GetGameInputSupportLevel().Value < 3) {
                    SteamClient.Input.ControllerKeyboardSetKeyState(88, true)
                    SteamClient.Input.ControllerKeyboardSetKeyState(88, false)
                }
            }}

            onButtonDown={(evt: GamepadEvent) => {
                if (evt.detail.button == 2) browserObj.Destroy();
            }}

            onGamepadDirection={(evt: GamepadEvent) => {
                if (browserObj.m_gamepadBridge.GetGameInputSupportLevel().Value < 3) {
                    switch (evt.detail.button) {
                        case 9:
                            //arrow up
                            SteamClient.Input.ControllerKeyboardSetKeyState(75, true)
                            SteamClient.Input.ControllerKeyboardSetKeyState(75, false)
                            break
                        case 10:
                            //arrow down
                            SteamClient.Input.ControllerKeyboardSetKeyState(78, true)
                            SteamClient.Input.ControllerKeyboardSetKeyState(78, false)
                            break
                        case 11:
                            //arrow left
                            SteamClient.Input.ControllerKeyboardSetKeyState(80, true)
                            SteamClient.Input.ControllerKeyboardSetKeyState(80, false)
                            break
                        case 12:
                            //arrow right
                            SteamClient.Input.ControllerKeyboardSetKeyState(79, true)
                            SteamClient.Input.ControllerKeyboardSetKeyState(79, false)
                    }
                }
            }}
        ><BrowserContainer
            browser={browserObj}
            className={browserClasses.ExternalBrowserContainer}
            visible={true}
            hideForModals={true}
            external={true}
            displayURLBar={false}
            autoFocus={false}
            ></BrowserContainer></Focusable>
        )
        getNavNode(element);
        return element;
    }

    return (
        <a>Loading</a>
    );
}

export { BrowserViewRouter }