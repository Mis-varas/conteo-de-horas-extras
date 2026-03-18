import React, { useState } from 'react';
import { enviarAccion } from '../api/googleSheets';
import { UserPlus } from 'lucide-react';

const GestionStaff = () => {
  const [nombre, setNombre] = useState('');

  const agregar = async () => {
    if (!nombre) return;
    const nuevo = {
      action: 'addFuncionario',
      id: "ID-" + Math.floor(Math.random() * 100000),
      nombre: nombre,
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    };
    await enviarAccion(nuevo);
    setNombre('');
    alert("Funcionario añadido. Refresca el calendario.");
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 font-bold">Gestión de Staff</h2>
      <div className="flex gap-2">
        <input className="border p-2 flex-1 rounded" placeholder="Nombre completo..." value={nombre} onChange={e => setNombre(e.target.value)} />
        <button onClick={agregar} className="bg-blue-500 text-white p-2 rounded"><UserPlus/></button>
      </div>
    </div>
  );
};

export default GestionStaff;