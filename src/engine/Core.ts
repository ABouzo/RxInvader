import { animationFrameScheduler, combineLatest, interval, merge, Subject } from "rxjs";
import { filter, map, sample, scan, share, take } from "rxjs/operators";
import { input$ } from "./Input";

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

export interface IGameObject {
    id: string;
    data: {
        x: number,
        y: number,
    };
}

export const addObject$ = new Subject<IGameObject>();
export const removeObject$ = new Subject<IGameObject>();
export const setPlayer$ = new Subject<IGameObject>();

const onAddObjectEvent$ = merge(
        addObject$,
        setPlayer$.pipe(take(1)),
    ).pipe(
    filter(() => true), // TODO sanitize
    map((obj) => ({
        data: obj.data,
        type: "add",
    })),
);

const onRemoveObjectEvent$ = removeObject$.pipe(
    filter((obj) => true), // TODO sanitize
    map((obj) => ({
        data: obj,
        type: "remove",
    })),
);

export const objects$ = merge(
    onAddObjectEvent$,
    onRemoveObjectEvent$,
).pipe(
    scan<any, Map<string, IGameObject>>((store: Map<string, IGameObject>, item: any) => {
        const obj: IGameObject = item.data;
        switch (item.type) {
            case "add":
                store.set(obj.id, obj);
                break;
            case "remove":
                store.delete(obj.id);
                break;
        }
        return store;
    }, new Map()),
    share(),
);

export const onPlayerMove$ = combineLatest(ticker$, input$, setPlayer$, objects$).pipe(
    sample(ticker$),
    map(([ticker, input, player, objects]) => ({input, player, objects})),
);
