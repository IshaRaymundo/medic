import React, { useState, useEffect, useRef } from "react";
import { FaSun, FaMoon, FaClock } from "react-icons/fa";
import { MdRotateRight } from "react-icons/md";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MedicationChart.css";
import NavigationBar from "./Navbar";
import MedicationModal from "./Modal";

const MedicationChart = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [medicamentosOptions, setMedicamentosOptions] = useState([]);
  const [suggestedMedicamentos, setSuggestedMedicamentos] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const timerRef = useRef(null);

  const [descriptions, setDescriptions] = useState({});

  const calculateHorario = (horaInicio) => {
    if (!horaInicio) return "Unknown";

    const [hour, minute] = horaInicio.split(":").map(Number);

    if (hour >= 6 && (hour < 12 || (hour === 12 && minute === 0)))
      return "Morning";
    else if (hour >= 12 && (hour < 16 || (hour === 16 && minute === 0)))
      return "Noon";
    else if (hour >= 16 && (hour < 19 || (hour === 19 && minute === 0)))
      return "Evening";
    else return "Night";
  };

  const calculateHorarioActual = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 12) return "Morning";
    if (currentHour >= 12 && currentHour < 16) return "Noon";
    if (currentHour >= 16 && currentHour < 19) return "Evening";
    return "Night";
  };

  const calculateNextDose = (horaInicio, frecuencia, horaTomado) => {
    if (!horaInicio || !frecuencia) return null;
    const [hour, minute] = horaInicio.split(":").map(Number);
    const currentDate = new Date();

    let nextDoseTime;
    if (horaTomado) {
      // Si ya se tomó, calcular la siguiente dosis desde la última hora tomada
      nextDoseTime = new Date(horaTomado);
    } else {
      // Si no se tomó, calcular la siguiente dosis desde la hora de inicio
      nextDoseTime = new Date(currentDate);
      nextDoseTime.setHours(hour);
      nextDoseTime.setMinutes(minute);
    }

    while (nextDoseTime <= currentDate) {
      nextDoseTime.setHours(nextDoseTime.getHours() + frecuencia);
    }

    return nextDoseTime;
  };

  const updateNextDoseTime = (medication, horarioActual) => {
    if (medication) {
      const nextDoseTime = calculateNextDose(
        medication.horaInicio,
        parseInt(medication.frecuencia),
        medication.horaTomado
      );

      setMedicamentos((prevMedicamentos) =>
        prevMedicamentos.map((med) => {
          if (med.nombre === medication.nombre) {
            return {
              ...med,
              nextDoseTime,
              horario: calculateHorario(medication.horaInicio),
            };
          }
          return med;
        })
      );

      if (nextDoseTime) {
        const currentTime = new Date();
        const timeUntilNextDose = nextDoseTime - currentTime;

        if (timeUntilNextDose > 0) {
          timerRef.current = setTimeout(() => {
            updateNextDoseTime(medication, horarioActual);
          }, timeUntilNextDose);
        }
      }
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8084/obtenerNombreMedicamentos")
      .then((respuesta) => {
        const nombresMedicamentos = respuesta.data.nombresMedicamentos;
        setMedicamentosOptions(nombresMedicamentos);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const horarioActual = calculateHorarioActual();

    medicamentos.forEach((medication) => {
      if (medication.nextDoseTime) {
        const currentTime = new Date();
        const timeUntilNextDose = medication.nextDoseTime - currentTime;

        if (timeUntilNextDose > 0) {
          timerRef.current = setTimeout(() => {
            updateNextDoseTime(medication, horarioActual);
          }, timeUntilNextDose);
        }
      }
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [medicamentos]);

  const handleInputChange = (event, name) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  
    const suggestions = medicamentosOptions || [];
    if (typeof value === "string") {
      const filteredSuggestions = suggestions.filter(
        (med) => med && med.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedMedicamentos(filteredSuggestions);
    }
  
    const requiredFields = [
      "nombre",
      "dosis",
      "frecuencia",
      "duracion",
      "horaInicio",
    ];
    const allRequiredFieldsFilled = requiredFields.every(
      (field) => !!inputValues[field]
    );
    setIsSaveDisabled(!allRequiredFieldsFilled);
  
    if (name === "tomado" && !value) {
      setMedicamentos((prevMedicamentos) =>
        prevMedicamentos.map((medItem) =>
          medItem.nombre === inputValues.nombre
            ? { ...medItem, tomado: false, horaTomado: "" }
            : medItem
        )
      );
    }
  };

  const handleCheckboxChange = (med) => {
    const horaTomado = new Date().toLocaleTimeString();
    setMedicamentos((prevMedicamentos) =>
      prevMedicamentos.map((medItem) =>
        medItem.nombre === med.nombre
          ? {
              ...medItem,
              tomado: !medItem.tomado,
              horaTomado: medItem.tomado ? "" : horaTomado,
            }
          : medItem
      )
    );
  };

  const handleSaveMedication = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const nextDoseTime = calculateNextDose(
      inputValues.horaInicio,
      parseInt(inputValues.frecuencia),
      inputValues.horaTomado
    );

    const horarioActual = calculateHorarioActual();

    const horaDeAgregado = new Date().toLocaleTimeString();

    const newMedication = {
      nombre: inputValues.nombre || "",
      dosis: inputValues.dosis || "",
      frecuencia: inputValues.frecuencia || "",
      duracion: inputValues.duracion || "",
      comentarios: inputValues.comentarios || "",
      horaInicio: inputValues.horaInicio || "",
      soloParaMalestar: inputValues.soloParaMalestar || false,
      nextDoseTime,  // No olvides actualizar este campo
      horario: horarioActual,
      horaDeAgregado,
      tomado: false,
      horaTomado: "",  // Este campo es importante para almacenar la hora de la última dosis tomada
    };

    if (newMedication.soloParaMalestar) {
      newMedication.horario = "Only when I need it";
    } else if (nextDoseTime) {
      updateNextDoseTime(newMedication, horarioActual);
    }

    setMedicamentos([...medicamentos, newMedication]);
    setShowModal(false);
    setInputValues({});
    setIsSaveDisabled(true);
  };

  const timeData = [
    {
      label: "Morning",
      icon: <FaSun style={styles.timeIcon} />,
      color: "#FFDDDD",
    },
    {
      label: "Noon",
      icon: <FaClock style={styles.timeIcon} />,
      color: "#FFE8DD",
    },
    {
      label: "Evening",
      icon: <FaSun style={styles.timeIcon} />,
      color: "#DDF2E8",
    },
    {
      label: "Night",
      icon: <FaMoon style={styles.timeIcon} />,
      color: "#DDE7F2",
    },
    {
      label: "Only when I need it",
      icon: <MdRotateRight style={styles.rotateIcon} />,
      color: "#E4E4E4",
    },
  ];

  return (
    <>
      <NavigationBar />
      <div className="container">
        <div className="header">CUADRO DE MEDICAMENTOS</div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Agregar Medicamento
        </Button>
        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th className="th"></th>
                {[
                  "Medications",
                  "Dosage",
                  "Frequency",
                  "Duration",
                  "Comments",
                  "Time Taken",
                  "Taken",
                  "Next Dose", // Agregado
                ].map((header) => (
                  <th className="th" key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {timeData.map((time) => (
  <tr key={time.label}>
    <td style={{ ...styles.td, background: time.color }}>
      {time.icon}
      <span style={{ color: "#555555", fontWeight: "bold" }}>
        {time.label}
      </span>
    </td>
    {[
      "nombre",
      "dosis",
      "frecuencia",
      "duracion",
      "comentarios",
      "Time Taken",
      "Taken",
      "Next Dose",
    ].map((field) => (
      <td key={field} style={{ ...styles.td, background: time.color }}>
        {medicamentos
          .filter((med) => med.horario === time.label)
          .map((med, index) => (
            <div key={index} style={styles.column}>
              {field === "comentarios" && med.nombre in descriptions ? (
                `${med[field]}\n\n${descriptions[med.nombre]}`
              ) : field === "Next Dose" && med.horaInicio && med.frecuencia ? (
                (() => {
                  const nextDoseTime = calculateNextDose(
                    med.horaInicio,
                    parseInt(med.frecuencia),
                    med.horaTomado
                  );
                  const formattedNextDoseTime =
                    nextDoseTime && nextDoseTime.toLocaleTimeString();
                  return formattedNextDoseTime || "Unknown";
                })()
              ) : field === "Time Taken" ? (
                med.horaTomado
              ) : field === "Taken" ? (
                <Form.Check
                  type="checkbox"
                  checked={med.tomado}
                  onChange={() => handleCheckboxChange(med)}
                />
              ) : (
                field === "Next Dose" ? (
                  med.nextDoseTime && med.nextDoseTime.toLocaleTimeString() // Mostrar la hora de la siguiente dosis
                ) : (
                  med[field]
                )
              )}
            </div>
          ))}
      </td>
    ))}
  </tr>
))}
            </tbody>
          </table>
        </div>
        <MedicationModal
          showModal={showModal}
          setShowModal={setShowModal}
          inputValues={inputValues}
          suggestedMedicamentos={suggestedMedicamentos}
          isSaveDisabled={isSaveDisabled}
          handleInputChange={handleInputChange}
          handleSaveMedication={handleSaveMedication}
          medicamentosOptions={medicamentosOptions}
        />
      </div>
    </>
  );
};

const styles = {
  timeIcon: {
    marginRight: "10px",
    verticalAlign: "middle",
  },
  rotateIcon: {
    marginRight: "10px",
    verticalAlign: "middle",
  },
  td: {
    padding: "10px",
    textAlign: "center",
  },
  column: {
    marginBottom: "5px",
  },
};
export default MedicationChart;