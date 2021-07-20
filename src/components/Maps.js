import React, { useState } from "react";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Input, Button } from "antd";

function MapContainer(props) {
  const { latitude, longitude, address } = props;
  const [state, setState] = useState({
    address: address,
    selectedLat: latitude,
    selectedLng: longitude,
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  });
  
  function onclickOk() {
    props.clickOK(state);
  }

  function handleChange(address) {
    state.address = address;
    setState({ ...state });
  }

  function handleSelect(address) {
    geocodeByAddress(address)
      .then((results) => {
        getLatLng(results[0]).then((latLng) => {
          state.selectedLat = latLng.lat;
          state.selectedLng = latLng.lng;
          state.address = address;
          setState({ ...state });
        });
      })
      .catch((error) => console.error("Error", error));
  }

  return (
    <div id="googlemap">
      <PlacesAutocomplete
        value={state.address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="mapSearcher">
            <div>
              <Input
                size="large"
                {...getInputProps({
                  placeholder: "Search Places ...",
                  className: "location-search-input",
                })}
              />

              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              style={{ fontWeight: "bold", color: "#344ceb" }}
              onClick={() => onclickOk()}
            >
              Хадгалах
            </Button>
          </div>
        )}
      </PlacesAutocomplete>

      <Map
        google={props.google}
        initialCenter={{
          lat: state.selectedLat,
          lng: state.selectedLng,
        }}
        center={{
          lat: state.selectedLat,
          lng: state.selectedLng,
        }}
        containerStyle={{ position: "unset" }}
        // onClick={onMapClicked}
      >
        <Marker
          // onClick={onMarkerClick}
          name={"Current location"}
          position={{
            lat: state.selectedLat,
            lng: state.selectedLng,
          }}
        />
        <InfoWindow
          marker={state.activeMarker}
          visible={state.showingInfoWindow}
        >
          <div>
            <h1>{state.selectedPlace.name}</h1>
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDpObiL4cyKZ0Eprnatnow77n2fj4Ly1c4",
})(MapContainer);
