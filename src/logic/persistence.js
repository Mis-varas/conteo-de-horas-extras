const DB_KEY_ASIG = 'asignaciones_v1';
const DB_KEY_FUNC = 'funcionarios_v1';

export const getLocalData = () => {
  const asignaciones = JSON.parse(localStorage.getItem(DB_KEY_ASIG)) || [];
  const funcionarios = JSON.parse(localStorage.getItem(DB_KEY_FUNC)) || [
    // Datos iniciales basados en tus imágenes para que no empieces de cero
    ["1773857599591", "yeremi", "#ef4444"],
    ["1773857675547", "Rocío", "#3b82f6"],
    ["1773859155627", "jjw", "#10b981"]
  ];
  return { asignaciones, funcionarios };
};

export const saveLocalAsig = (data) => {
  localStorage.setItem(DB_KEY_ASIG, JSON.stringify(data));
};

export const saveLocalFunc = (data) => {
  localStorage.setItem(DB_KEY_FUNC, JSON.stringify(data));
};