import { ReactElement, useEffect, useState, VFC} from "react";
import { BrowserContainer } from "./BrowserContainer";
import { Backend } from "../backend";
import { afterPatch, findClassModule, GamepadEvent, Focusable, Router} from "decky-frontend-lib"

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
    const [ browserObj, setBrowserObj] = useState(null);

    const asyncLoad = async() => {
        const url = await backend.login();
        const browser = Router.WindowStore?.GamepadUIMainWindowInstance?.CreateBrowserView("Test");
        window.browser = browser;
        browser.LoadURL(url);
        setBrowserObj(browser);
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