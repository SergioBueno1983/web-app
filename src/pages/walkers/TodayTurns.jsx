import React, { useContext, useEffect, useState } from 'react';
import { useWalkerTurnsContext } from '../../contexts/TurnContext'; 
import TodayTurnCard from '../../components/TodayTurnCard';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TodayTurns = () => {
  const { turns } = useWalkerTurnsContext();
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  const [turnosHoy, setTurnosHoy] = useState([]);
  const [turnosProximos, setTurnosProximos] = useState([]);
  const [diaProximo, setDiaProximo] = useState('');
  const [fechaProxima, setFechaProxima] = useState('');
  const [diaHoy, setDiaHoy] = useState('');
  const [fechaHoy, setFechaHoy] = useState('');

  useEffect(() => {
    if (!token) navigate('/');
  }, [token, navigate]);

  useEffect(() => {
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const day = hoy.getDate().toString().padStart(2, '0');
    const fechaActual = `${year}-${month}-${day}`;

    setDiaHoy(diasSemana[hoy.getDay()]);
    setFechaHoy(fechaActual);

    const horaActual = hoy.getHours() * 60 + hoy.getMinutes();
    const turnosDelDia = turns.filter(turn => {
      const [horaFin, minutoFin] = turn.hora_fin.split(':').map(Number);
      const fin = horaFin * 60 + minutoFin;
      const finTurno = fin + 60;
      return turn.dias.includes(diasSemana[hoy.getDay()]) && horaActual < finTurno;
    });
    turnosDelDia.sort((a, b) => {
      const [horaInicioA, minutoInicioA] = a.hora_inicio.split(':').map(Number);
      const [horaInicioB, minutoInicioB] = b.hora_inicio.split(':').map(Number);
      return (horaInicioA * 60 + minutoInicioA) - (horaInicioB * 60 + minutoInicioB);
    });

    setTurnosHoy(turnosDelDia);

    if (turnosDelDia.length === 0) {
      let i = 1;
      let turnosFuturos = [];
      while (turnosFuturos.length === 0 && i <= 7) {
        const siguienteFecha = new Date(hoy);
        siguienteFecha.setDate(hoy.getDate() + i);
        const siguienteDia = diasSemana[siguienteFecha.getDay()];
        const year = siguienteFecha.getFullYear();
        const month = (siguienteFecha.getMonth() + 1).toString().padStart(2, '0');
        const day = siguienteFecha.getDate().toString().padStart(2, '0');
        const fechaSiguiente = `${year}-${month}-${day}`;

        turnosFuturos = turns.filter(turn => turn.dias.includes(siguienteDia));
        i++;
        if (turnosFuturos.length > 0) {
          setDiaProximo(siguienteDia);
          setFechaProxima(fechaSiguiente);
        }
      }
      turnosFuturos.sort((a, b) => {
        const [horaInicioA, minutoInicioA] = a.hora_inicio.split(':').map(Number);
        const [horaInicioB, minutoInicioB] = b.hora_inicio.split(':').map(Number);
        return (horaInicioA * 60 + minutoInicioA) - (horaInicioB * 60 + minutoInicioB);
      });
      setTurnosProximos(turnosFuturos);
    } else {
      setTurnosProximos(turnosDelDia);
      setDiaProximo(diasSemana[hoy.getDay()]);
      setFechaProxima(fechaActual);
    }
  }, [turns]);

  const formatearFecha = (fecha) => {
    const [año, mes, día] = fecha.split('-');
    return `${día}/${mes}/${año}`;
  };

  return (
    <div>
      <Container className='card'>
        {turns.length > 0 ? <h2>
          {turnosHoy.length > 0
            ? `Turnos para hoy (${diaHoy}, ${formatearFecha(fechaHoy)})`
            : <>No hay turnos para el día de hoy.<br />Próximos turnos ({diaProximo}, {formatearFecha(fechaProxima)})</>
          }
        </h2> : <h2>Agregue un turno para ver la información aquí.</h2>}
      </Container>
      {turnosProximos.length > 0 ? (
        turnosProximos.map(turn => (
          <TodayTurnCard key={turn.id} turn={turn} fecha={turnosHoy.length > 0 ? fechaHoy : fechaProxima} />
        ))
      ) : (
        <strong>No hay turnos disponibles.</strong>
      )}
    </div>
  );
};

export default TodayTurns;
