// src/Components/AddPetModal/AddPetModal.jsx
import React, { useState } from "react";
import "./AddPetModal.css";

const AddPetModal = ({ isOpen, onClose, onAddPet }) => {
  const [petData, setPetData] = useState({
    name: "",
    species: "",
    breed: "",
    weight: "",
    age: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPet(petData);
    onClose(); // Close the modal after adding pet
    setPetData({ name: "", species: "", breed: "", weight: "", age: "" }); // Reset form
  };

  if (!isOpen) return null; // Don't render anything if the modal isn't open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Pet</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={petData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="species"
            placeholder="Species (Dog/Cat)"
            value={petData.species}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="breed"
            placeholder="Breed"
            value={petData.breed}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="weight"
            placeholder="Weight (lbs)"
            value={petData.weight}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age (years)"
            value={petData.age}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Pet</button>
        </form>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddPetModal;
