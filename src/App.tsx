import { useState, useEffect, useRef } from 'react'

type MousePosition = {
  x: number;
  y: number;
}
type Time = {
  seconds: number, 
  milliseconds: number
}

const initialPosition: MousePosition = {x: 0, y: 0};
const initialTime: Time = {milliseconds: 0, seconds: 0};

function App() {
  const [enable, setEnable] = useState<Boolean>(false);
  const [position, setPosition] = useState<MousePosition>(initialPosition);
  const [time, setTime] = useState<Time>(initialTime);
  const intervalRef = useRef<number>();

  const handleMouseMove = (e: MouseEvent) => {
    const {clientX, clientY} = e;
    setPosition({x:clientX, y:clientY})

  }
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    if (enable) {
      const startTime = performance.now();

      intervalRef.current = window.setInterval(() => {
        const elapsedTime = performance.now() - startTime;

        setTime({
          seconds: Math.floor(elapsedTime / 1000),
          milliseconds: elapsedTime % 1000
        });
      }, 16);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(intervalRef.current);
    }
      
  }, [enable]);

  // Función para formatear los segundos y milisegundos en el estilo deseado
  const formatTime = (seconds: number, milliseconds: number) => {
    // Convertir los milisegundos a un valor decimal
    const decimalMilliseconds = milliseconds / 1000;
    // Sumar los segundos y los milisegundos, y redondear a dos decimales
    const totalTime = (seconds + decimalMilliseconds).toFixed(1);
    // Retornar el tiempo formateado
    return `${totalTime} segundos`;
  };

  return (
    <>
      <div
      className={`follower ${!enable || 'enabled'}`}
      style={{ top: position.y, left: position.x }}
    />
      <button
        onClick={() => setEnable(!enable)}
      >{enable ? 'Desactivar' : 'Activar'} seguimiento del mouse</button>
      <br />
      {/* <span>{`El tiempo transcurrido es ${time.seconds},${time.milliseconds.toString().padStart(3, '0')} seg`}</span> */}
      <span>{`El tiempo transcurrido es ${formatTime(time.seconds, time.milliseconds)}`}</span>
    </>
  )
}

export default App
