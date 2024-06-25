export interface StartReplayParams {
  filePath: string;
  speed: number;
  delay: number;
}

export interface TrainLocation {
  latitude: number;
  longitude: number;
  time?: number | string;
  date?: number;
}
