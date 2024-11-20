import React, { useState } from 'react'
import "../Medical/Medical.css"

// Helper function to calculate the "Next Due" date
const calculateNextDue = (dateReceived, intervalMonths) => {
  const receivedDate = new Date(dateReceived);
  receivedDate.setMonth(receivedDate.getMonth() + intervalMonths);
  return receivedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

function Medical() {

  // Define sections
  const sections = ["Vaccinations", "Bloodwork", "Medication"];
  // Track the current section index
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // State for lists in each section
  const [vaccinations, setVaccinations] = useState([
    { name: "Rabies", date: "2024-01-10" },
    { name: "Distemper", date: "2024-02-20" },
    { name: "Rabies", date: "2024-01-10" },
    { name: "Distemper", date: "2024-02-20" },
  ]);
  
  const [bloodwork, setBloodwork] = useState([
    { test: "CBC", date: "2024-03-15" },
    { test: "Liver Panel", date: "2024-04-05" },
  ]);
  
  const [medications, setMedications] = useState([
    { name: "Antibiotic", dosage: "5mg", date: "2024-05-10" },
    { name: "Painkiller", dosage: "10mg", date: "2024-06-01" },
  ]);

  // Define intervals in months for each vaccine type
  const vaccineIntervals = {
    Rabies: 36, // 3 years
    Distemper: 12, // 1 year
    Parvovirus: 12,
    Hepatitis: 12,
    // Add more vaccines as needed
  };

  // Move to the previous section
  const handlePrevious = () => {
    setCurrentSectionIndex((prevIndex) => 
      prevIndex === 0 ? sections.length - 1 : prevIndex - 1
    );
  };

  // Move to the next section
  const handleNext = () => {
    setCurrentSectionIndex((prevIndex) => 
      prevIndex === sections.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="medical-container">
      <div className="medical-card">
        <h3>{sections[currentSectionIndex]}</h3>
        <h4>Important Dates:</h4>
        <div className="medical-data">
        {currentSectionIndex === 0 && (
            vaccinations.map((vaccine, index) => (
              <div key={index} className="data-box">
                <strong>{vaccine.name}</strong>
                <p>Date Received: {vaccine.date}</p>
                <p>
                  Next Due:{" "}
                  {calculateNextDue(
                    vaccine.date,
                    vaccineIntervals[vaccine.name] || 12 // Default to 1 year if not specified
                  )}
                </p>
              </div>
            ))
          )}
         {currentSectionIndex === 1 && (
            bloodwork.map((test, index) => (
              <div key={index} className="data-box">
                <strong>{test.test}</strong>
                <p>Date: {test.date}</p>
              </div>
            ))
          )}
          {currentSectionIndex === 2 && (
            medications.map((med, index) => (
              <div key={index} className="data-box">
                <strong>{med.name}</strong>
                <p>Dosage: {med.dosage}</p>
                <p>Date: {med.date}</p>
              </div>
            ))
          )}
        </div>
        <div className="medical-buttons">
          <div>Add</div>
          <div>Edit</div>
        </div>
      </div>
      <div className="section-button-container">
        <div onClick={handlePrevious}>←</div>
        <div onClick={handleNext}>→</div>
      </div>
    </div>
  )
}

export default Medical