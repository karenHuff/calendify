import { useState } from 'react';
import { FaCalendarDays } from "react-icons/fa6";
import './css/calendario.css';
import './css/modal.css';
import { addEvento, deleteEvento, newProyect, ReadEtapa, ReadFigura, ReadProyecto, ReadTipo, updateEvento } from './crud';

/* Componente Button */
export function Button({ name_btn, func, style, color, ...props }) {
  return (
    <button type='button' className={`button btn__modal ${style} ${color}`} onClick={func} {...props}>{name_btn}</button>
  )
}

export function Compilacion({ title, nameIcon, ...props }) {
  return (
    <div className='compilacion' {...props}> <img src={nameIcon} className='icon' /> <h4>{title}</h4> </div>
  )
}


export function Aplicacion({ tipo, nombre, ...props }) {
  return (
    <h4 className={`aplicacion ${tipo}`} {...props}>{nombre}</h4>
  )
}

export function Reporte({type, icon, ...props}) {
  return(
    <div className="event__cont">
      <div className="event" {...props}> 
        <div className={`reporte-v ${type}`}>
          <img src={icon} className="icon__reporte" />
          <h4 className="tam__EReporte">Reporte</h4>
        </div>
      </div>
    </div>
  )
}


/* Función para mostrar modal para agregar registros */
export function  ModalAdd({ close, viewFecha, addFecha, evento }) {

  const [pry, setPry] = useState('');
  const [figura, setFigura] = useState('');
  const [tipo, setTipo] = useState('');
  const [etapa, setEtapa] = useState('');
  const [check, setCheck] = useState(false);
  
  return(
    <>
      <div className="modal">
        <div className="modal__view">
          <div className="modal__body">
            <h1>Agregar Registro</h1>

            <div className="fecha">{viewFecha} <FaCalendarDays className='icon icon__calendar' /></div>

            <div className="addOptions">
              <select name="proyectoAdd" id="proyectoAdd" className="select_ color--add" value={pry} onChange={e => setPry(e.target.value)}  >
                <option value="">Selecciona el proyecto </option>
                <ReadProyecto />
              </select>

              <select name='figuraAdd' id="figuraAdd" className="select_ color--add" value={figura} onChange={e => setFigura(e.target.value)} >
                <option value="">Selecciona la figura</option>
                <ReadFigura />
              </select>

              <select name='tipoAdd' id="tipoAdd" className="select_ color--add" value={tipo} onChange={e => setTipo(e.target.value)} >
                <option value="">Selecciona el tipo de aplicación</option>
                <ReadTipo />
              </select>
              
              <select name="etapaAdd" id="etapaAdd" className="select_ color--add" value={etapa} onChange={e => setEtapa(e.target.value)} >
                <option value="0">Selecciona la etapa </option>
                <ReadEtapa />
              </select>
            </div>
            
            <div className='checkbox'>
              <h2>Generar como reporte</h2>
              <input style={{
                border: '1px solid #999',
                width: '18px',
                height: '18px',
                marginTop: '4px',
                marginLeft: '5px',
                borderRadius: '4px',
                justifyContent: 'left'
              }} type='checkbox' value={check} onChange={e => setCheck(e.target.checked)}/>
            </div>
            
            <div className="modal__piepag">
              <Button name_btn="Cancelar" style="btn__modal" color="close--style" onClick={() => closeModal(close)} />
              <Button name_btn="Agregar" style="btn__modal" color="create--style" onClick={() => addEvento(addFecha, pry, figura, tipo, etapa, check, evento, close )} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**** Función para visualizar los registros agregados en un modal ****/
export function ModalView({ id, data, addFecha, close, openDel, eventos }) {
  let newFecha, options, fecha;

  const [pry, setPry] = useState('');
  const [figura, setFigura] = useState('');
  const [tipo, setTipo] = useState('');
  const [etapa, setEtapa] = useState('');
  
  newFecha = new Date(data.fecha); // get fecha dd-mm-aa
  newFecha.setMinutes(newFecha.getMinutes() + newFecha.getTimezoneOffset());

  options = {year: 'numeric', month: 'long', day: 'numeric' };
  fecha = newFecha.toLocaleDateString("es-ES", options);

  return (
    <>
      <div className="modal">
        <div className="modal__view">
          <div className='modal__body'>
            <div className="fecha">{fecha} <FaCalendarDays className='icon icon__calendar'/></div>

            <div className='addOptions'>
              <h2>Nombre de proyecto: &nbsp;</h2>
              <select name="proyectoAdd" id="proyectoAdd" className="select_ color--update" value={pry} onChange={e => setPry(e.target.value)} >
                <option value={data.id_proyecto}>{data.nombre_proyecto}</option>
                <ReadProyecto />
              </select>

              <h2>Figura: &nbsp;</h2> 
              <select name='figuraAdd' id="figuraAdd" className="select_ color--update" value={figura} onChange={e => setFigura(e.target.value)} >
                <option value={data.id_figura}>{data.nombre_figura}</option>
                <ReadFigura />
              </select>

              <h2>Aplicación: &nbsp;</h2>
              <select name='tipoAdd' id="tipoAdd" className="select_ color--update" value={tipo} onChange={e => setTipo(e.target.value)} >
                <option value={data.id_tipo}>{data.nombre_tipo}</option>
                <ReadTipo />
              </select>

              <h2>Etapa: &nbsp;</h2>
              <select name="etapaAdd" id="etapaAdd" className="select_ color--update" value={etapa} onChange={e => setEtapa(e.target.value)} >
                <option value={data.id_etapa}>{data.descripcion_etapa}</option>
                <ReadEtapa />
              </select>
            </div>

            <div className="modal__piepag">
              <Button name_btn="Cancelar" style="btn__modal" color="close--style" onClick={() => closeModal(close)} />
              <Button name_btn="Actualizar" style="btn__modal" color="update--style" onClick={() => updateEvento(id, addFecha, pry, figura, tipo, etapa, close, eventos)} />
              <Button name_btn="Eliminar" style="btn__modal" color="delete--style" onClick={() => (openModal(openDel), closeModal(close))}/>
            </div>
          </div>
        </div>
      </div>  
    </>
  );
}

/**** Función para mostrar modal para eliminar registros ****/
export function ModalDelete({ id, close, evento }) {
  return (
    <div className='modal'>
      <div className='modal__view'>
        <div className='modal__body'>
          <p>La confirmación eliminará este registro, una vez eliminado no podrá recuperarse...</p>
          <h3>¿Desea eliminarlo?</h3>

          <div className="modal__piepag">
            <Button name_btn="Cancelar" style="btn__modal" color="close--style" onClick={() => closeModal(close)} />
            <Button name_btn="Eliminar" style="btn__modal" color="delete--style" onClick={() => deleteEvento(id, close, evento)} />            
          </div>
        </div>
      </div>
    </div>
  )
}

export function CreateProyecto({ close }) {
  const [nombre, setNombre] = useState('');

  return (
    <div className='modal'>
      <div className='modal__view'>
        <div className='modal__body'>
          <input className='input__text' type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder='Nombre del proyecto' />            
          <div className='modal__piepag'>
            <Button name_btn="Cancelar" style="btn__pry" color="close--style" onClick={() => closeModal(close)} />
            <Button name_btn="Crear" style="btn__pry" color="create--style" onClick={() => newProyect(nombre, close)} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**** Función para abrir modals ****/
export function openModal(open) {
  open(true);
}

/**** Función para cerrar modals ****/
export function closeModal(close) {
  close(false);
}