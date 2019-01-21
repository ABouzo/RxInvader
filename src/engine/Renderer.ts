import { combineLatest, fromEvent, Subject } from "rxjs";
import { filter, map, sample } from "rxjs/operators";
import { ticker$ } from "./Core";
import { IGameObject, objects$ } from "./Objects";

const setCanvas$ = new Subject<string>();
const onSetCanvasEvent$ = setCanvas$.pipe(
    map((id: string) => document.getElementById(id) as HTMLCanvasElement),
    filter((canvas) => !!canvas),
    map((canvas: HTMLCanvasElement) => ({
        canvas,
        context: canvas.getContext("2d"),
    })),
);

const renderer$ = combineLatest(ticker$, onSetCanvasEvent$, objects$)
    .pipe(
        filter(([ticker, { canvas, context }]) => (!!canvas && !!context)),
        sample(ticker$),
        map(([ticker, {canvas, context}, objects]) => ({canvas, context, objects})),
    );

export function DEFAULT_DRAW_SPRITE({canvas, context, objects}: any) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach((element: IGameObject) => {
        element.draw(element, canvas, context);
    });
}

export function initRenderer(canvasId: string, drawFunction: ({canvas, context, objects}: any) => void) {
    fromEvent(window, "load").subscribe(() => setCanvas$.next(canvasId));
    renderer$.subscribe(drawFunction);
}
