import { IGameObject, IInitialGameObjectData } from "./engine/Objects";
import { IPoints } from "./engine/Models";

export function bulletFactory(player: IGameObject, velocity: IPoints = { x: 0, y: -2 }): IInitialGameObjectData {
    return ({
        name: "bullet",
        location: { x: player.location.x, y: player.location.y - player.size.y },
        size: { x: 10, y: 10},
        velocity,
        draw: (gameObjects: IGameObject, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
            const position = gameObjects.location;
            const size = gameObjects.size;
            context.beginPath();
            context.rect(
                position.x - (size.x / 2),
                position.y - (size.y / 2),
                size.x,
                size.y,
            );
            context.fill();
            context.closePath();
        },
    })
}

export function playerFactory(): IInitialGameObjectData {
    return ({
        name: "player",
        location: { x: 5, y: 500 - 30 },
        size: { x: 40, y: 20 },
        draw: (gameObject: IGameObject, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
            const position = gameObject.location;
            const size = gameObject.size;
            context.beginPath();
            context.rect(
                position.x - size.x / 2,
                position.y,
                size.x,
                size.y,
            )
            context.rect(
                position.x - (size.x / 2) / 2,
                position.y - (size.y / 2),
                size.x / 2,
                size.y / 2,
            )
            context.fill();
            context.closePath();
        },
    })
}