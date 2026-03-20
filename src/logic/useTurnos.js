import { useState, useEffect } from 'react';
import { format, subMonths, isBefore, startOfMonth } from 'date-fns';

export const useTurnos = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    const fData = JSON.parse(localStorage.getItem('funcionarios')) || [];
    const aData = JSON.parse(localStorage.getItem('asignaciones')) || [];
    const limite = startOfMonth(subMonths(new Date(), 6));
    const filtrados = aData.filter(asig => !isBefore(new Date(asig.fecha + "T00:00:00"), limite));
    setFuncionarios(fData);
    setAsignaciones(filtrados);
  }, []);

  const guardarTodo = (f, a) => {
    setFuncionarios(f);
    setAsignaciones(a);
    localStorage.setItem('funcionarios', JSON.stringify(f));
    localStorage.setItem('asignaciones', JSON.stringify(a));
  };

  const agregarTurnos = (id, nombre, fechas) => {
    const nuevos = fechas.map(f => {
      const fObj = new Date(f + "T00:00:00");
      const esFinde = [0, 6].includes(fObj.getDay());
      return { 
        fecha: f, id, nombre, 
        mesReferencia: format(fObj, 'yyyy-MM'),
        parte: esFinde ? "Fin de Semana" : "Entre Semana", 
        horas: esFinde ? 11 : 2 
      };
    });
    const limpia = asignaciones.filter(a => !fechas.includes(a.fecha));
    guardarTodo(funcionarios, [...limpia, ...nuevos]);
  };

  const eliminarFuncionario = (id) => {
    guardarTodo(funcionarios.filter(f => f[0] !== id), asignaciones.filter(a => a.id !== id));
  };

  const editarFuncionario = (id, nuevoNombre) => {
    const fNuevos = funcionarios.map(f => f[0] === id ? [id, nuevoNombre, f[2]] : f);
    const aNuevas = asignaciones.map(a => a.id === id ? { ...a, nombre: nuevoNombre } : a);
    guardarTodo(fNuevos, aNuevas);
  };

  const intercambiar = (f1, f2) => {
    const copia = [...asignaciones];
    const i1 = copia.findIndex(a => a.fecha === f1);
    const i2 = copia.findIndex(a => a.fecha === f2);
    if (i1 === -1 || i2 === -1) return;
    const temp = { id: copia[i1].id, nombre: copia[i1].nombre };
    copia[i1].id = copia[i2].id; copia[i1].nombre = copia[i2].nombre;
    copia[i2].id = temp.id; copia[i2].nombre = temp.nombre;
    guardarTodo(funcionarios, copia);
  };

  const quitarTurno = (fecha) => {
    const nuevasAsignaciones = asignaciones.filter(a => a.fecha !== fecha);
    setAsignaciones(nuevasAsignaciones); // Esto "despinta" el calendario al instante
    localStorage.setItem('asignaciones', JSON.stringify(nuevasAsignaciones));
  };

  return { funcionarios, asignaciones, agregarTurnos, eliminarFuncionario, editarFuncionario, intercambiar, setFuncionarios,quitarTurno};
};