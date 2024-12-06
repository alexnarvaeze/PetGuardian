import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import AddPetModal from "./Pet/AddPetModal";
import "./Dashboard.css";
import SadDog from "../images/Sad-Dog.png"; // Import the sad dog image
import Medical from "./Medical/Medical";
import GoogleMapsComponent from "../Zipcode/Map";

const API_URL = "http://localhost:5000/api"; // Base API URL

const Dashboard = () => {
  const [username, setUsername] = useState(""); // State to hold pet list
  const [pets, setPets] = useState([]); // State to hold pet list
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedPetIndex, setSelectedPetIndex] = useState(0); // State to track selected pet
  const [loading, setLoading] = useState(true); // Loading state for username

    // Fetch username and pets when the component is first rendered
    useEffect(() => {
      const fetchUsernameAndPets = async () => {
        try {
          // Fetch username
          const usernameResponse = await axios.get(`${API_URL}/user`);
          setUsername(usernameResponse.data.name); // Assuming the response has a 'name' field
  
          // Fetch pets
          const petsResponse = await axios.get(`${API_URL}/pets`);
          setPets(petsResponse.data); // Set the list of pets
  
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false); // Set loading to false once data is fetched
        }
      };
      fetchUsernameAndPets();
    }, []);
  

    const handleAddPet = async (petData) => {
      try {
        // Send a POST request to your backend to add the new pet
        const response = await axios.post(`${API_URL}/pets`, petData);
        
        const petsResponse = await axios.get(`${API_URL}/pets`)
        // Update the pets state with the new pet
        setPets(petsResponse.data);

        setSelectedPetIndex(petsResponse.data.length - 1);
    
        setIsModalOpen(false); // Close the modal after adding a pet
      } catch (error) {
        console.error("Error adding pet:", error);
        // Handle any errors here (e.g., show a notification or error message)
      }
    };

  const handlePetSelection = (index) => {
    setSelectedPetIndex(index); // Set the selected pet by index
  };


  const handleNextPet = () => {
    setSelectedPetIndex((prevIndex) =>
      prevIndex === pets.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevPet = () => {
    setSelectedPetIndex((prevIndex) =>
      prevIndex === 0 ? pets.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="dashboard-container" id="pets">
      {/* Greeting Section */}
      <div className="dashboard-greeting">
        <h1 className="username">Hello {username},</h1>
      </div>

      {/* Pets View */}
      {pets.length === 0 ? (
        <div className="no-pets-view">
          <img src={SadDog} alt="Cute Dog" className="dog-image" />
          <div className="no-pets-info">
            <p>You have no pets, add one!</p>
            <button
              className="add-pet-button"
              onClick={() => setIsModalOpen(true)}
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <div className="pets-view">
          <div className="pet-card">
            <div className="pet-text">
              <h1 style={{fontSize:"35px", fontWeight:"500"}}>{pets[selectedPetIndex].name}</h1>
              <h1 style={{fontSize:"30px", fontWeight:"300"}}>Breed: {pets[selectedPetIndex].breed}</h1>
              <h1 style={{fontSize:"30px", fontWeight:"300"}}>Age: {pets[selectedPetIndex].weight} yrs Old</h1>
            </div>
            <div className="pet-pic">
              <img
                className="pet-image"
                src={pets[selectedPetIndex].image}
                alt=""
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      {pets.length > 0 && (
        <div className="pet-navigation">
          <button className="nav-button" onClick={handlePrevPet}>
            Previous
          </button>
          <button className="nav-button" onClick={handleNextPet}>
            Next
          </button>
          <button
            className="add-pet-button"
            onClick={() => setIsModalOpen(true)}
          >
            Add Another Pet
          </button>
        </div>
      )}

      {/* Modal for Adding a Pet */}
      <AddPetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPet={handleAddPet}
      />
      <section id="medical">
        <Medical/>
      </section>
      {/* Zipcode Finder Section*/}
      <section className="zipcode-finder-section" id="vet-finder">
        <GoogleMapsComponent />
      </section>
    </div>
  );
};

export default Dashboard;
