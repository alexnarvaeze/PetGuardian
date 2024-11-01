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
          <h3>{pet.name}</h3>
          <p>Species: {pet.species}</p>
          <p>Breed: {pet.breed}</p>
          <p>Weight: {pet.weight} lbs</p>
          <p>Age: {pet.age} years</p>
        </div>
      ))}
    </div>
  );
};

export default PetList