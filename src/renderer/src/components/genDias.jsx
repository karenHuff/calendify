import { useEffect, useState } from "react";
import { ModalAdd } from "./modal";
import { Evento } from "./evento";
import './css/calendario.css';

function Dias({ monthNumber, year, datos, selectProyectos, reporte }) {

  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const currentDate = new Date();

  const [dateElements, setDateElements] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectDate, setSelectDate] = useState(''); //mostrar fecha

  const [addDate, setAddDate] = useState(''); //guardar fecha

  const [evento, setEvento] = useState([]);

  let today, isHoliday, getFecha, isSaturday, isSunday;
  
  //... Estructura de calendario
  useEffect(() => {
    const elements = [];

    let count = 32;

    //... Generar días anteriores para visualizar el inicio del mes
    for (let i = startDay(); i > 0; i--) {
      if (startDay() !== 7) {
        elements.push(
          <div className='day' key={count++} />
        );
      }
    }

    let sat = 7 - startDay() === 0 ? 7 : (7 - startDay());
    let sun = 8 - startDay();
    
    //... Generar los días del mes 
    for (let i = 1; i <= getTotalDays(monthNumber); i++) {
      //... Comprobar los días inhábiles
      if (( monthNumber === 0 || monthNumber === 4 ) && i === 1) {
        isHoliday = true;
      } else if (monthNumber === 1 && i === 3) {
        isHoliday = true;
      } else if (monthNumber === 2 && i === 17) {
        isHoliday = true;
      } else if (monthNumber === 3 && ( i === 17 || i === 18 )) {
        isHoliday = true;
      } else if (monthNumber === 4 && i === 5) {
        isHoliday = true;
      } else if (monthNumber === 6 && i === 8) {
        isHoliday = true;
      }else if (monthNumber === 8 && i === 16) {
        isHoliday = true;
      } else if (monthNumber === 10 && i === 18) {
        isHoliday = true;
      } else if (monthNumber === 11 && i === 25) {
        isHoliday = true;
      } else {
        isHoliday = false;
      }

      if (i === sat) {
        isSaturday = true; 
        sat += 7;
      } else {
        isSaturday = false;
      }

      if (i === sun) {
        isSunday = true;
        sun += 7;
      } else {
        isSunday = false;
      }

      //... Indicar el dia actual del mes      
      today = currentDate.getMonth() === monthNumber && currentDate.getDate() === i;

      /**** Obtener la fecha en formato 'yyyy-mm-dd' ****/
      getFecha = `${year}-${addZero(monthNumber+1)}-${addZero(i)}`;

      elements.push(
        <div className={`day ${isHoliday ? 'day__holid' : 'day__t'} ${isSunday && 'day__weekend day__img'} ${isSaturday && 'day__weekend day__img'} ${today ? 'day__today' : 'day__t' } `} onDoubleClick={() => openModal(i)} key={i}>
          <div className="number">{i}</div>
          <div className="evento evento--grid">
            <Evento fecha={getFecha} eventos={evento} proyecto={datos} id_proyecto={selectProyectos} setEvent={setEvento} reporte={reporte} />
          </div>
        </div>
      );
    }

    setDateElements(elements);
      
  }, [monthNumber, year, datos, selectProyectos, evento, reporte]);

  /* Calcular días que tienen 30 y 31 días */
  const getTotalDays = (monthNumber) => {
    if (monthNumber === 11 || monthNumber === 2 || monthNumber === 4 || monthNumber === 6 || monthNumber === 7 || monthNumber === 9 || monthNumber === 0) {  
      return 31;    
    } else if (monthNumber === 3 || monthNumber === 5 || monthNumber === 8 || monthNumber === 10) {
      return 30;
    } else {
      //... Si no es ninguno de los dos
      return isleap() ? 29:28;
    }
  }

  /* Calcular año bisiesto */
  const isleap =() => {
    if ( (year % 100 !== 0 && year % 4 === 0) || (year % 400 === 0) ) {
      return true;
    }
    return false;
  }

  const startDay = () => {
    let start = new Date(year, monthNumber, 1);
    return( (start.getDay()-1) === -1 ) ? 7 : start.getDay();
  }

  const addZero = (number) => ( number < 10 ? `0${number}` : number );

  const openModal = (dia) => {
    setSelectDate(`${dia} de ${monthNames[monthNumber]} de ${year}`);
    setAddDate(`${year}-${addZero(monthNumber+1)}-${addZero(dia)}`);
    setOpen(true);
  }

  return (
    <>
      <div className="dates dates--tam">{dateElements}</div>

      {open &&(
        <ModalAdd close={setOpen} viewFecha={selectDate} addFecha={addDate} evento={setEvento} />
      )}
    </>
  )
}

export default Dias;