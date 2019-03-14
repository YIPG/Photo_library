import { getRequest } from "./common";
import { ImagesResnponse, Image, ImageResponse } from "./types/responses";

export async function getList(): Promise<Image[]> {
  return getRequest<ImagesResnponse>("/images?limit=200").then(
    result => result.data.images
  );
}

export async function getImage(id: string): Promise<ImageResponse> {
  return getRequest<ImageResponse>(`/image/${id}`).then(result => result);
}
