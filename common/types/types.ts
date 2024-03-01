export interface TrainLocation {
    latitude: number;
    longitude: number;
    time?: number | string;
    date?: number;
}

export interface StartReplayParams {
    filePath: string;
    speed: number;
    delay: number;
}
