import React, { useState, useEffect } from "react";
import "../Medical/Medical.css";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Base API URL

const Medical = () => {
  const [currentSection, setCurrentSection] = useState(0); // Track which section is being viewed
  const [bloodwork, setBloodwork] = useState([]); // Store bloodwork records
  const [vaccines, setVaccines] = useState([]); // Store vaccines records
  const [medications, setMedications] = useState([]); // Store medications records
  const [pets, setPets] = useState([]); // Store pets list
  const [formData, setFormData] = useState({
    petId: "", 
    date: "",
    notes: "",
    medicationName: "", // Name of the medication
    dosage: "",         // Dosage of the medication
    startDate: "",      // Start date of the medication
    endDate: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Track whether we are editing an existing record

  // Fetch data when the component mounts or when the section is switched
  useEffect(() => {
    if (currentSection === 0) {
      axios
        .get(`${API_URL}/bloodwork`)
        .then((response) => {
          setBloodwork(response.data);
        })
        .catch((error) => {
          console.error("Error fetching bloodwork records:", error);
        });
    } else if (currentSection === 1) {
      axios
        .get(`${API_URL}/vaccine`)
        .then((response) => {
          setVaccines(response.data);
        })
        .catch((error) => {
          console.error("Error fetching vaccine records:", error);
        });
    } else if (currentSection === 2) {
      axios
        .get(`${API_URL}/medications`)
        .then((response) => {
          setMedications(response.data);
        })
        .catch((error) => {
          console.error("Error fetching medication records:", error);
        });
    }

    // Fetch pets data for the dropdown
    axios
      .get(`${API_URL}/pets`)
      .then((response) => {
        setPets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pets data:", error);
      });
  }, [currentSection]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to add or update records
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.petId) {
      return alert("Date and Pet selection are required");
    }

    // Check if we are editing or adding a new record
    if (isEditing) {
      if (currentSection === 0) {
        // Update bloodwork
        axios
          .put(`${API_URL}/bloodwork/${formData.id}`, formData)
          .then((response) => {
            setBloodwork((prevBloodwork) =>
              prevBloodwork.map((item) =>
                item.bloodwork_id === formData.id ? response.data : item
              )
            );
            setFormData({petId: "", date: "", notes: ""});
            setIsEditing(false);
          })
          .catch((error) => {
            console.error("Error updating bloodwork record:", error);
          });
      } else if (currentSection === 1) {
        // Update vaccine
        axios
          .put(`${API_URL}/vaccine/${formData.id}`, formData)
          .then((response) => {
            setVaccines((prevVaccines) =>
              prevVaccines.map((item) =>
                item.vaccine_id === formData.id ? response.data : item
              )
            );
            setFormData({petId: "", date: "", notes: ""});
            setIsEditing(false);
          })
          .catch((error) => {
            console.error("Error updating vaccine record:", error);
          });
      } else if (currentSection === 2) {
        // Update medication
        axios
          .put(`${API_URL}/medications/${formData.id}`, formData)
          .then((response) => {
            setMedications((prevMedications) =>
              prevMedications.map((item) =>
                item.medication_id === formData.id ? response.data : item
              )
            );
            setFormData({petId: "", date: "", notes: ""});
            setIsEditing(false);
          })
          .catch((error) => {
            console.error("Error updating medication record:", error);
          });
      }
    } else {
      if (currentSection === 0) {
        // Add new bloodwork
        axios
          .post(`${API_URL}/bloodwork`, formData)
          .then((response) => {
            setBloodwork((prevBloodwork) => [...prevBloodwork, response.data]);
            setFormData({petId: "", date: "", notes: ""});
          })
          .catch((error) => {
            console.error("Error adding bloodwork record:", error);
          });
      } else if (currentSection === 1) {
        // Add new vaccine
        axios
          .post(`${API_URL}/vaccine`, formData)
          .then((response) => {
            setVaccines((prevVaccines) => [...prevVaccines, response.data]);
            setFormData({petId: "", date: "", notes: "", vaccine: ""});
          })
          .catch((error) => {
            console.error("Error adding vaccine record:", error);
          });
      } else if (currentSection === 2) {
      // Add new medication
        axios
          .post(`${API_URL}/medications`, formData)
          .then((response) => {
            setMedications((prevMedications) => [...prevMedications, response.data]);
            // Reset formData to include the updated fields
            setFormData({
              petId: "",
              medicationName: "",
              dosage: "",
              startDate: "",
              endDate: "",
            });
          })
          .catch((error) => {
            console.error("Error adding medication record:", error);
          });
      }
    }
  };

  // Handle editing a record
  const handleEdit = (id) => {
    if (currentSection === 0) {
      const recordToEdit = bloodwork.find((item) => item.bloodwork_id === id);
      setFormData({
        id: recordToEdit.bloodwork_id,
        date: recordToEdit.date,
        notes: recordToEdit.notes || "",
        petId: recordToEdit.pet_id,
      });
    } else if (currentSection === 1) {
      const recordToEdit = vaccines.find((item) => item.vaccine_id === id);
      setFormData({
        id: recordToEdit.vaccine_id,
        date: recordToEdit.date,
        notes: recordToEdit.notes || "",
        petId: recordToEdit.pet_id,
      });
    } else if (currentSection === 2) {
      const recordToEdit = medications.find((item) => item.medication_id === id);
      setFormData({
        id: recordToEdit.medication_id,
        medicationName: recordToEdit.medication_name, // Updated field
        dosage: recordToEdit.dosage, // Updated field
        startDate: recordToEdit.start_date, // Updated field
        endDate: recordToEdit.end_date || "", // Optional field
        petId: recordToEdit.pet_id,
      });
    }
    setIsEditing(true);
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
        {/* Bloodwork Section */}
        {currentSection === 0 && (
          <>
            <h3>Bloodwork Records</h3>
            {bloodwork.length === 0 ? (
              <p>No bloodwork records found.</p>
            ) : (
              bloodwork.map((item) => (
                <div key={item.bloodwork_id} className="record">
                  {/* <button onClick={() => handleEdit(item.bloodwork_id)}>Edit</button> */}
                  <p><strong>Name:</strong> {item.petId}</p>
                  <p><strong>Date:</strong> {item.date}</p>
                  <p><strong>Notes:</strong> {item.notes || "No notes"}</p>
                </div>
              ))
            )}
            <h3>{isEditing ? "Edit Bloodwork" : "Add Bloodwork"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes"
              />
              <select
                name="petId"
                value={formData.petId}
                onChange={handleChange}
              >
                <option value="">Select Pet</option>
                {pets.map((pet) => (
                  <option key={pet.pet_id} value={pet.pet_id}>
                    {pet.name}
                  </option>
                ))}
              </select>
              <button type="submit">{isEditing ? "Update" : "Add"}</button>
            </form>
          </>
        )}

        {/* Vaccines Section */}
        {currentSection === 1 && (
          <>
            <h3>Vaccines Records</h3>
            {vaccines.length === 0 ? (
              <p>No vaccine records found.</p>
            ) : (
              vaccines.map((item) => (
                <div key={item.vaccine_id} className="record">
                  {/* <button onClick={() => handleEdit(item.vaccine_id)}>Edit</button> */}
                  <p><strong>Name:</strong> {item.petId}</p>
                  <p><strong>Vaccine:</strong> {item.vaccine}</p>
                  <p><strong>Date:</strong> {item.date}</p>
                  <p><strong>Notes:</strong> {item.notes || "No notes"}</p>
                </div>
              ))
            )}
            <h3>{isEditing ? "Edit Vaccine" : "Add Vaccine"}</h3>
            <form onSubmit={handleSubmit}>
              <select
                name="vaccine"
                value={formData.vaccine}
                onChange={handleChange}
                required
              >
                <option value="">Select Vaccine</option>
                <option value="Rabies">Rabies</option>
                <option value="Distemper">Distemper</option>
                <option value="Parvovirus">Parvovirus</option>
                <option value="Hepatitis">Hepatitis</option>
                <option value="Leptospirosis">Leptospirosis</option>
                <option value="Feline Herpesvirus">Feline Herpesvirus</option>
                <option value="Feline Calicivirus">Feline Calicivirus</option>
                <option value="Feline Panleukopenia">Feline Panleukopenia</option>
              </select>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes (optional)"
              />
              <select
                name="petId"
                value={formData.petId}
                onChange={handleChange}
                required
              >
                <option value="">Select Pet</option>
                {pets.map((pet) => (
                  <option key={pet.pet_id} value={pet.pet_id}>
                    {pet.name}
                  </option>
                ))}
              </select>
              <button type="submit">{isEditing ? "Update" : "Add"}</button>
            </form>
          </>
        )}
        {/* Medications Section */}
        {currentSection === 2 && (
          <>
            <h3>Medications Records</h3>
            {medications.length === 0 ? (
              <p>No medication records found.</p>
            ) : (
              medications.map((item) => (
                <div key={item.id} className="record">
                  {/* <button onClick={() => handleEdit(item.id)}>Edit</button> */}
                  <p><strong>Name:</strong> {item.petId}</p>
                  <p><strong>Medication Name:</strong> {item.medicationName}</p>
                  <p><strong>Dosage:</strong> {item.dosage}</p>
                  <p><strong>Start Date:</strong> {item.startDate}</p>
                  <p><strong>End Date:</strong> {item.endDate || "Ongoing"}</p>
                  <p><strong>Notes:</strong> {item.notes || "No notes"}</p>
                </div>
              ))
            )}
            <h3>{isEditing ? "Edit Medication" : "Add Medication"}</h3>
            <form onSubmit={handleSubmit}>
              <select
                name="petId"
                value={formData.petId}
                onChange={handleChange}
                required
              >
                <option value="">Select Pet</option>
                {pets.map((pet) => (
                  <option key={pet.pet_id} value={pet.pet_id}>
                    {pet.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="medicationName"
                value={formData.medicationName}
                onChange={handleChange}
                placeholder="Medication Name"
                required
              />
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="Dosage (e.g., 50mg)"
                required
              />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes (optional)"
              />
              <button type="submit">{isEditing ? "Update" : "Add"}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Medical;

