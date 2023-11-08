import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaClock } from 'react-icons/fa';
import { MdRotateRight } from 'react-icons/md';
import axios from 'axios';
import Modal from './Modal';
import { FaPlus } from 'react-icons/fa'; 
import Navbar from './Navbar';



<Navbar></Navbar>
const Tabla = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [inputValues, setInputValues] = useState({});
    const [activeCell, setActiveCell] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8083/obtenerMedicamentos')
            .then(respuesta => {
                setMedicamentos(respuesta.data.medicamentos);
            })
            .catch(error => console.log(error));
    }, []);

    const searchMedicamento = (query) => {
        return medicamentos.filter(medicamento => medicamento.nombre.toLowerCase().includes(query.toLowerCase()));
    };

    const handleInputChange = (event, header, timeLabel, idx) => {
        const value = event.target.value;
        const cellKey = `${header}${timeLabel}${idx}`;
        setInputValues(prevValues => ({
            ...prevValues,
            [cellKey]: value
        }));
    };

    const selectMedicamento = (medicamento, header, timeLabel, idx) => {
        const cellKey = `${header}${timeLabel}${idx}`;
        setInputValues(prevValues => ({
            ...prevValues,
            [cellKey]: medicamento.nombre
        }));
        setActiveCell(null);
    };

    const matchedMedicamentos = activeCell ? searchMedicamento(inputValues[activeCell]) : [];

    const styles = {
        container: {
            padding: '20px',
        },
        title: {
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#00A6A4',
            textAlign: 'center',
            textTransform: 'uppercase',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            margin: '0 auto',
        },
        th: {
            padding: '10px',
            borderBottom: '1px solid #E0E0E0',
            textAlign: 'left',
            fontWeight: 'bold',
            color: '#777777',
        },
        td: {
            padding: '10px',
            borderBottom: '1px solid #E0E0E0',
        },
        inputField: {
            width: '100%',
            padding: '5px',
            border: 'none',
            backgroundColor: 'inherit',
        },
        timeIcon: {
            marginRight: '10px',
            verticalAlign: 'middle',
        },
        rotateIcon: {
            fontSize: '24px',
            color: '#00A6A4',
            marginRight: '10px',
            verticalAlign: 'middle',
        },
    };

    const timeData = [
        { label: 'Morning', icon: <FaSun style={styles.timeIcon} />, color: '#FFDDDD' },
        { label: 'Noon', icon: <FaClock style={styles.timeIcon} />, color: '#FFE8DD' },
        { label: 'Evening', icon: <FaSun style={styles.timeIcon} />, color: '#DDF2E8' },
        { label: 'Night', icon: <FaMoon style={styles.timeIcon} />, color: '#DDE7F2' },
        { label: 'Only when I need it', icon: <MdRotateRight style={styles.rotateIcon} />, color: '#E4E4E4' },
    ];

    const columnHeaders = ['Medications', 'Dosage', 'Time', 'Date', 'Comments'];

    return (
        <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={styles.title}>CUADRO DE MEDICAMENTOS</div>
            <button
                style={{
                    backgroundColor: '#00A6A4',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px',
                    color: 'white',
                    cursor: 'pointer',
                }}
                onClick={() => setModalOpen(true)}
            >
                <FaPlus style={{ marginRight: '5px' }} /> Agregar Medicamento
            </button>
        </div>
            {isModalOpen && <Modal onClose={() => setModalOpen(false)} />}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}></th>
                        {columnHeaders.map(header => (
                            <th style={styles.th} key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timeData.map(time => (
                        <tr key={time.label} style={{ backgroundColor: time.color }}>
                            <td style={styles.td}>
                                {time.icon}
                                <span style={{ color: '#555555', fontWeight: 'bold' }}>{time.label}</span>
                            </td>
                            {columnHeaders.map(header => (
                                <td style={styles.td} key={header}>
                                    <div style={{ overflow: matchedMedicamentos.length > 3 ? 'auto' : 'hidden', maxHeight: '120px' }}>
                                        {[...Array(4)].map((_, idx) => (
                                            <div key={idx} style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    style={styles.inputField}
                                                    value={inputValues[`${header}${time.label}${idx}`] || ''}
                                                    onChange={event => handleInputChange(event, header, time.label, idx)}
                                                    onFocus={() => setActiveCell(`${header}${time.label}${idx}`)}
                                                    onBlur={() => setTimeout(() => setActiveCell(null), 150)}
                                                />
                                                {activeCell === `${header}${time.label}${idx}` && matchedMedicamentos.length > 0 && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        backgroundColor: 'white',
                                                        border: '1px solid #ccc',
                                                        padding: '10px',
                                                        zIndex: 1000,
                                                    }}>
                                                        {matchedMedicamentos.map(med => (
                                                            <div
                                                                key={med.id}
                                                                onClick={() => selectMedicamento(med, header, time.label, idx)}
                                                            >
                                                                {med.nombre}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tabla;