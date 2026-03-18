import React from 'react';
import { useTurnos } from '../logic/useTurnos';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart3, Clock, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

const Reportes = () => {
  const { funcionarios, asignaciones } = useTurnos();
  const mesVer = format(new Date(), 'yyyy-MM');
  const asignacionesMes = asignaciones.filter(a => a.mesReferencia === mesVer);

  const estadisticas = funcionarios.map(f => {
    const turnosF = asignacionesMes.filter(a => a.id === f[0]);
    return {
      nombre: f[1],
      color: f[2],
      horas: turnosF.reduce((acc, curr) => acc + curr.horas, 0),
      totalDias: turnosF.length,
      // Desglose detallado para el PDF
      diasSemana: turnosF.filter(t => t.parte === "Entre Semana").length,
      horasSemana: turnosF.filter(t => t.parte === "Entre Semana").reduce((acc, c) => acc + c.horas, 0),
      diasFinde: turnosF.filter(t => t.parte === "Fin de Semana").length,
      horasFinde: turnosF.filter(t => t.parte === "Fin de Semana").reduce((acc, c) => acc + c.horas, 0),
    };
  });

  const granTotal = estadisticas.reduce((acc, curr) => acc + curr.horas, 0);

  const estiloPastel = () => {
    if (granTotal === 0) return 'conic-gradient(#f3f4f6 0%)';
    let acumulado = 0;
    const cuñas = estadisticas.map(est => {
      const p = (est.horas / granTotal) * 100;
      const inicio = acumulado;
      acumulado += p;
      return `${est.color} ${inicio}% ${acumulado}%`;
    });
    return `conic-gradient(${cuñas.join(', ')})`;
  };

  // --- GENERADOR DE PDF PROFESIONAL ---
  const generarPDF = () => {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();

    // 1. Título con estilo de la imagen
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(26);
    doc.text("Estadísticas", 25, 25);
    
    // Línea decorativa azul bajo el título
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1.5);
    doc.line(20, 30, 45, 30);

    // 2. Resumen General
    doc.setDrawColor(240);
    doc.setFillColor(255);
    doc.roundedRect(15, 40, width - 30, 45, 10, 10, 'FD');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(30);
    doc.text(`${granTotal}h`, 25, 68);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("TOTAL MES ACTUAL", 25, 75);
    doc.text(format(new Date(), "MMMM yyyy", { locale: es }).toUpperCase(), width - 25, 75, { align: 'right' });

    // 3. Tarjetas de Funcionarios con detalles
    let y = 100;
    estadisticas.forEach(est => {
      const porc = granTotal > 0 ? (est.horas / granTotal) : 0;
      
      // Fondo de la tarjeta
      doc.setDrawColor(245);
      doc.setFillColor(255);
      doc.roundedRect(15, y, width - 30, 45, 8, 8, 'FD');

      // Nombre y Porcentaje
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(est.nombre, 25, y + 12);
      
      doc.setTextColor(59, 130, 246);
      doc.setFontSize(12);
      doc.text(`${(porc * 100).toFixed(1)}%`, width - 25, y + 12, { align: 'right' });

      // Barra de progreso
      doc.setDrawColor(245);
      doc.setLineWidth(4);
      doc.line(25, y + 20, width - 25, y + 20);
      
      const r = parseInt(est.color.slice(1,3), 16), g = parseInt(est.color.slice(3,5), 16), b = parseInt(est.color.slice(5,7), 16);
      doc.setDrawColor(r, g, b);
      doc.line(25, y + 20, 25 + ((width - 50) * porc), y + 20);

      // INFORMACIÓN DETALLADA (Lo que pediste)
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.setFont("helvetica", "bold");
      doc.text(`TOTAL: ${est.horas}h`, 25, y + 30);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(140);
      doc.text(`Entre semana: ${est.diasSemana}d (${est.horasSemana}h)`, 25, y + 36);
      doc.text(`Fin de semana: ${est.diasFinde}d (${est.horasFinde}h)`, width - 25, y + 36, { align: 'right' });

      y += 52; // Espacio para la siguiente tarjeta
      
      // Si se acaba la página, crear una nueva
      if (y > 250) { doc.addPage(); y = 20; }
    });

    doc.save(`Estadisticas_${mesVer}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-32">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black italic flex items-center gap-2 tracking-tighter text-gray-900">
          <BarChart3 className="text-blue-600" size={32} /> 
          Estadísticas
        </h1>
        <button 
          onClick={generarPDF} 
          className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 text-blue-600 active:scale-90 transition-transform flex items-center gap-2 font-bold"
        >
          <FileDown size={24} />
          PDF
        </button>
      </header>

      {/* Cuadro de resumen visual en la app */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm mb-8 flex items-center justify-between border border-gray-100">
        <div>
          <span className="text-6xl font-black text-gray-800 tracking-tighter">{granTotal}h</span>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Total Mes Actual</p>
        </div>
        <div 
          className="w-28 h-28 rounded-full border-[10px] border-gray-50 shadow-inner" 
          style={{ background: estiloPastel() }} 
        />
      </div>

      <div className="grid gap-5">
        {estadisticas.map(est => (
          <div key={est.nombre} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black capitalize flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: est.color}} />
                {est.nombre}
              </h3>
              <span className="font-black text-blue-600 text-lg">
                {(granTotal > 0 ? (est.horas / granTotal) * 100 : 0).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full transition-all duration-1000" 
                style={{ width: `${granTotal > 0 ? (est.horas / granTotal) * 100 : 0}%`, backgroundColor: est.color }} 
              />
            </div>
            <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-tight">
              <span>{est.diasSemana} sem / {est.diasFinde} finde</span>
              <span className="text-gray-800 font-black">{est.horas} Horas Totales</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reportes;