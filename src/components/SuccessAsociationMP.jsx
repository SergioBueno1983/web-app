import React, { useState, useEffect } from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserLogContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const SuccessAsociationMP = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userLog, setUserLog } = useUser();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    // Si no hay token o usuario logueado, redirigir al inicio
    if (!token || !userLog) {
      navigate('/');
    }
  }, [token, userLog, navigate]);

  const successAsociation = async (code) => {
    if (!userLog) return; // Evita ejecutar la función si `userLog` es null

    try {
      const response = await fetch(`${baseUrl}/walkers/mercadopago/${userLog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        // Actualiza campo mercadopago en userLog
        setUserLog((prevUserLog) => ({
          ...prevUserLog,
          mercadopago_code: code, // Asegúrate de usar el campo correcto en tu API
        }));

        setLoading(false);
        navigate(`/profile/${userLog.id}`);
      } else {
        console.error('Error al actualizar MercadoPago');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      console.log('No hay code en la URL');
      return;
    }

    if (userLog) {
      successAsociation(code);
    }
  }, [userLog]); // Se ejecuta cuando `userLog` está disponible

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {loading ? (
        <>
          <CircularProgress />
          <Typography variant="h6" style={{ marginTop: '16px' }}>
            Cargando...
          </Typography>
        </>
      ) : (
        <Typography variant="h6">¡Carga completa! Lo estamos redireccionando...</Typography>
      )}
    </Container>
  );
};

export default SuccessAsociationMP;
