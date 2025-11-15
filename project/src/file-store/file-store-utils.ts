import { GetFileAsync } from "./game-files.js";

export function GetFileStoreKey(resourseType, ...ids) {
  const prefix = GetFileStoreKeyPrefix(ids);
  const resourceName = GetResourceName(resourseType);
  return `${prefix}${resourceName}`;
}

function GetFileStoreKeyPrefix(...ids) {
  const notEmptyIds = ids.filter((id) => id).map((id) => `${id}_`);
  return notEmptyIds.join("");
}

function GetResourceName(type) {
  const resourceNames = {
    landscape: "map_landscape.png",
    topology: "map_topology.svg",
    avatar: "player_avatar.jpg",
  };
  return resourceNames[type];
}

export async function SendResourseAsync(key, res) {
  const fileResponse = await GetFileAsync(key);

  res.writeHead(200, {
    "Content-Type": fileResponse.ContentType,
    "Content-Length": fileResponse.ContentLength,
  });

  const buffer = await fileResponse.Body.transformToByteArray();
  res.end(buffer);
}