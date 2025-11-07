import React, { useState } from 'react';

const ThreeDPrintingCalculator = () => {
  // Estados para los valores de entrada
  const [weight, setWeight] = useState('');
  const [time, setTime] = useState('');
  const [filamentCost, setFilamentCost] = useState(400);
  const [energyCost, setEnergyCost] = useState(0.90);
  const [printerCost, setPrinterCost] = useState(6000);
  const [margin, setMargin] = useState(30);
  const [filamentError, setFilamentError] = useState('');
  
  // Estados para los resultados
  const [results, setResults] = useState({
    filamentCost: 0,
    energyCost: 0,
    printerAmortization: 0,
    totalCost: 0,
    salePrice: 0,
    breakdownText: '',
    showResults: false
  });

  // Constantes
  const printerPowerConsumption = 0.08; // kW (promedio durante impresión)
  const printerLifespan = 10000; // horas de vida útil estimada

  // Validación del costo de filamento con regex
  const handleFilamentCostChange = (e) => {
    const value = e.target.value;
    
    // Regex: permite números enteros y decimales positivos
    const regex = /^\d*\.?\d*$/;
    
    if (regex.test(value) || value === '') {
      const numValue = parseFloat(value);
      
      if (value === '' || (numValue >= 0 && numValue <= 3000)) {
        setFilamentCost(value);
        setFilamentError('');
      } else if (numValue > 3000) {
        setFilamentCost('3000');
        setFilamentError('El costo máximo es $3,000 MXN/kg');
      }
    }
  };

  // Función para calcular los costos
  const calculateCost = () => {
    // Convertir valores a números, usando 0 si están vacíos
    const weightNum = parseFloat(weight) || 0;
    const timeNum = parseFloat(time) || 0;
    const filamentCostNum = parseFloat(filamentCost) || 400;
    const energyCostNum = parseFloat(energyCost) || 0.90;
    const printerCostNum = parseFloat(printerCost) || 6000;
    const marginNum = parseFloat(margin) || 30;

    // Cálculos
    const filamentCostResult = (weightNum / 1000) * filamentCostNum;
    const energyCostResult = timeNum * printerPowerConsumption * energyCostNum;
    const printerAmortizationResult = (timeNum / printerLifespan) * printerCostNum;
    
    const totalCostResult = filamentCostResult + energyCostResult + printerAmortizationResult;
    const salePriceResult = totalCostResult * (1 + marginNum/100);

    // Texto de desglose
    const breakdownText = `
      Para un objeto de ${weightNum}g impreso en ${timeNum} horas:
      - Filamento: ${weightNum}g × $${filamentCostNum}/kg = $${filamentCostResult.toFixed(2)}
      - Energía: ${timeNum}h × ${printerPowerConsumption}kW × $${energyCostNum}/kWh = $${energyCostResult.toFixed(2)}
      - Amortización impresora: ${timeNum}h / ${printerLifespan}h × $${printerCostNum} = $${printerAmortizationResult.toFixed(2)}
      - Costo total: $${totalCostResult.toFixed(2)}
      - Precio con ${marginNum}% de margen: $${salePriceResult.toFixed(2)}
    `;

    // Actualizar estado con resultados
    setResults({
      filamentCost: filamentCostResult,
      energyCost: energyCostResult,
      printerAmortization: printerAmortizationResult,
      totalCost: totalCostResult,
      salePrice: salePriceResult,
      breakdownText,
      showResults: true
    });
  };

  // Función para generar PDF
  const generatePDF = () => {
    const weightNum = parseFloat(weight) || 0;
    const timeNum = parseFloat(time) || 0;
    const filamentCostNum = parseFloat(filamentCost) || 400;
    const energyCostNum = parseFloat(energyCost) || 0.90;
    const printerCostNum = parseFloat(printerCost) || 6000;
    const marginNum = parseFloat(margin) || 30;

    // Crear contenido HTML para el PDF
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 32px; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .section { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #3b82f6; }
          .section h2 { margin-top: 0; color: #3b82f6; font-size: 20px; }
          .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #ddd; }
          .row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #555; }
          .value { font-weight: bold; color: #3b82f6; }
          .total { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .total .row { border-bottom: none; font-size: 18px; }
          .total .value { color: #059669; font-size: 24px; }
          .breakdown { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
          .breakdown pre { margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🖨️ Calculadora de Impresión 3D</h1>
          <p>Bambu Lab A1 - Reporte de Cotización</p>
          <p style="font-size: 12px; margin-top: 10px;">Fecha: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <div class="section">
          <h2>📋 Parámetros de la Impresión</h2>
          <div class="row">
            <span class="label">Peso del objeto:</span>
            <span class="value">${weightNum}g</span>
          </div>
          <div class="row">
            <span class="label">Tiempo de impresión:</span>
            <span class="value">${timeNum} horas</span>
          </div>
          <div class="row">
            <span class="label">Costo del filamento:</span>
            <span class="value">$${filamentCostNum} MXN/kg</span>
          </div>
          <div class="row">
            <span class="label">Costo de energía:</span>
            <span class="value">$${energyCostNum} MXN/kWh</span>
          </div>
          <div class="row">
            <span class="label">Costo de la impresora:</span>
            <span class="value">$${printerCostNum} MXN</span>
          </div>
          <div class="row">
            <span class="label">Margen de ganancia:</span>
            <span class="value">${marginNum}%</span>
          </div>
        </div>

        <div class="section">
          <h2>💰 Desglose de Costos</h2>
          <div class="row">
            <span class="label">💵 Costo de filamento:</span>
            <span class="value">$${results.filamentCost.toFixed(2)} MXN</span>
          </div>
          <div class="row">
            <span class="label">⚡ Costo de energía:</span>
            <span class="value">$${results.energyCost.toFixed(2)} MXN</span>
          </div>
          <div class="row">
            <span class="label">🖨️ Amortización de impresora:</span>
            <span class="value">$${results.printerAmortization.toFixed(2)} MXN</span>
          </div>
          <div class="row" style="border-top: 2px solid #3b82f6; padding-top: 15px; margin-top: 10px;">
            <span class="label" style="font-size: 16px;">📊 Costo total (sin ganancia):</span>
            <span class="value" style="font-size: 18px;">$${results.totalCost.toFixed(2)} MXN</span>
          </div>
        </div>

        <div class="total">
          <div class="row">
            <span class="label">🎯 PRECIO DE VENTA SUGERIDO:</span>
            <span class="value">$${results.salePrice.toFixed(2)} MXN</span>
          </div>
        </div>

        <div class="breakdown">
          <h3 style="color: #3b82f6; margin-top: 0;">📝 Cálculo Detallado</h3>
          <pre>${results.breakdownText}</pre>
        </div>

        <div class="footer">
          <p><strong>ONI3D - Sistema de Gestión de Impresión 3D</strong></p>
          <p>Este documento es una cotización estimada basada en los parámetros proporcionados.</p>
        </div>
      </body>
      </html>
    `;

    // Crear un Blob con el contenido HTML
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Abrir en nueva ventana para imprimir como PDF
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          URL.revokeObjectURL(url);
        }, 250);
      };
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header con efectos mejorados */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl overflow-hidden mb-8 fade-in">
            <div className="relative p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
              <div className="relative">
                <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.37v6.71l6-3.38z"/>
                  </svg>
                </div>
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">Calculadora de Impresión 3D</h1>
                <p className="text-blue-100 text-lg font-medium">Bambu Lab A1 - Costos en México 🇲🇽</p>
              </div>
            </div>
          </div>
          
          {/* Formulario con diseño mejorado */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-white/10 fade-in">
            <div className="p-6 md:p-8">
              {/* Sección de inputs principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Peso */}
                <div className="slide-in">
                  <label htmlFor="weight" className="block text-white font-bold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    Peso del objeto (gramos)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="weight"
                      min="0"
                      step="0.1"
                      placeholder="Ej: 50"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all hover:bg-gray-700/70"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">g</div>
                  </div>
                </div>

                {/* Tiempo */}
                <div className="slide-in" style={{ animationDelay: '0.1s' }}>
                  <label htmlFor="time" className="block text-white font-bold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tiempo de impresión (horas)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="time"
                      min="0"
                      step="0.1"
                      placeholder="Ej: 3.5"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all hover:bg-gray-700/70"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">h</div>
                  </div>
                </div>
              </div>

              {/* Sección de costos */}
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 mb-8 border border-blue-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Parámetros de Costo
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Costo de filamento con validación */}
                  <div>
                    <label htmlFor="filamentCost" className="block text-gray-300 font-semibold mb-2">
                      Costo del filamento (MXN/kg)
                    </label>
                    <input
                      type="text"
                      id="filamentCost"
                      value={filamentCost}
                      onChange={handleFilamentCostChange}
                      className={`w-full px-4 py-3 bg-gray-700/50 border ${filamentError ? 'border-red-500' : 'border-gray-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:bg-gray-700/70`}
                    />
                    {filamentError && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {filamentError}
                      </p>
                    )}
                    <p className="text-sm text-gray-400 mt-2">💡 Rango: $300-500 MXN/kg | Máximo: $3,000</p>
                  </div>
                  
                  {/* Costo de energía */}
                  <div>
                    <label htmlFor="energyCost" className="block text-gray-300 font-semibold mb-2">
                      Costo de energía (MXN/kWh)
                    </label>
                    <input
                      type="number"
                      id="energyCost"
                      min="0"
                      step="0.01"
                      value={energyCost}
                      onChange={(e) => setEnergyCost(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:bg-gray-700/70"
                    />
                    <p className="text-sm text-gray-400 mt-2">⚡ Promedio México: $0.90 MXN/kWh</p>
                  </div>

                  {/* Costo de impresora */}
                  <div>
                    <label htmlFor="printerCost" className="block text-gray-300 font-semibold mb-2">
                      Costo de la impresora (MXN)
                    </label>
                    <input
                      type="number"
                      id="printerCost"
                      min="0"
                      value={printerCost}
                      onChange={(e) => setPrinterCost(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:bg-gray-700/70"
                    />
                    <p className="text-sm text-gray-400 mt-2">🖨️ Bambu Lab A1: ~$6,000 MXN</p>
                  </div>
                  
                  {/* Margen */}
                  <div>
                    <label htmlFor="margin" className="block text-gray-300 font-semibold mb-2">
                      Margen de ganancia (%)
                    </label>
                    <input
                      type="number"
                      id="margin"
                      min="0"
                      max="100"
                      value={margin}
                      onChange={(e) => setMargin(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:bg-gray-700/70"
                    />
                    <p className="text-sm text-gray-400 mt-2">📈 Tu ganancia sobre el costo</p>
                  </div>
                </div>
              </div>
              
              {/* Botón de calcular con efectos */}
              <button
                onClick={calculateCost}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl pulse-glow flex items-center justify-center gap-3 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calcular Precio
              </button>
              
              {/* Resultados mejorados */}
              {results.showResults && (
                <div className="mt-8 bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-2xl p-6 border border-green-500/30 backdrop-blur-sm fade-in">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6 pb-3 border-b-2 border-gradient-to-r from-green-400 to-blue-400 flex items-center gap-3">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resultados del Cálculo
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-800/50 rounded-xl p-4 flex justify-between items-center hover:bg-gray-800/70 transition-all">
                      <span className="text-gray-300 font-medium">💰 Costo de filamento:</span>
                      <span className="font-bold text-xl text-blue-400">${results.filamentCost.toFixed(2)}</span>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-4 flex justify-between items-center hover:bg-gray-800/70 transition-all">
                      <span className="text-gray-300 font-medium">⚡ Costo de energía:</span>
                      <span className="font-bold text-xl text-yellow-400">${results.energyCost.toFixed(2)}</span>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-4 flex justify-between items-center hover:bg-gray-800/70 transition-all">
                      <span className="text-gray-300 font-medium">🖨️ Amortización de impresora:</span>
                      <span className="font-bold text-xl text-purple-400">${results.printerAmortization.toFixed(2)}</span>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-4 flex justify-between items-center hover:bg-gray-800/70 transition-all border-t-2 border-gray-600">
                      <span className="text-white font-semibold text-lg">📊 Costo total (sin ganancia):</span>
                      <span className="font-bold text-2xl text-orange-400">${results.totalCost.toFixed(2)}</span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-5 flex justify-between items-center border-2 border-green-500/50 pulse-glow">
                      <span className="text-white font-bold text-xl">🎯 Precio de venta (con ganancia):</span>
                      <span className="font-bold text-3xl text-green-400">${results.salePrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-5 rounded-xl border border-blue-500/30">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-lg">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Desglose Detallado
                    </h3>
                    <pre className="text-gray-300 whitespace-pre-line font-mono text-sm leading-relaxed">{results.breakdownText}</pre>
                  </div>

                  {/* Botón para generar PDF */}
                  <div className="mt-6">
                    <button
                      onClick={generatePDF}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 text-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Descargar Cotización en PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreeDPrintingCalculator;