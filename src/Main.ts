import { addGameObject, checkForCollision, DEFAULT_DRAW_SPRITE, IGameObject,
        initRenderer, input$, objects$, onCollisionEvent$, onRemoveObjectEvent$,
        removeGameObject, ticker$ } from "fluid-engine";
import { combineLatest, interval } from "rxjs";
import { filter, map, sample, throttleTime } from "rxjs/operators";
import { bulletFactory, enemyFactory, playerFactory } from "./ObjectFactory";

// tslint:disable:no-console
initRenderer("game", ({canvas, context, objects }) => {
    // Drawing ui
    // Done drawing ui
    DEFAULT_DRAW_SPRITE({canvas, context, objects});
});
combineLatest(ticker$, objects$)
    .pipe(
        sample(ticker$),
        map(([time, gameObjects]) => Array.from(gameObjects.values())),
    )
    .subscribe((gameObjects: IGameObject[]) => {
        gameObjects.forEach((element) => {
            element.location.x += element.velocity.x;
            element.location.y += element.velocity.y;
            const x = element.location.x;
            const y = element.location.y;
            if (x > 500 || x < 0 || y > 500 || y < 0) {
                removeGameObject(element.id);
            }
        });
        checkForCollision(...gameObjects);
    });

const inputWithObjects = combineLatest(ticker$, input$, objects$)
    .pipe(
        sample(ticker$),
        map(([time, keys, objects]) => ({ keys, objects })),
    );

const playerControl = inputWithObjects.pipe(
    map(({ keys, objects }) => {
        const player: IGameObject = Array.from(objects.values())
            .find((gameObject) => gameObject.name === "player") as IGameObject;
        return ({ keys, player });
    }),
    filter(({ player }) => !!player),
);

playerControl.pipe(filter(({ keys }) => !keys.includes("a") && !keys.includes("d")), map(({ player }) => player))
    .subscribe((player) => player.velocity.x = 0);
getStreamForInput("w").pipe(throttleTime(500)).subscribe((player) => addGameObject(bulletFactory(player)));
getStreamForInput("a").subscribe((player) => player.velocity.x = -5);
getStreamForInput("d").subscribe((player) => player.velocity.x = 5);
getStreamForInput("s").pipe(throttleTime(1000)).subscribe((player) => {
    addGameObject(bulletFactory(player));
    addGameObject(bulletFactory(player, { x: -2, y: -2 }));
    addGameObject(bulletFactory(player, { x: 2, y: -2 }));
});

addGameObject(playerFactory());
addGameObject(enemyFactory({
    x: 250,
    y: 250,
}));

function getStreamForInput(...lookingFor: string[]) {
    return playerControl.pipe(
        filter(({ keys }) => keys.some((key) => lookingFor.includes(key))),
        map(({ player }) => player),
    );
}

onCollisionEvent$.pipe(
    filter(({ data }) => !!data.find((gameObject: IGameObject) => gameObject.name === "bullet")),
).subscribe(({ data }) => {
    data.forEach((gameObject: IGameObject) => removeGameObject(gameObject.id));
});

onRemoveObjectEvent$.subscribe(({data}) => console.log("removing: ", data));
interval(5000).subscribe(() => {
    const x = Math.floor(Math.random() * (500 - 30) - 5) + 5;
    const y = Math.floor(Math.random() * (500 - 30) - 5) + 5;
    addGameObject(enemyFactory({ x, y}));
});
