import { useEffect, useState } from "react";
import { getEventos, updateCompilar } from "./crud";
import { ModalDelete, ModalView } from "./modal"
import defaults from './img/defaults.png'
import check from './img/check.png'
import warning from './img/warning.png'
import error from './img/error.png'
import iconRM from './img/icon1.png'
import iconRR from './img/icon2.png'
import './css/event.css';

export function Evento({ fecha, proyecto, id_proyecto, setEvent, reporte }) {
  const tipo = ["desarrollo", "production", "update", "in_capa"];
  const etapa = ["", "-P", "-L", "-C", "-C"];
  const color = ["reporte-m", "reporte-r"];

  const [evento, setEvento] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [viewDelete, setViewDelete] = useState(false);

  const [idenId, setId] = useState(null);

  const info = getEventos();

  /**** Obtener eventos por fecha y proyecto ****/
  useEffect(() => {
    if (id_proyecto === '0') {
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
    
    const estado = (id) => {
      setEstatus((prevEstatus) => {
        const nuevoEstatus = prevEstatus === 4 ? 1 : prevEstatus + 1;
        updateCompilar(id, nuevoEstatus);
        return nuevoEstatus;
      });
    };

    return(
      <div className="event__cont" >
        <div id="click" onClick={() => estado(dato.id_evento)}>
          {
            estatus === 1 && <img src={defaults} className="icon" /> || 
            estatus === 2 && <img src={check} className='icon' /> || 
            estatus === 3 && <img src={warning} className='icon' /> || 
            estatus === 4 && <img src={error} className='icon' /> 
          }
        </div>

        <div className={`event compilar__ ${tipo[dato.id_tipo-1]}`}>
          <div onClick={() => viewData(dato.id_evento)}>
            <h4 >{dato.nem_figura}{etapa[dato.id_etapa]}</h4>
          </div>
        </div>
      </div>
    )
  }

  const ReportItem = ({ dato }) => {
    const inter = parseInt(dato.id_compilar);
    const [status, setStatus] = useState(inter);
    
    const estado = (id) => {
      setStatus((prevStatus) => {
        const nuevoStatus = prevStatus === 2 ? 1 : prevStatus + 1;
        updateCompilar(id, nuevoStatus);
        return nuevoStatus;
      });
    };

    return (
      <div className="event__cont">
        <div className="event">
          <div className={`reporte ${color[status-1]}`}>
            <div onClick={() => estado(dato.id_evento)}>
              {
                status === 1 && <img src={iconRM} className="icon__reporte" /> || 
                status === 2 && <img src={iconRR} className="icon__reporte"  />
              }
            </div>
            <div className="tam__reporte" onClick={() => viewData(dato.id_evento)}>
              <h4>{dato.nem_figura}{etapa[dato.id_etapa]}</h4>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const viewData = (id) => {
    setViewModal(true);
    setId(id);
  }

  const getEvento = evento.find(row => row.id_evento === idenId);

  return (
    <>
      
        <div style={{display: 'flex', flexDirection: 'row'}}> 
          <div style={{
            display: 'grid',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }} className="evento--grid">
            {datos && datos.map(item => ( <EventoItem key={item.id_evento} dato={item} /> ))}
          </div>  
        </div>
      

      {viewModal && ( <ModalView id={idenId} data={getEvento} close={setViewModal} openDel={setViewDelete} eventos={setEvent} addFecha={fecha} /> )}

      {viewDelete && ( <ModalDelete id={idenId} close={setViewDelete} evento={setEvent} /> )}
    </>
  )
}