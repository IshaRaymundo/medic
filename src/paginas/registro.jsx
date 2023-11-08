import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Registro = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  });
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8083/registrarUsuario', formData);
      console.log(response.data);
      setRegistroExitoso(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className=" hidden lg:block w-full md:w-1/2 xl:w-1/2 h-screen">
        <img src="https://img.freepik.com/vector-premium/pildoras-medicamentos-liquidos-ninos-kawaii-doodle-ilustracion-vectorial-plana_609998-86.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="bg-white w-full md:max-w-md lg:max-w-full md:w-2/3 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
        flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12 flex items-center justify-center">Regístrate</h1>
          {registroExitoso && (
            <div className="flex items-center text-green-500 mt-2">
              <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
              Te has registrado exitosamente.
            </div>
          )}
          <form className="mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoFocus
                autoComplete="on"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu Email"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoComplete="on"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                minLength="6"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
            >
              Registrarse
            </button>
          </form>
          <hr className="my-6 border-gray-300 w-full" />
          <p className="mt-8">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-700 font-semibold">
              Ingresa
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Registro;
