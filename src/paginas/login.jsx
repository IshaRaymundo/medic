import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { dbFirebase } from '../bd/firebase';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8083/login', {
        email: email,
        password: password,
      });

      if (response.data.mensaje) {
 
        alert('Autenticación exitosa');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
      console.error(error);
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
      
      })
      .catch((error) => {
        console.error('Error al iniciar sesión con Google:', error);
      });
  };

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-1/2 h-screen">
        <img src="https://img.freepik.com/vector-premium/medicamentos-tarro-tabletas-pildoras-dibujos-animados_480044-1553.jpg?w=2000" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="bg-white w-full md:max-w-md lg:max-w-full md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Ingresa a tu cuenta</h1>
          <form className="mt-6" onSubmit={handleSignIn}>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name=""
                id=""
                placeholder="Ingresa tu Email"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus-border-blue-500 focus-bg-white focus-outline-none"
                autoFocus
                autoComplete="on"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                name=""
                id=""
                placeholder="Ingresa tu contraseña"
                minLength="6"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus-border-blue-500 focus-bg-white focus-outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full block bg-indigo-500 hover-bg-indigo-400 focus-bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
            >
              Ingresa
            </button>
          </form>
          {error && (
            <div className="text-red-500 mt-4">{error}</div>
          )}
          <hr className="my-6 border-gray-300 w-full" />
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full block bg-white hover-bg-gray-100 focus-bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="w-6 h-6"
                viewBox="0 0 48 48"
              >
            
              </svg>
              <span className="ml-4">Ingresa con Google</span>
            </div>
          </button>
          <p className="mt-8">
            ¿Todavía no tienes una cuenta?{' '}
            <a href="/registro" className="text-blue-500 hover-text-blue-700 font-semibold">
              Crea una cuenta
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
