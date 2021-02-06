import styled from "@emotion/styled";

const RightArrow = styled.svg`
  width: 3rem;
  height: 3rem;

  & > path {
    fill: white;
  }
`;

const LeftArrow = styled(RightArrow)`
  transform: rotate(180deg);
`;

const Arrow = (props: { dir: "left" | "right" }) => {
  const { dir } = props;
  const DirArrow = dir === "left" ? LeftArrow : RightArrow;

  return (
    <DirArrow viewBox="0 0 490.8 490.8">
      <path d="M135.685,3.128c-4.237-4.093-10.99-3.975-15.083,0.262c-3.992,4.134-3.992,10.687,0,14.82l227.115,227.136L120.581,472.461c-4.237,4.093-4.354,10.845-0.262,15.083c4.093,4.237,10.845,4.354,15.083,0.262c0.089-0.086,0.176-0.173,0.262-0.262l234.667-234.667c4.164-4.165,4.164-10.917,0-15.083L135.685,3.128z" />
    </DirArrow>
  );
};

export default Arrow;
