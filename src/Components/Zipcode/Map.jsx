import React, { useState, useRef } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
// Styling for the map container
const mapContainerStyle = {
 width: "100%",
 height: "400px",
};


const GoogleMapsComponent = () => {
 // Load Google Maps API and Places Library
 const { isLoaded } = useLoadScript({
   googleMapsApiKey: "",
   libraries: ["places"],
 });
 const mapRef = useRef(null); // Reference for the map instance
 const [zipcode, setZipcode] = useState("");
 const [animalHospitals, setAnimalHospitals] = useState([]);
 const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });


// Fetch nearby animal hospitals using PlacesService
 const fetchAnimalHospitals = (lat, lng) => {
   if (!mapRef.current) return;


   const service = new window.google.maps.places.PlacesService(mapRef.current);
   const request = {
     location: new window.google.maps.LatLng(lat, lng),
     radius: 5000, // 5 km radius
     type: "veterinary_care", // Filter for animal hospitals
   };


   service.nearbySearch(request, (results, status) => {
     if (status === window.google.maps.places.PlacesServiceStatus.OK) {
       setAnimalHospitals(results); // Update state with the results
     } else {
       console.error("Places Service failed:", status);
     }
   });
 };
// Handle user search by zipcode
 const handleSearch = async () => {
   const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=`;

   try {
     const geocodeResponse = await fetch(geocodeUrl);
     const geocodeData = await geocodeResponse.json();


     if (geocodeData.results.length > 0) {
       const location = geocodeData.results[0].geometry.location;
       setMapCenter(location);
       fetchAnimalHospitals(location.lat, location.lng);// Fetch vets near location 


     } else {
       alert("Invalid zipcode. Please try again.");
     }
   } catch (error) {
     console.error("Error fetching data:", error);
   }
 };


 if (!isLoaded) return <div>Loading...</div>; // Show a loading message


 return (
   <div>
     <h2>Find Nearby Animal Hospitals</h2>
     <input
       type="text"
       placeholder="Enter Zipcode"
       value={zipcode}
       onChange={(e) => setZipcode(e.target.value)}
     />
     <button onClick={handleSearch}>Search</button>


     <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={mapCenter}
          onLoad={(map) => {
            mapRef.current = map;
            console.log("Map Loaded:", map);
          }}
        >
        {animalHospitals.map((hospital, index) => {
          const location = hospital.geometry.location;
          console.log("Adding Marker for:", location);
          return (
            <Marker
              key={index}
              position={{
                lat: location.lat(),
                lng: location.lng(),
              }}
              title={hospital.name}
            />
          );
        })}
     </GoogleMap>

     <ul>
       {animalHospitals.map((hospital, index) => (
         <li key={index}>
           <strong>{hospital.name}</strong>
           <p>{hospital.vicinity}</p>
         </li>
       ))}
     </ul>
   </div>
 );
};


export default GoogleMapsComponent;
