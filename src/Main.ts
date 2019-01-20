import { fromEvent } from "rxjs";
import { take } from "rxjs/operators";
import { onPlayerMove$, setPlayer$, ticker$ } from "./engine/Core";
import { setCanvas$ } from "./engine/Renderer";

// tslint:disable:no-console
fromEvent(window, "load").subscribe(() => {
    setCanvas$.next("game");
    ticker$.subscribe();
    onPlayerMove$.subscribe(({input, player, objects}) => {
        if (input.includes("d")) {
            player.data.x += 10;
        }
        if (input.includes("a")) {
            player.data.x -= 10;
        }
    });
    setPlayer$.next({id: "player", data: {x: 0, y: 0}});
});
