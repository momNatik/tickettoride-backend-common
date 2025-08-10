import { CreateAsync, GetAsync } from "./repository.mjs";

export async function CreateGameAsync(game) {
    await CreateAsync(game);
}

export async function IsResourcesReadyAsync(gameId) {
    const game = await GetAsync(gameId);
    return game?.isResourcesReady === true;
}