import { combineLatest, Subject } from "rxjs";
import { filter, map, sample } from "rxjs/operators";
import { objects$, setPlayer$, ticker$ } from "./Core";

export const setCanvas$ = new Subject<string>();
const onSetCanvasEvent = setCanvas$.pipe(
    map((id: string) => document.getElementById(id) as HTMLCanvasElement),
    filter((canvas) => !!canvas),
    map((canvas: HTMLCanvasElement) => ({
        canvas,
        context: canvas.getContext("2d"),
    })),
);
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;

const renderer$ = combineLatest(ticker$, onSetCanvasEvent, objects$, setPlayer$)
                    .pipe(
                        sample(ticker$),
                    );

renderer$.subscribe(draw);
function draw([ticker, { canvas, context}, objects, player]: any) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(context, player.data.x);
}

function drawPaddle(context: CanvasRenderingContext2D, position: number) {
    context.beginPath();
    context.rect(
        position - PADDLE_WIDTH / 2,
        context.canvas.height - PADDLE_HEIGHT,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
    );
    context.fill();
    context.closePath();
}
