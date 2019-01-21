import { animationFrameScheduler, interval } from "rxjs";
import { map, scan } from "rxjs/operators";

export const ticker$ = interval(1000 / 60, animationFrameScheduler)
    .pipe(
        map(() => ({
            deltaTime: 0,
            time: Date.now(),
        })),
        scan((previous, current) => ({
            deltaTime: (current.time - previous.time) / 1000,
            time: current.time,
        })),
    );
