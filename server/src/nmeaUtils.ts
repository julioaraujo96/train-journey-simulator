import { TrainLocation, StartReplayParams } from "../../common/types/types";
import * as fs from 'fs';
import { LocationUtility } from 'location-utilities/es5/index';

export function handleNmeaFile(params : StartReplayParams) {
    const { filePath, speed, delay } = params;

    try {
        const nmeaCoordinates = readNmeaFile(filePath);
    } catch (error) {
        console.error(`Error processing NMEA file`);
        throw error;
    }
}

function readNmeaFile(filePath : string){
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent.split('\n').filter(line => line.startsWith('$GPRMC'));
}

function parseNmeaRMC(nmeaCoord : string) {
    const data = LocationUtility.parseRMC(nmeaCoord, 'metric');
    const { latitude, longitude, time } : TrainLocation = data;
    return {
            latitude, 
            longitude, 
            time,
        };
}

//testes
const read = readNmeaFile('C:\\Users\\arauj\\Desktop\\projetos\\train-journey-simulator\\server\\src\\nmeaFiles\\leixoes_campanha.txt');
console.log(read);

const nmeaStringRMC = '$GPRMC,150854.361,A,4111.674,N,00840.871,W,038.9,005.4,290622,000.0,W*6D';
const parsedDataRMC = parseNmeaRMC(nmeaStringRMC);
console.log(parsedDataRMC);
