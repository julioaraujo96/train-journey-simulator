import { TrainLocation, StartReplayParams } from './types';
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

export function readNmeaFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return fileContent.split('\n').filter((line) => line.startsWith('$GPRMC'));
}

export function parseNmeaRMC(nmeaCoord: string) {
  const data = LocationUtility.parseRMC(nmeaCoord, 'metric');
  const { latitude, longitude, date, time }: TrainLocation = data;

  const parsedNMEATime = parseNmeaTime(date, time);
  return {
    latitude,
    longitude,
    time: parsedNMEATime,
  };
}

export function parseNmeaTime(nmeadate: number, time: number) {
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

  return `${formattedDate} ${formattedTime}`;
}
