"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNmeaTime = exports.parseNmeaRMC = exports.readNmeaFile = exports.handleNmeaFile = void 0;
const fs = __importStar(require("fs"));
const index_1 = require("location-utilities/es5/index");
function handleNmeaFile(filePath) {
    try {
        const nmeaCoordinates = readNmeaFile(filePath);
        return nmeaCoordinates.map(parseNmeaRMC);
    }
    catch (error) {
        console.error(`Error processing NMEA file`);
        throw error;
    }
}
exports.handleNmeaFile = handleNmeaFile;
function readNmeaFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent.split('\n').filter((line) => line.startsWith('$GPRMC'));
}
exports.readNmeaFile = readNmeaFile;
function parseNmeaRMC(nmeaCoord) {
    const data = index_1.LocationUtility.parseRMC(nmeaCoord, 'metric');
    const { latitude, longitude, date, time } = data;
    const parsedNMEATime = parseNmeaTime(date, time);
    return {
        latitude,
        longitude,
        time: parsedNMEATime,
    };
}
exports.parseNmeaRMC = parseNmeaRMC;
function parseNmeaTime(nmeadate, time) {
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
exports.parseNmeaTime = parseNmeaTime;
