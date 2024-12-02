import React, { useState } from "react";
import AddPetModal from "./Pet/AddPetModal";
import "./Dashboard.css";
import SadDog from "../images/Sad-Dog.png"; // Import the sad dog image

const Dashboard = () => {
  const [pets, setPets] = useState([]); // State to hold pet list
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedPetIndex, setSelectedPetIndex] = useState(0); // State to track selected pet

  const handleAddPet = (petData) => {
    setPets([...pets, petData]); // Add new pet to the list
    setSelectedPetIndex(pets.length); // Select the new pet immediately after adding
    setIsModalOpen(false); // Close the modal after adding a pet
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
    <div className="dashboard-container">
      {/* Greeting Section */}
      <div className="dashboard-greeting">
        <h1>Hey</h1>
        <h1 className="username">Matthew</h1>
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
              <h1>{pets[selectedPetIndex].name}</h1>
              <h1>{pets[selectedPetIndex].breed}</h1>
              <h1>{pets[selectedPetIndex].weight} years</h1>
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
    </div>
  );
};

export default Dashboard;
