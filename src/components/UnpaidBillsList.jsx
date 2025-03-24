import React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ButtonBase, Divider } from '@mui/material';
import { useUnpaidBillsContext } from '../contexts/BillContext';
import { useEffect } from 'react';


function UnpaidBillsList() {
  const { unpaidBills, setBillToPay } = useUnpaidBillsContext(); // Estado para almacenar las facturas impagas
  const navigate = useNavigate(); // Hook para navegar entre rutas
  const token = localStorage.getItem('userToken');


  useEffect(() => {
    // Si no hay token, redirigir al inicio 
    if (!token) {
      navigate('/');
    } 
  }, [token, navigate]);

  // Función para manejar el clic en una factura
  const handleBillClick = async (bill) => {
    localStorage.setItem('selectedBill', JSON.stringify(bill));
    navigate('/payment', { state: { bill } }); // Navegar a la página de pago pasando la factura seleccionada
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
      <Typography variant="h3" gutterBottom>
        Facturas
      </Typography>
      <button onClick={() => navigate('/bill-history')}>Ver Historial</button>
      </div>
      {unpaidBills.length > 0 ? <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        <List>
          {unpaidBills.map((bill) => {
            return(
            <React.Fragment key={bill.id}>
              <ButtonBase onClick={() => handleBillClick(bill)}>
                {/* Mostrar el ID de la factura y la fecha en la lista */}
                <ListItemText
                  primary={`Factura ID: ${bill.id}`}
                  secondary={`Fecha servicio: ${bill.Service.fecha} - Monto: $${bill.monto}`}
                />              
              </ButtonBase>
              {bill.pendiente ? (<ListItemText
                  primary={`Pago Pendiente`}
                />): <ListItemText
                primary={`Impaga`}
              />}
              <Divider /> {/* Separador entre elementos de la lista */}
            </React.Fragment>
          )})}
        </List>
      </div> : <p>No hay facturas pendientes de pago.</p>}
    </div>
  );
}

export default UnpaidBillsList;
