export interface ImagesResnponse {
  ok: boolean;
  data: {
    images: Image[];
  };
}

export interface ImageResponse {
  ok: boolean;
  data: Image;
}

export interface Image {
  location: {
    lat: number;
    lng: number;
  };
  id: number;
  url: string;
  title: string;
  description: string;
  postDatetime: number;
  width: number;
  height: number;
}
