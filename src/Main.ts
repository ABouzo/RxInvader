import { combineLatest } from "rxjs";
import { filter, map, sample } from "rxjs/operators";
import { ticker$ } from "./engine/Core";
import { input$ } from "./engine/Input";
import { addObject$, IGameObject, objects$ } from "./engine/Objects";
import { DEFAULT_DRAW_SPRITE, initRenderer } from "./engine/Renderer";

// tslint:disable:no-console
initRenderer("game", DEFAULT_DRAW_SPRITE);
combineLatest(ticker$, objects$)
    .pipe(
        sample(ticker$),
        map(([time, gameObjects]) => Array.from(gameObjects.values())),
    )
    .subscribe((gameObjects: IGameObject[]) => {
        gameObjects.forEach((element) => {
            element.location.x += element.velocity.x;
            element.location.y += element.velocity.y;
        });
    });
combineLatest(ticker$, input$, objects$)
    .pipe(sample(ticker$))
    .subscribe(([time, keys, objects]) => {
        const player = objects.get("player");
        if (player) {
            if (keys.includes("d")) {
                player.velocity.x = 5;
            } else if (keys.includes("a")) {
                player.velocity.x = -5;
            } else {
                player.velocity.x = 0;
            }
            if (keys.includes("w")) {
                addObject$.next({
                    draw: (gameObjects, canvas, context) => {
                        const position = gameObjects.location;
                        const WIDTH = 20;
                        const HEIGHT = 20;
                        context.beginPath();
                        context.rect(
                            position.x - WIDTH / 2,
                            position.y,
                            WIDTH,
                            HEIGHT,
                        );
                        context.fill();
                        context.closePath();
                    },
                    id: "bullet",
                    location: { x: player.location.x, y: player.location.y - 40},
                    velocity: { x: player.velocity.x, y: -2 },
                });
            }
        }
    });
addObject$.next({
    draw: (gameObject: IGameObject, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        const position = gameObject.location;
        const PADDLE_WIDTH = 100;
        const PADDLE_HEIGHT = 20;
        context.beginPath();
        context.rect(
            position.x - PADDLE_WIDTH / 2,
            position.y,
            PADDLE_WIDTH,
            PADDLE_HEIGHT,
        );
        context.fill();
        context.closePath();
    },
    id: "player",
    location: { x: 0, y: 500 - 20 },
    velocity: { x: 0, y: 0},
});
