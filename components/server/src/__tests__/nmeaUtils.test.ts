import { parseNmeaRMC, parseNmeaTime, readNmeaFile } from '../nmeaUtils';
import fs from 'fs';

const mockFilePath = 'server\\src\nmeaFiles\\leixoes_campanha.txt';
const mockFileContent = `
$GPGGA,150844.361,4111.566,N,00840.884,W,1,12,1.0,0.0,M,0.0,M,,*7C
$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30
$GPRMC,150844.361,A,4111.566,N,00840.884,W,038.9,013.7,290622,000.0,W*62
$GPGGA,150845.361,4111.577,N,00840.881,W,1,12,1.0,0.0,M,0.0,M,,*78
$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30
$GPRMC,150845.361,A,4111.577,N,00840.881,W,038.9,013.7,290622,000.0,W*66
`;

jest.mock('fs');

describe('NMEA utils', () => {
  it('should read file and filter for GPRMC', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockFileContent);

    const result = readNmeaFile(mockFilePath);

    expect(result).toStrictEqual([
      '$GPRMC,150844.361,A,4111.566,N,00840.884,W,038.9,013.7,290622,000.0,W*62',
      '$GPRMC,150845.361,A,4111.577,N,00840.881,W,038.9,013.7,290622,000.0,W*66',
    ]);
  });

  it('should parseNmeaRmc correctly', () => {
    const mockNmeaRMC =
      '$GPRMC,150854.361,A,4111.674,N,00840.871,W,038.9,005.4,290622,000.0,W*6D';
    
    const expectedData = {
      latitude: 41.19456666666667,
      longitude: -8.681183333333333,
      time: '29/06/22 15:08:54',
    };

    const result = parseNmeaRMC(mockNmeaRMC);

    expect(result).toStrictEqual(expectedData);
  });

  it('should correctly format NMEA date and time', () => {
    const nmeaDate = 290622;
    const nmeaTime = 150844.361;

    const expectedFormattedDateTime = '29/06/22 15:08:44';
    const result = parseNmeaTime(nmeaDate, nmeaTime);

    expect(result).toBe(expectedFormattedDateTime);
 });

});