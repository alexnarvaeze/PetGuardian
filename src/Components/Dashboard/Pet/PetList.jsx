import React from "react";
import "./PetList.css";

const PetList = ({ pets }) => {
  if (pets.length === 0) {
    return <p>You have no pets added. Click the "+" button to add a pet!</p>;
  }

  return (
    <div className="pet-list">
      <h2>Your Pets</h2>
      {pets.map((pet, index) => (
        <div key={index} className="pet-card">
          <div>
            <h3>{pet.name}</h3>
            <div className="pet-details">
              {/* Only display values, without labels */}
              {pet.breed && <p>{pet.breed}</p>}
              {pet.age && <p>{pet.age} years</p>}
            </div>
          </div>
          {pet.image && (
            <div className="pet-image-container">
              <img src={pet.image} alt={`${pet.name}`} className="pet-image" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PetList;
