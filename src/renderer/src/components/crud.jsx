import axios from 'axios';
import { useEffect, useState } from 'react';
import './css/calendario.css'



/**** Obtener registros de la tabla proyecto ****/
export const ReadProyecto = () => {
  const [proyecto, setProyecto] = useState([]);

  useEffect(() => {
    const getPry = async () => {
      try {
        const params = { "requestType": 'proyecto' };

        const response = await axios.get(url, { params });
        setProyecto(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }

    getPry();
  }, [proyecto]);
  
  return (
    <>
      {proyecto.map((row) => (<option value={row.id_proyecto} key={row.id_proyecto}>{row.nombre}</option>))}
    </>
  )
}

/**** Obtener registros de la tabla figura ****/
export const ReadFigura = () => {
  const [figura, setFigura] = useState([]);

  useEffect(() => {
    const getFigura = async () => {
      try {
        const params = { "requestType": 'figura' };

        const response = await axios.get(url, { params });
        setFigura(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }

    getFigura();
  }, []);
  
  return (
    <>
      {figura.map((row) => (<option value={row.id_figura} key={row.id_figura}>{row.nombre}</option>))}
    </>
  )
}

/**** Obtener registros de la tabla tipo ****/
export const ReadTipo = () => {
  const [tipo, setTipo] = useState([]);

  useEffect(() => {
    const getTipo = async () => {
      try {
        const params = { "requestType": 'tipo' };

        const response = await axios.get(url, { params });
        setTipo(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }

    getTipo();
  }, []);
  
  return (
    <>
      {tipo.map((row) => (<option value={row.id_tipo} key={row.id_tipo}>{row.nombre}</option>))}
    </>
  )
}

/**** Obtener registros de la tabla Etapa ****/
export const ReadEtapa = () => {
  const [etapa, setEtapa] = useState([]);

  useEffect(() => {
    const getTipo = async () => {
      try {
        const params = { "requestType": 'etapa' };

        const response = await axios.get(url, { params });
        setEtapa(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }

    getTipo();
  }, []);
  
  return (
    <>
      {etapa.map((row) => (<option value={row.id_etapa} key={row.id_etapa}>{row.descripcion}</option>))}
    </>
  )
}

/**** Obtener registros de la tabla evento ****/
export const getEventos = () => {
  const [evento, setEvento] = useState([]);

  useEffect(() => {
    const getDatos = async () => {
      const params = { "requestType": 'evento' };

      try {
        const response = await axios.get(url, { params });
        setEvento(response.data.data);
      } catch (error) {
        console.error('Ocurrió un error: ', error);
      }
    }

    getDatos();
  }, [evento]); // evento

  return evento;
}

export const getReportes = (status) => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const params = { "requestType": 'evento' };

      try {
        const response = await axios.get(url, { params });
        setReportes(response.data.data.filter(row => row.reporte !== status ? null : '1'));
      } catch (error) {
        console.error('Ocurrió un error', error);
      }
    }

    getData();
  }, [status]);

  return reportes;
}

/**** Agregar registros a la tabla evento ****/
export const addEvento = async (fecha, proyecto, figura, tipo, etapa, reporte, evento, estado) => {
  let data = {};

  data = {
    "requestType": 'evento',
    "fecha": fecha,
    "id_proyecto": proyecto,
    "id_figura": figura,
    "id_tipo": tipo,
    "id_etapa": etapa
  }

  if (reporte === true) {
    data.reporte = "1";
  }

  try { 
    const response = await axios.post(url, data);
    console.log(response.data.message);

    evento(prevEventos => [...prevEventos, data]);
    
    estado(false);
  } catch (error) {
    console.error(error);
  }
}

/**** Actualizar registro id_compilar de la tabla evento ****/
export const updateCompilar = async (id, compilar) => {
  const data = {
    "requestType": "evento", 
    "id_evento": id,
    "id_compilar": compilar
  }

  try {
    await axios.put(url, data);

  } catch (error) {
    if (error.request) {
      console.error("Sin rspuesta:", error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

/**** Actualizar registros de la tabla evento ****/
export const updateEvento = async ( id, fecha, proyecto, figura, tipo, etapa, close, setEvent ) => {
  const data = {
    "requestType": 'evento',
    "id_evento": id,
    "fecha": fecha,
    "id_proyecto": proyecto,
    "id_figura": figura,
    "id_tipo": tipo,
    "id_etapa": etapa
  }

  if (proyecto === '' && figura === '' && tipo === '' && etapa === '') {
    alert('Completa al menos uno de los campos');
  } else {
    try {
      const response = await axios.put(url, data);
      console.log(response.data.message);

      //... Mostrar cambios de eventos
      setEvent(prevEventos => prevEventos.map(item => (item.id === id ? {...item, fecha} : item)));
      close(false);
    } catch (error) {
      console.error(error);
    }
  }
}

/**** Eliminar registros de la tabla evento ****/
export const deleteEvento = async (id, close, evento) => {
  const data = {
    "requestType": 'evento',
    "id_evento": id
  }

  try {
    const response = await axios.delete(url, { data });
    console.log(response.data.message);

    //... Actualizar array de eventos
    evento(prevEventos => prevEventos.filter(item => item.id_evento !== id));
    close(false);
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta:', error.response.data);
    } else if (error.request) {
      console.error("Sin rspuesta:", error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

export const newProyect = async (nombre, close) => {
  const data = {
    "requestType" : 'proyecto',
    "nombre" : nombre
  }

  try {
    if (nombre === "") {
      console.log('El campo no puede quedar vacío')
    } else {
      const response = await axios.post(url, data);
      console.log(response.data.message);
      close(false);
    }
  } catch (error) {
    if (error.response) {
      console.log('Error en la respuesta: ', error.response.data);
    } else if (error.request) {
      console.log('Sin respuesta: ', error.request);
    } else {
      console.log('Ocurrió un error: ', error.message);
    }
  }
}

export const logg = async () => {
  try {
    const params = { "requestType" : 'users' }
    const response = await axios.get(url, { params });
    console.log(response.data.data);
  } catch (error) {
    if (error.response) {
      console.log('Error en la respuesta: ', error.response.data);
    } else if (error.request) {
      console.log('Sin respuesta: ', error.request);
    } else {
      console.log('Ocurrió un error: ', error.message);
    }
  }
}
