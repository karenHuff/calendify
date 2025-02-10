import { useState, useEffect, useRef } from 'react';
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { getEventos } from '../crud';

import defaults from '../img/defaults.png'
import check from '../img/check.png'
import warning from '../img/warning.png'
import error from '../img/error.png'
import iconRM from '../img/icon1.png'
import iconRR from '../img/icon2.png'
import logo from '../img/logo.png'
import eic from '../img/EIC 2025.png'
import encs from '../img/LOGO_ENCS_Azul.png';

import '../css/calendario.css';
import '../css/event.css';
import '../css/modal.css';
import Dias from './genDias';
import { Aplicacion, Compilacion, Reporte } from '../modal';

/*function ModalCalendar() {

  return (
    <>
      <div className="modal">
        <div className="modal__view modal--width">
          <div style={{marginTop: '35px'}} ></div>
          <div className="modal__body">
            <Calendario />
          </div>
        </div>
      </div>
    </>
  )
}


import { closeModal, openModal } from './modal';
import { IoClose } from "react-icons/io5";

function ModalCalendar() {
  const [btn, setbtn] = useState(true);

  return (
    <>
      {btn &&(<button type="button" onClick={() => closeModal(setbtn)}> VIEW CALENDARIO </button> )}
      {!btn &&( 
        <div className="modal">
          <div className="modal__view modal--width">
            <div className="close" > <IoClose className="modal__close"  onClick={() => openModal(setbtn)} /></div>
            <div className="modal__body">
              <Calendario />
            </div>
          </div>
        </div>
      )}
    </>
  )
}*/

function Calendario() {

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const images = [ `${logo}`, `${logo}`, `${eic}`, `${logo}`, `${encs}`];

  const [currentDate, setCurrentDate] = useState(new Date());

  const getName = useRef();

  const handlePrevMonth = () => { // ir a mes anterior 
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  }

  const handleNextMonth = () => { // ir a prox mes
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  }
  
  useEffect(() => {
    if (getName.current) {
      const mes = monthNames[currentDate.getMonth()];
      const anio = currentDate.getFullYear();
      getName.current.textContent = `${mes} ${anio}`;
    }
  }, [currentDate.getMonth(), currentDate.getFullYear()]);

  const [datos, setDatos] = useState([]);
  const [selectProyecto, setSelectProyecto] = useState('5');
  const [reporte, setReporte] = useState(true);

  const evento = getEventos(); // Obtener eventos

  useEffect(() => {
    setDatos(evento.filter(row => row.id_proyecto === '5'));
  }, [selectProyecto, evento]);

  const handleCheck = (value) => {
    setReporte(value);
  }

  return (
    <>
      <div className="container">
        <div className='cont__calendario'>
          <div className='head'>
            <div className='head__month'>
              <div className='button' onClick={handlePrevMonth}><IoIosArrowDropleftCircle className='btn__month'/></div>
              <div className='button' onClick={handleNextMonth}><IoIosArrowDroprightCircle className='btn__month' /></div>
              <div className='name__month'ref={getName}></div>
            </div>

            <div className="proyecto">
              <h1>Proyecto:</h1> 
              <h1 style={
                {
                  paddingLeft: '15px',
                  fontWeight: 'normal'
                }
              }>Encuesta Nacional de Caracterización Sociodemográfica</h1>
            </div>
          </div>

          <div className='body__calendar'>
            <Semana />
            <Dias monthNumber={currentDate.getMonth()} year={currentDate.getFullYear()} datos={datos} selectProyectos={selectProyecto} reporte={reporte} />
          </div>
        </div>

        <div className='cont__title'>
          <div className='body__title'>
            <div className='body__logo'>
              <picture className='logo'>
                <img src={`${selectProyecto <= 0 ? logo : images[selectProyecto-1]}`} className='img' />
              </picture>
            </div>
            <div className='body__leyenda'>
              <div className='leyenda'>
                <h3>Compilación</h3>  
                <>
                  <Compilacion nameIcon={defaults} title="Por compilar" />
                  <Compilacion nameIcon={check} title="Compilado" />
                  <Compilacion nameIcon={warning} title="Compilado con errores" />
                  <Compilacion nameIcon={error} title="No compilado" />
                </>

                <h3>Aplicación</h3>
                <>
                  <Aplicacion tipo="desarrollo" nombre="Desarrollo" />
                  <Aplicacion tipo="production" nombre="Producción" />
                  <Aplicacion tipo="in_capa" nombre="Actualización" />
                  <Aplicacion tipo="update" nombre="Inicio cap." />
                </>

                <h3>Reportes <input type="checkbox" checked={reporte} onChange={(e) => handleCheck(e.target.checked)} /></h3>
                <>
                  <Reporte type="reporte-m" icon={iconRM} />
                  <Reporte type="reporte-r" icon={iconRR} />
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <div className='cont__version'>
        <div className='version'>
          <h5>Version 1.0.0</h5>
        </div>
      </div>
    </>
  )
}

function Semana() {
  const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const days = weekDays.map((row, index) => (<div key={index} className="name__day">{row}</div>));

  return (
    <div className="week">
      <div className='week__days'>{days}</div>
    </div>
  )
}

export default Calendario;