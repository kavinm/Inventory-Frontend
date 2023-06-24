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
        key={idx + delay * 1000} // Modified keys to ensure they are unique across groups
        borderRadius="73px"
        width="434px"
        height="434px"
        background="linear-gradient(45deg, #000000 0%, #171617 100%)"
        style={{ filter: "blur(12px)" }}
        animation={`${slide} 40s linear infinite`} // Duration doubled
        animationDelay={`${(idx / 72) * 40 + delay}s`} // Delay time also doubled
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
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/cr966y2g9y-145%3A965?alt=media&token=82c4fb3c-d805-4fb7-ad81-cb4ee9a3dcdf"
        alt="Inventory Icon"
        boxSize="40px"
      />
      <Text
        fontFamily="Roboto, sans-serif"
        lineHeight="1.2"
        fontWeight="bold"
        fontSize="22px"
        color="#FFFFFF"
        marginRight="10px">
        Inventory
      </Text>
    </Box>

    <Text
      fontFamily="Roboto, sans-serif"
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
      fontFamily="Roboto, sans-serif"
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
      fontFamily="Roboto, sans-serif"
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
