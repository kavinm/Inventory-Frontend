import { keyframes } from "@emotion/react";
import { Box, Text, Button, Link, Image } from "@chakra-ui/react";
import NextLink from "next/link";

const slide = keyframes`
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-100%) translateX(100%); }
`;

const makeSquares = (delay = 0) =>
  Array(72)
    .fill(0)
    .map((_, idx) => (
      <Box
        key={idx + delay * 1000}
        borderRadius="73px"
        width="434px"
        height="434px"
        background="linear-gradient(45deg, rgba(0, 0, 0, 1) 0%, rgba(112, 60, 212, 0.4) 100%)" // Added opacity to the purple color
        style={{ filter: "blur(12px)" }}
        animation={`${slide} 40s linear infinite`}
        animationDelay={`${(idx / 72) * 40 + delay}s`}
        gridColumn={(idx % 12) + 1}
        gridRow={Math.floor(idx / 12) + 1}
        zIndex="1"
      />
    ));

const IndexPage = () => (
  <Box
    width="100%"
    height="100vh"
    background="#000000"
    position="relative"
    overflow="hidden">
    <Box
      position="absolute"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridTemplateRows="repeat(6, 1fr)"
      gap="2%"
      width="200%"
      height="200%"
      top="-50%"
      left="-50%">
      {makeSquares(0)}
    </Box>

    {/* Navbar */}
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top="5%"
      left="50%"
      transform="translate(-50%, -50%)"
      zIndex="10">
      <Box marginRight="10px">
        <svg
          width="43.5"
          height="45"
          viewBox="0 0 29 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect
            width="29"
            height="30"
            rx="5"
            fill="#D9D9D9"
            fill-opacity="0.06"
          />
          <rect
            x="0.5"
            y="0.5"
            width="28"
            height="29"
            rx="4.5"
            stroke="white"
            stroke-opacity="0.09"
          />
          <rect x="5" y="11" width="19" height="2" fill="white" />
          <rect x="5" y="17" width="19" height="2" fill="white" />
          <rect
            x="13"
            y="19"
            width="8"
            height="2"
            transform="rotate(-90 13 19)"
            fill="white"
          />
        </svg>
      </Box>
      <Text
        fontFamily="'Graphik', sans-serif"
        lineHeight="1.2"
        fontWeight="bold"
        fontSize="25px"
        color="#FFFFFF">
        Inventory
      </Text>
    </Box>
    <Text
      fontFamily="'Graphik', sans-serif"
      lineHeight="0.97"
      fontWeight="bold"
      fontSize="55px"
      letterSpacing="-0.02em"
      color="#FFFFFF"
      textAlign="center"
      position="absolute"
      top="40%"
      left="50%"
      transform="translate(-50%, -50%)"
      width="600px"
      zIndex="10">
      Your Inventory for Everything
    </Text>

    <Button
      as={NextLink}
      href="/inventoryDash"
      fontFamily="'Graphik', sans-serif"
      fontWeight="medium"
      fontSize="22px"
      letterSpacing="-0.01em"
      color="#FFFFFF"
      background="linear-gradient(220deg, #b36bfc 0%, #5e37ce 100%)"
      borderRadius="83px"
      paddingX="36px"
      paddingY="30px"
      position="absolute"
      top="55%"
      left="50%"
      transform="translate(-50%, -50%)"
      zIndex="10">
      Open your Inventories
    </Button>

    <Link
      as={NextLink}
      href="/createHow"
      fontFamily="'Graphik', sans-serif"
      fontWeight="medium"
      fontSize="22px"
      letterSpacing="-0.01em"
      color="#9C64EC"
      position="absolute"
      top="65%"
      left="50%"
      transform="translate(-50%, -50%)"
      zIndex="10">
      Create an Inventory
    </Link>
  </Box>
);
export default IndexPage;
