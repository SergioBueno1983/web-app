import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnpaidBillsContext } from '../../contexts/BillContext';
import { Card, CardContent, List, Typography } from '@mui/material';  



function BillHistory() {
  const { oldBills } = useUnpaidBillsContext();
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');


  useEffect(() => {
    // Si no hay token, redirigir al inicio 
    if (!token) {
      navigate('/');
    } 
  }, [token, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
      <Typography variant="h3" gutterBottom>
        Historial de Facturas
      </Typography>
      </div>
      {oldBills.length > 0 ? <div style={{ padding: '20px', borderRadius: '8px' }}>
          {oldBills.map((bill) => {
            return(
            <Card key={bill.id} sx={{ maxWidth: 'none', minWidth: '250px', maxHeight: 'none', height: '100%', marginBottom: '20px' }}>
              <CardContent >
                <Typography gutterBottom variant="h6" component="div">
                  Factura ID: {bill.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Fecha de Servicio:</strong> {bill.Service.fecha}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Paseador:</strong> {bill.Service.Turn.Walker.User.nombre_usuario}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Cantidad de mascotas:</strong> {bill.Service.cantidad_mascotas}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Direccion:</strong> {bill.Service.direccionPickUp}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Monto: $</strong> {bill.monto}
                </Typography>        
              </CardContent>
            </Card>
          )})}
      </div> : <p>No hay facturas en el historial.</p>}
    </div>
  );
}

export default BillHistory;
