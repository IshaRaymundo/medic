import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { collection, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import db from './firebase.config'; // Importa la instancia de Firebase

import './login.css';

function MedicationTable() {
  const [medications, setMedications] = useState([]);
  const [medicationName, setMedicationName] = useState('');
  const [medicationDose, setMedicationDose] = useState('');
  const [medicationInterval, setMedicationInterval] = useState('');
  const [medicationDuration, setMedicationDuration] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedicationIndex, setCurrentMedicationIndex] = useState(null);

  // Obtener datos de Firestore al cargar el componente
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'medications'), (snapshot) => {
      setMedications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribe(); 
    };
  }, [db]);

  const addMedication = async () => {
    const newMedication = {
      name: medicationName,
      dose: medicationDose,
      interval: medicationInterval,
      duration: medicationDuration,
      taken: false,
      proximaToma: null,
      nextSuggestedTime: null,
    };

    // Agregar nuevo medicamento a Firestore
    const docRef = await addDoc(collection(db, 'medications'), newMedication);

    // Limpiar los campos después de agregar
    setMedicationName('');
    setMedicationDose('');
    setMedicationInterval('');
    setMedicationDuration('');

    // Actualizar localmente para evitar la necesidad de una nueva consulta a Firestore
    setMedications([...medications, { id: docRef.id, ...newMedication }]);
  };

  const toggleTaken = async (index) => {
    const medicationToUpdate = medications[index];

    // Registra la hora exacta de la toma en la fila actual
    const proximaToma = new Date();
    const nextSuggestedTime = calculateproximaToma(proximaToma, medicationToUpdate.interval);

    const updatedMedication = {
      ...medicationToUpdate,
      taken: !medicationToUpdate.taken,
      proximaToma: medicationToUpdate.taken ? null : proximaToma,
      nextSuggestedTime: medicationToUpdate.taken ? null : nextSuggestedTime,
    };

    // Actualiza el medicamento en Firestore
    const medicationRef = doc(db, 'medications', medicationToUpdate.id);
    await updateDoc(medicationRef, updatedMedication);

    // Actualiza localmente para reflejar los cambios sin necesidad de una nueva consulta a Firestore
    const updatedMedications = [...medications];
    updatedMedications[index] = updatedMedication;
    setMedications(updatedMedications);
  };

  const calculateproximaToma = (currentTime, interval) => {
    if (!currentTime) {
      // Si es la primera toma, toma la hora actual
      return new Date();
    } else {
      const proximaToma = new Date(currentTime);
      proximaToma.setHours(proximaToma.getHours() + interval*13);
      return proximaToma;
    }
  };

  const formatTime = (time) => {
    if (time instanceof Date) {
      const options = { hour: 'numeric', minute: 'numeric', hour12: true };
      return time.toLocaleTimeString(undefined, options);
    } else {
      return '-';
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="login-card">
      <h2>CUADRO DE MEDICAMENTOS</h2>
      <button onClick={openModal}>Agregar Medicamento</button>

      <Modal
        className="modal"
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Medicamento"
      >
        <h2 className="modal-content">Agregar Medicamento</h2>
        <form>
          <input
            type="text"
            placeholder="Nombre del Medicamento"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dosis"
            value={medicationDose}
            onChange={(e) => setMedicationDose(e.target.value)}
          />
          <input
            type="number"
            placeholder="Intervalo (en horas)"
            value={medicationInterval}
            onChange={(e) => setMedicationInterval(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duración (en días)"
            value={medicationDuration}
            onChange={(e) => setMedicationDuration(e.target.value)}
          />
          <br></br>
          <button type="button" onClick={addMedication}>
            Agregar
          </button>
          <br></br>
          <button onClick={closeModal}>Listo!</button>
        </form>
      </Modal>

      <div className="table-card">
        <table className="medication-table">
          <thead>
            <tr>
              <th></th>
              <th>Nombre del Medicamento</th>
              <th>Dosis</th>
              <th>Intervalo (hrs)</th>
              <th>Tomada</th>
              <th>Hora de Toma</th>
              <th>Sugerencia de Siguiente Toma</th>
            </tr>
          </thead>
          <tbody className="tablita">
            {medications.map((medication, index) => (
              <tr key={index}>
                <td className="medication-table th">
                  {<img src="https://cdn-icons-png.flaticon.com/512/4503/4503242.png" alt="" />}
                </td>
                <td>{medication.name}</td>
                <td>{medication.dose}</td>
                <td>{medication.interval}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={medication.taken}
                    onChange={() => {
                      setCurrentMedicationIndex(index);
                      toggleTaken(index);
                    }}
                  />
                </td>
                <td>
                  {medication.taken ? (medication.proximaToma ? formatTime(medication.proximaToma) : null) : null}
                </td>
                <td>{medication.nextSuggestedTime ? formatTime(medication.nextSuggestedTime) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MedicationTable;