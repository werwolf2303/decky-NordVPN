import { ReactElement } from "react";
import { Backend } from "../backend";
import { 
    PanelSection,
    ButtonItem,
    showContextMenu,
    Menu,
    MenuItem
} from "decky-frontend-lib";

export function CountryList({backend, countries}: {backend: Backend, countries: string}): ReactElement {
    function displayCities(countryName: string, countryNameMap: any, e: MouseEvent) {
        backend.getCities(countryNameMap).then((response) => {
          var cities = response.split(", ");
          showContextMenu(
           <Menu 
           label={"Available cities"}
           cancelText="Close"
           onCancel={() => {displayCountries(e)}}
           >
            {cities.map(city => (
              <MenuItem onClick={() => {
                backend.connect(countryName, city);
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
            <MenuItem onClick={() => {displayCities(country, {country}, e)}}>{country.split("_").join(" ")}</MenuItem>
          ))}
        </Menu>,
        e.currentTarget ?? window
      )
    }

    return (
        <PanelSection title="Countries">
        <ButtonItem
          layout="below"
          onClick={(e) => {
            displayCountries(e);
          }}
        >Available countries</ButtonItem>
      </PanelSection>
    );
}