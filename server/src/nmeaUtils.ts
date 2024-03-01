import { TrainLocation, StartReplayParams } from '../../common/types/types';
import * as fs from 'fs';
import { LocationUtility } from 'location-utilities/es5/index';

export function handleNmeaFile(filePath: string) {
  try {
    const nmeaCoordinates = readNmeaFile(filePath);
    return nmeaCoordinates.map(parseNmeaRMC);
  } catch (error) {
    console.error(`Error processing NMEA file`);
    throw error;
  }
}

function readNmeaFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return fileContent.split('\n').filter((line) => line.startsWith('$GPRMC'));
}

function parseNmeaRMC(nmeaCoord: string) {
  const data = LocationUtility.parseRMC(nmeaCoord, 'metric');
  const { latitude, longitude, date, time }: TrainLocation = data;

  const parsedNMEATime = parseNmeaTime(date, time);
  return {
    latitude,
    longitude,
    time: parsedNMEATime,
  };
}

function parseNmeaTime(nmeadate: number, time: number) {
  // Extrair a data e o tempo
const dateString = nmeadate.toString();
const timeString = time.toString();

// Formatar a data
const day = dateString.substring(0, 2);
const month = dateString.substring(2, 4);
const year = dateString.substring(4, 6);
const formattedDate = `${day}/${month}/${year}`;

// Formatar o tempo
const hours = timeString.substring(0, 2);
const minutes = timeString.substring(2, 4);
const seconds = timeString.substring(4, 6);
const formattedTime = `${hours}:${minutes}:${seconds}`;

return`${formattedDate} ${formattedTime}`;
}

//testes
// const read = readNmeaFile(
//   'C:\\Users\\arauj\\Desktop\\projetos\\train-journey-simulator\\server\\src\\nmeaFiles\\leixoes_campanha.txt'
// );
// console.log(read);

// const nmeaStringRMC =
//   '$GPRMC,150854.361,A,4111.674,N,00840.871,W,038.9,005.4,290622,000.0,W*6D';
// const parsedDataRMC = parseNmeaRMC(nmeaStringRMC);
// console.log(parsedDataRMC);
