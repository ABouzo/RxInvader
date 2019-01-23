import { combineLatest } from "rxjs";
import { filter, map, sample, throttleTime } from "rxjs/operators";
import { ticker$ } from "./engine/Core";
import { input$ } from "./engine/Input";
import { addGameObject, IGameObject, objects$ } from "./engine/Objects";
import { DEFAULT_DRAW_SPRITE, initRenderer } from "./engine/Renderer";
import { bulletFactory, playerFactory } from "./ObjectFactory";

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

const inputWithObjects = combineLatest(ticker$, input$, objects$)
    .pipe(
        sample(ticker$),
        map(([time, keys, objects]) => ({ keys, objects }))
    );

const playerControl = inputWithObjects.pipe(
    map(({ keys, objects }) => {
        const player: IGameObject = Array.from(objects.values()).find((gameObject) => gameObject.name === "player") as IGameObject;
        return ({ keys, player });
    }),
    filter(({ player }) => !!player),
);

playerControl.pipe(filter(({keys}) => !keys.includes("a") && !keys.includes("d")),map(({player}) => player)).subscribe((player) => player.velocity.x = 0);
getStreamForInput("w").pipe(throttleTime(500)).subscribe((player) => addGameObject(bulletFactory(player)));
getStreamForInput("a").subscribe((player) => player.velocity.x = -5);
getStreamForInput("d").subscribe((player) => player.velocity.x = 5);
getStreamForInput("s").pipe(throttleTime(1000)).subscribe((player) => {
    addGameObject(bulletFactory(player));
    addGameObject(bulletFactory(player, { x: -2, y: -2}));
    addGameObject(bulletFactory(player, { x: 2, y: -2}));
});

addGameObject(playerFactory());

function getStreamForInput(...lookingFor: string[]) {
    return playerControl.pipe(
        filter(({keys}) => keys.some((key) => lookingFor.includes(key))),
        map(({player}) => player)
    )
}