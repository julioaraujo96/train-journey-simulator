export interface TrainLocation {
    latitude: number;
    longitude: number;
    time?: number;
}

export interface StartReplayParams {
    filePath: string;
    speed: number;
    delay: number;
}
