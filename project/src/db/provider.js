import { CreateAsync, GetAsync } from "./repository.js";
export default { CreateGameAsync, IsResourcesReadyAsync };
async function CreateGameAsync(game) {
    await CreateAsync(game);
}
async function IsResourcesReadyAsync(gameId) {
    const game = await GetAsync(gameId);
    return game?.status === 1;
}
