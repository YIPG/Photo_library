import * as React from "react";
import { getImage } from "../api";
import DetailImage from "../components/detail";

import { ImageResponse } from "../api/types/responses";
import { RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps<{ id: string }> {}

export default ({ match }: Props) => {
  const [image, setImage] = React.useState<ImageResponse | null>(null);

  React.useEffect(() => {
    console.log("詳細画面にきたぜ");
    (async () => {
      setImage(await getImage(match.params.id));
    })();
  }, []);

  console.log(image);

  return image !== null && <DetailImage image={image.data} />;
};
