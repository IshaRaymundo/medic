import React, { useState, useEffect } from 'react';

const Modal = ({ onClose }) => {
    const [showModal, setShowModal] = useState(true); // Initialize the modal as open
    const [nombresDisponibles, setNombresDisponibles] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [formula, setFormula] = useState('');
    const [metodoAdministracion, setMetodoAdministracion] = useState('');
    const [indicaciones, setIndicaciones] = useState('');

    useEffect(() => {
        fetch('http://localhost:8083/obtenerNombreMedicamentos')
            .then((response) => response.json())
            .then((data) => {
                setNombresDisponibles(data.nombresMedicamentos);
            })
            .catch((error) => {
                console.error('Error al cargar nombres desde la base de datos', error);
            });
    }, []);

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSave = () => {
        console.log('Nombre:', nombre);
        console.log('Descripción:', descripcion);
        console.log('Fórmula:', formula);
        console.log('Método de Administración:', metodoAdministracion);
        console.log('Indicaciones:', indicaciones);
        closeModal();
    };

    return (
        <div>
            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Ingrese los datos</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <select
                                        className="form-control"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    >
                                        <option value="">Selecciona un nombre</option>
                                        {nombresDisponibles
                                            ? nombresDisponibles.map((nombre) => (
                                                <option key={nombre} value={nombre}>
                                                    {nombre}
                                                </option>
                                            ))
                                            : null}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={closeModal}>
                                    Cerrar
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSave}>
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;