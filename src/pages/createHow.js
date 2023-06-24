import {
  Box,
  Flex,
  Text,
  Center,
  Button,
  extendTheme,
  CSSReset,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import { Global, css } from "@emotion/react";

const breakpoints = createBreakpoints({
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
});

const theme = extendTheme({ breakpoints });

const BoxContent = ({ number, title, description }) => (
  <Box
    paddingX="30px"
    paddingY="25px"
    borderRadius="8px"
    border="1px solid rgba(200, 200, 200, 0.12)"
    width="calc(25% - 2px)" // Adjusting the width to be 1/4 of the total length
    maxWidth="100%"
    background="linear-gradient(180deg, rgba(179, 107, 252, 0.1) 0%, rgba(0, 0, 0, 0) 100%)"
    mb={["10px", "0"]} // Adding margin at the bottom for mobile view
  >
    <Text
      fontFamily="Roboto"
      fontWeight="medium"
      fontSize="18px"
      letterSpacing="-0.01em"
      color="#B36BFC"
      mb={5}>
      {number}
    </Text>
    <Text
      fontFamily="Roboto"
      fontWeight="medium"
      fontSize="25px"
      letterSpacing="-0.03em"
      color="#FFFFFF"
      mb={3}>
      {title}
    </Text>

    <Text
      fontFamily="Roboto"
      fontWeight="regular"
      fontSize="18px"
      letterSpacing="-0.03em"
      color="rgba(255, 255, 255, 0.56)">
      {description}
    </Text>
  </Box>
);
const CreateHow = () => (
  <Flex
    direction="column"
    alignItems="center"
    justifyContent="center"
    w="100vw"
    h="100vh"
    bg="#151516"
    px={[0, 10]} // Adjusting the horizontal padding to handle responsiveness
    theme={theme}>
    {/* Adding global CSS to import the Roboto font */}
    <CSSReset />
    <Global
      styles={css`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");
      `}
    />

    <Text
      fontFamily="Roboto"
      fontWeight="regular"
      fontSize="50px"
      letterSpacing="-0.04em"
      color="#FFFFFF"
      textAlign="center"
      mb={4}>
      Create an Inventory
    </Text>
    <Text
      fontFamily="Roboto"
      fontWeight="medium"
      fontSize="18px"
      letterSpacing="-0.01em"
      color="#FFFFFF"
      textAlign="center"
      mb={10}>
      How it works
    </Text>
    <Flex
      direction={["column", "row"]} // Stacks vertically on small screens, horizontally on larger screens
      justify="space-evenly" // Adjusting the justify property to create minimal gap between boxes
      align="center"
      w="100%"
      mb={10}
      wrap="wrap" // Adding wrap property to allow boxes to wrap on smaller screens
    >
      <BoxContent
        number="1"
        title="Create"
        description="Give your inventory a name and a color to identify it"
      />
      <BoxContent
        number="2"
        title="Implement"
        description="Use our generated button to put on your site or call it via API"
      />
      <BoxContent
        number="3"
        title="Innovation"
        description="Allow players of your game to have a next-generation game experience"
      />
    </Flex>
    <Center>
      <Button
        as={NextLink}
        href="/createInput"
        paddingX="30px"
        paddingY="25px"
        borderRadius="14px"
        w="232px"
        h="63px"
        bg="linear-gradient(220deg, #b36bfc 0%, #6138cf 100%)"
        color="#FFFFFF"
        fontSize="18px"
        fontFamily="Roboto"
        fontWeight="medium"
        letterSpacing="-0.01em">
        Next
      </Button>
    </Center>
  </Flex>
);
export default CreateHow;
