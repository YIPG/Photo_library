import * as React from "react";
import styled from "@emotion/styled";

import { getList } from "../api";
import { Image } from "../api/types/responses";
import ImageList from "../components/ImageList";

export default () => {
  const [images, setImages] = React.useState<Image[]>([]);

  React.useEffect(() => {
    (async () => {
      setImages(await getList());
    })();
  }, []);

  console.log({ images });

  return <ImageList images={images} />;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
