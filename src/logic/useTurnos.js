import { useState, useEffect } from 'react';
import { format, subMonths, isBefore, startOfMonth } from 'date-fns';

export const useTurnos = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    const fData = JSON.parse(localStorage.getItem('funcionarios')) || [];
    let aData = JSON.parse(localStorage.getItem('asignaciones')) || [];

    // --- LÓGICA DE AUTO-LIMPIEZA (6 MESES) ---
    const limiteHistorial = startOfMonth(subMonths(new Date(), 6));
    
    const asignacionesFiltradas = aData.filter(asig => {
      const fechaAsig = new Date(asig.fecha + "T00:00:00");
      return !isBefore(fechaAsig, limiteHistorial);
    });

    if (asignacionesFiltradas.length !== aData.length) {
      localStorage.setItem('asignaciones', JSON.stringify(asignacionesFiltradas));
    }

    setFuncionarios(fData);
    setAsignaciones(asignacionesFiltradas);
  }, []);

  const agregarTurnos = (id, nombre, fechas) => {
    const nuevos = fechas.map(f => {
      const fechaObj = new Date(f + "T00:00:00");
      const esFinde = [0, 6].includes(fechaObj.getDay());
      return { 
        fecha: f, 
        id, 
        nombre, 
        mesReferencia: format(fechaObj, 'yyyy-MM'), // Clave para separar meses
        parte: esFinde ? "Fin de Semana" : "Entre Semana", 
        horas: esFinde ? 11 : 2 
      };
    });

    // Filtramos para evitar duplicados en la misma fecha
    const fechasNuevas = fechas;
    const asignacionesLimpias = asignaciones.filter(a => !fechasNuevas.includes(a.fecha));
    
    const resultado = [...asignacionesLimpias, ...nuevos];
    setAsignaciones(resultado);
    localStorage.setItem('asignaciones', JSON.stringify(resultado));
  };

  const guardarFuncionario = (nuevo) => {
    const actualizados = [...funcionarios, nuevo];
    setFuncionarios(actualizados);
    localStorage.setItem('funcionarios', JSON.stringify(actualizados));
  };

  const intercambiar = (f1, f2) => {
    const copia = [...asignaciones];
    const i1 = copia.findIndex(a => a.fecha === f1);
    const i2 = copia.findIndex(a => a.fecha === f2);
    if (i1 === -1 || i2 === -1) return;

    const temp = { id: copia[i1].id, nombre: copia[i1].nombre };
    copia[i1].id = copia[i2].id;
    copia[i1].nombre = copia[i2].nombre;
    copia[i2].id = temp.id;
    copia[i2].nombre = temp.nombre;

    setAsignaciones(copia);
    localStorage.setItem('asignaciones', JSON.stringify(copia));
  };

  return { funcionarios, asignaciones, agregarTurnos, intercambiar, guardarFuncionario };
};