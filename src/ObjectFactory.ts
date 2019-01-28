import { IGameObject, IInitialGameObjectData, IPoints } from "fluid-engine";

export function bulletFactory(player: IGameObject, velocity: IPoints = { x: 0, y: -2 }): IInitialGameObjectData {
    const x = (player.location.x + player.size.x / 2) - 5;
    return ({
        name: "bullet",
        location: { x, y: player.location.y - player.size.y },
        size: { x: 10, y: 10},
        velocity,
    });
}

export function playerFactory(): IInitialGameObjectData {
    return ({
        name: "player",
        location: { x: 5, y: 500 - 20 },
        size: { x: 40, y: 20 },
        draw: (gameObject: IGameObject, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
            const position = gameObject.location;
            const size = gameObject.size;
            context.fillStyle = "#000";
            context.beginPath();
            context.rect(
                position.x,
                position.y,
                size.x,
                size.y,
            );
            context.rect(
                position.x + (size.x / 4),
                position.y - (size.y / 4),
                size.x / 2,
                size.y / 2,
            );
            context.fill();
            context.closePath();
        },
    });
}

export function enemyFactory(location: IPoints) {
    return ({
        name: "enemy",
        location,
        size: {x: 30, y: 30},
        fill: "#F0F",
    });
}
