import React, { useState } from "react";
import "./AddPetForm.css";

const AddPetForm = ({ onAddPet, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    species: "Dog", // Default to Dog, but can be changed
    breed: "",
    weight: "",
    age: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPet(formData); // Pass pet data up to the Dashboard
    onClose(); // Close the form modal
  };

  return (
    <div className="add-pet-form">
      <form onSubmit={handleSubmit}>
        <h2>Add New Pet</h2>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Species:
          <select name="species" value={formData.species} onChange={handleChange}>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>
        </label>
        <label>
          Breed:
          <input type="text" name="breed" value={formData.breed} onChange={handleChange} />
        </label>
        <label>
          Weight (lbs):
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
        </label>
        <label>
          Age (years):
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
        </label>
        <button type="submit">Add Pet</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default AddPetForm;
