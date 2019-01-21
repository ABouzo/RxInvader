import { merge, Subject } from "rxjs";
import { filter, map, scan, share } from "rxjs/operators";
export interface IGameObject {
    id: string;
    location: {
        x: number,
        y: number,
    };
    velocity: {
        x: number,
        y: number,
    };
    draw: (gameObject: IGameObject, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
}

export const addObject$ = new Subject<IGameObject>();
export const removeObject$ = new Subject<IGameObject>();

const onAddObjectEvent$ = merge(
        addObject$,
    ).pipe(
    filter(() => true), // TODO sanitize
    map((obj) => ({
        data: obj,
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
                return store.set(obj.id, obj);
            case "remove":
                store.delete(obj.id);
                break;
        }
        return store;
    }, new Map()),
    share(),
);
