import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import TurnCard from '../../components/TurnCard'; // Asegúrate de que la ruta es correcta
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {Tooltip } from '@mui/material';
import { useWalkerTurnsContext } from '../../contexts/TurnContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function TurnsList({ }) {
  const [error, setError] = useState(null);
  const navigate= useNavigate()
  const token = localStorage.getItem('userToken');
  const { getWalkerTurns, turns } = useWalkerTurnsContext();

  useEffect(() => {
    // Si no hay token, redirigir al inicio
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {}, [turns]);

  const handleDeleteTurn = async (turnId) => {
    // Lógica para eliminar el turno con el ID proporcionado
    try {
      if(!token){
        return navigate('/')

      }
      const response = await fetch(`${baseUrl}/turns/${turnId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el turno');
      }
      // Actualizar la lista de turnos después de la eliminación
      getWalkerTurns();
    } catch (error) {
      console.error('Error al eliminar el turno:', error.message);
      setError(error.message);
    }
  };

  const handleClick = async () => {
    navigate('/agregar-turno')
  };
  
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ flexGrow: 1, p: 2, }}>
      <Grid container spacing={2} sx={ {display: 'flex', justifyContent: 'center', alignItems: 'flex-start'} }>
        <Grid item>
          <Card
            sx={{ maxWidth: 'none', minWidth: '250px', maxHeight: 'none', height: '100%' }}
            onClick={handleClick}
          >
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Nuevo Turno
              </Typography>
              <Tooltip title='Agregar turno' arrow>
                <IconButton aria-label="agregar" size='large'>
                  <AddIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
        {turns.length > 0 && turns.map((turn) => (
          <Grid item key={turn.id}>
            <TurnCard turn={turn} onDelete={() => handleDeleteTurn(turn.id)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default TurnsList;
