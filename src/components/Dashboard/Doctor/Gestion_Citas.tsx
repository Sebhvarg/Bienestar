// Gestion_Citas.tsx
import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import es from "date-fns/locale/es";

interface Cita {
  idCita: number;
  nombrePaciente: string;
  fecha: string; // formato ISO (YYYY-MM-DD)
  hora: string;
}

export default function Gestion_Citas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [semana, setSemana] = useState<Date[]>([]);

  useEffect(() => {
    // Generar la semana actual
    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1, locale: es });
    const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));
    setSemana(diasSemana);

    // Simulación de citas (ejemplo)
    setCitas([
      { idCita: 1, nombrePaciente: "Juan Pérez", fecha: "2025-08-13", hora: "10:00" },
      { idCita: 2, nombrePaciente: "Ana López", fecha: "2025-08-15", hora: "14:30" }
    ]);
  }, []);

  return (
    <div>
      <h2>Gestión de Citas</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {semana.map((dia, i) => (
          <div key={i} style={{ border: "1px solid gray", padding: "0.5rem" }}>
            <strong>{format(dia, "EEEE dd/MM", { locale: es })}</strong>
            <ul>
              {citas
                .filter((c) => isSameDay(parseISO(c.fecha), dia))
                .map((c) => (
                  <li key={c.idCita}>
                    {c.hora} - {c.nombrePaciente}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
