
import { useEffect, useState } from "react";
import { getEventos } from "../crud";
import defaults from '../img/defaults.png'
import check from '../img/check.png'
import warning from '../img/warning.png'
import error from '../img/error.png'
import iconRM from '../img/icon1.png'
import iconRR from '../img/icon2.png'
import '../css/event.css';

export function Evento({ fecha, eventos, proyecto, id_proyecto, setEvent, reporte }) {
  const tipo = ["desarrollo", "production", "update", "in_capa"];
  const etapa = ["", "-P", "-L", "-C", "-C"];
  const color = ["reporte-m", "reporte-r"];

  const [evento, setEvento] = useState([]);

  const info = getEventos();

  /**** Obtener eventos por fecha y proyecto ****/
  useEffect(() => {
    if (id_proyecto === '') {
      setEvento(info.filter(row => row.fecha === fecha));
    } else {
      setEvento(proyecto.filter(row => row.fecha === fecha));
    }
  }, [fecha, proyecto, id_proyecto, info]);

  let data, datos;

  if (!reporte) {
    datos = evento.filter(row => row.reporte === null); // Filtrar datos para mostrar las Compilaciones
  } else {
    datos = evento.filter(row => row.reporte === null); // Filtrar datos para mostrar las Compilaciones
    data = evento.filter(row => row.reporte === '1'); // Filtrar datos para mostrar los reportes
  }

  /**** Actualizar estatus del evento ****/
  const EventoItem = ({ dato }) => {
    const inter = parseInt(dato.id_compilar);
    const [estatus, setEstatus] = useState(inter);

    return(
      <div className="event__cont" >
        <div>
          {
            estatus === 1 && <img src={defaults} className="icon" /> || 
            estatus === 2 && <img src={check} className='icon' /> || 
            estatus === 3 && <img src={warning} className='icon' /> || 
            estatus === 4 && <img src={error} className='icon' /> 
          }
        </div>

        <div className={`event compilar__ ${tipo[dato.id_tipo-1]}`}>
          <div>
            <h4 >{dato.nem_figura}{etapa[dato.id_etapa]}</h4>
          </div>
        </div>
      </div>
    )
  }

  const ReportItem = ({ dato }) => {
    const inter = parseInt(dato.id_compilar);
    const [status, setStatus] = useState(inter);

    return (
      <div className="event__cont">
        <div className="event">
          <div className={`reporte ${color[status-1]}`}>
            <div>
              {
                status === 1 && <img src={iconRM} className="icon__reporte" /> || 
                status === 2 && <img src={iconRR} className="icon__reporte"  />
              }
            </div>
            <div className="tam__reporte" >
              <h4>{dato.nem_figura}{etapa[dato.id_etapa]}</h4>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {reporte ? (
        <>
          {datos && datos.map(dato => ( <EventoItem key={dato.id_evento} dato={dato} /> ))}

          {data && data.map(dato => ( <ReportItem key={dato.id_evento} dato={dato} /> ))}
        </>
      ) : ( <div style={{display: 'flex', flexDirection: 'row'}}> {datos && datos.map(item => ( <EventoItem key={item.id_evento} dato={item} /> ))} </div> )}
    </>
  )
}