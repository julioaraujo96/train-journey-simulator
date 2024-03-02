# Train Journey Simulation

## Challenge

Implement a client-server solution to simulate a train journey based on a NMEA (gps) file attached;

The server should provide a command-line interface with at least three options: 
the input of NMEA file to replay, the replay speed factor (e.g. 2x, 3x, 10x), and an optional delay (e.g. 10s) to start replaying the given NMEA file. After
initialization, the server should accept clients' connections at any time. The server is responsible to notify connected clients about the train's current geolocation.

The web client should, at least, display the journey path and the train's current geolocation over a map.

## How to setup for development 
- Clone this repository into your projects folder.
- cd into server and run `npm install`
- cd into client and run `npm install`
### How to run client and server
Client:
- `npm run dev` <br>

Server:
- `npm run start:dev <filePath> <speedFactor> <delay : OPTIONAL>` (Default is 10 seconds).
- `npm run test` to run jest test suites.

### Environment Variables
I left a `.env.example` file in server and client, if you perhaps want to change the PORT or the app url or the server url.
Just rename it to `.env`, change the variables and you are good to go.
  
