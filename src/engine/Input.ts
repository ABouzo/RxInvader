import { fromEvent, merge } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";

export const input$ = merge(
    fromEvent(document, "keydown").pipe(
        map((event: any) => ({key: event.key, pressed: true})),
    ),
    fromEvent(document, "keyup").pipe(
        map((event: any) => ({key: event.key, pressed: false})),
    ),
).pipe(distinctUntilChanged((prev, next) => prev.key === next.key && prev.pressed === next.pressed));
