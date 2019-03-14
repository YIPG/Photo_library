import * as React from "react";
import styled from "@emotion/styled";

import { getList } from "./api";
import { Image } from "./api/types/responses";

export default () => {
  const [images, setImages] = React.useState<Image[]>([]);

  const [query, setQuery] = React.useState("");
  React.useEffect(() => {
    (async () => {
      setImages(await getList());
    })();
  }, []);
};
