import { GetAsync } from "./repository.mjs";

export async function IsResourcesReadyAsync(gameId) {
    const game = await GetAsync(gameId);
    return game?.isResourcesReady === true;
}