import * as React from "react";
import styled from "@emotion/styled";

import { Image } from "../api/types/responses";

interface Props {
  image: Image;
}

export default ({ image }: Props) => (
  <Wrapper>
    <Img src={image.url} />
    <Title>{image.title}</Title>
    <Description>{image.description}</Description>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Title = styled.h1`
  padding: 0.5rem;
`;

const Description = styled.p`
  padding: 0.3rem;
`;

const Img = styled.img`
  width: 80vw;
  margin: 10vw;
`;
