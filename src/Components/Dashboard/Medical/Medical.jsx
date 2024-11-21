import React, { useState, useEffect } from "react";
import "../Medical/Medical.css";

const Medical = () => {
  const [currentSection, setCurrentSection] = useState(0); // Track which section is being viewed
  const [pets, setPets] = useState([]);
  const [bloodwork, setBloodwork] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [medications, setMedications] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    petId: "",
    testDate: "",
    notes: "",
    vaccineName: "",
    lastVaccineDate: "",
    nextVaccineDate: "",
    medicationName: "",
    frequency: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  const userId = 1; // Example: Replace with dynamic user ID, possibly from login context

  useEffect(() => {
    // Fetch pets on initial load
    fetch(`/api/pets/${userId}`)
      .then((response) => response.json())
      .then((data) => setPets(data))
      .catch((error) => console.error("Error fetching pets:", error));
  }, [userId]);

  useEffect(() => {
    // Fetch medical data when pets are loaded
    if (pets.length > 0) {
      const petId = pets[0].id; // Load data for the first pet by default
      fetch(`/api/bloodwork/${petId}`)
        .then((response) => response.json())
        .then((data) => setBloodwork(data))
        .catch((error) => console.error("Error fetching bloodwork:", error));

      fetch(`/api/vaccines/${petId}`)
        .then((response) => response.json())
        .then((data) => setVaccines(data))
        .catch((error) => console.error("Error fetching vaccines:", error));

      fetch(`/api/medications/${petId}`)
        .then((response) => response.json())
        .then((data) => setMedications(data))
        .catch((error) => console.error("Error fetching medications:", error));
    }
  }, [pets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = isEditing
      ? `/api/${
          currentSection === 0 ? "bloodwork" : currentSection === 1 ? "vaccines" : "medications"
        }/${currentItemId}`
      : `/api/${
          currentSection === 0 ? "bloodwork" : currentSection === 1 ? "vaccines" : "medications"
        }`;

    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        alert(`${isEditing ? "Updated" : "Added"} successfully!`);
        setFormData({
          petId: "",
          testDate: "",
          notes: "",
          vaccineName: "",
          lastVaccineDate: "",
          nextVaccineDate: "",
          medicationName: "",
          frequency: "",
        });
        setIsEditing(false);
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };

  const handleEdit = (itemId, section) => {
    setIsEditing(true);
    setCurrentItemId(itemId);

    if (section === "bloodwork") {
      const item = bloodwork.find((i) => i.id === itemId);
      setFormData({
        petId: item.pet_id,
        testDate: item.test_date,
        notes: item.notes,
      });
    } else if (section === "vaccines") {
      const item = vaccines.find((i) => i.id === itemId);
      setFormData({
        petId: item.pet_id,
        vaccineName: item.vaccine_name,
        lastVaccineDate: item.last_vaccine_date,
        nextVaccineDate: item.next_vaccine_date,
      });
    } else if (section === "medications") {
      const item = medications.find((i) => i.id === itemId);
      setFormData({
        petId: item.pet_id,
        medicationName: item.medication_name,
        frequency: item.frequency,
      });
    }
  };

  return (
    <div className="container">
      <h2>Medical Records</h2>

      {/* Section Buttons */}
      <div className="section-buttons">
        <button onClick={() => setCurrentSection(0)}>Bloodwork</button>
        <button onClick={() => setCurrentSection(1)}>Vaccines</button>
        <button onClick={() => setCurrentSection(2)}>Medications</button>
      </div>

      {/* Data Display */}
      <div className="section">
        {currentSection === 0 &&
          bloodwork.map((item) => (
            <div key={item.id}>
              <button onClick={() => handleEdit(item.id, "bloodwork")}>Edit</button>
              <p>{item.test_date}</p>
              <p>{item.notes}</p>
            </div>
          ))}
        {currentSection === 1 &&
          vaccines.map((item) => (
            <div key={item.id}>
              <button onClick={() => handleEdit(item.id, "vaccines")}>Edit</button>
              <p>{item.vaccine_name}</p>
              <p>Last Date: {item.last_vaccine_date}</p>
              <p>Next Date: {item.next_vaccine_date}</p>
            </div>
          ))}
        {currentSection === 2 &&
          medications.map((item) => (
            <div key={item.id}>
              <button onClick={() => handleEdit(item.id, "medications")}>Edit</button>
              <p>{item.medication_name}</p>
              <p>Frequency: {item.frequency}</p>
            </div>
          ))}
      </div>

      {/* Form to Add/Edit Records */}
      <form onSubmit={handleSubmit}>
        {currentSection === 0 && (
          <>
            <h3>Bloodwork Form</h3>
            <input
              type="date"
              name="testDate"
              value={formData.testDate}
              onChange={handleChange}
            />
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notes"
            />
          </>
        )}
        {currentSection === 1 && (
          <>
            <h3>Vaccine Form</h3>
            <input
              type="text"
              name="vaccineName"
              value={formData.vaccineName}
              onChange={handleChange}
              placeholder="Vaccine Name"
            />
            <input
              type="date"
              name="lastVaccineDate"
              value={formData.lastVaccineDate}
              onChange={handleChange}
              placeholder="Last Vaccine Date"
            />
            <input
              type="date"
              name="nextVaccineDate"
              value={formData.nextVaccineDate}
              onChange={handleChange}
              placeholder="Next Vaccine Date"
            />
          </>
        )}
        {currentSection === 2 && (
          <>
            <h3>Medication Form</h3>
            <input
              type="text"
              name="medicationName"
              value={formData.medicationName}
              onChange={handleChange}
              placeholder="Medication Name"
            />
            <input
              type="text"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              placeholder="Frequency"
            />
          </>
        )}
        <button type="submit">{isEditing ? "Update" : "Add"}</button>
      </form>
    </div>
  );
};

export default Medical;
