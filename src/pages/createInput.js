import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Input,
  Button,
  Spacer,
  Circle,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { SketchPicker } from "react-color";
import NextLink from "next/link";
import { useState } from "react";
import { HuePicker } from "react-color";
import { useRouter } from "next/router";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function CreateInput() {
  const router = useRouter();
  const [color, setColor] = useState("#ff0000");
  const [gameName, setGameName] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  const handleGameNameChange = (event) => {
    setGameName(event.target.value);
  };

  const handleButtonClick = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`${apiUrl}/create-collection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: gameName,
          color: color.slice(1),
        }),
      });

      const data = await response.json();
      console.log(data);
      router.push(`/mintNft?collectionAddress=${data.collectionAddress}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const SvgComponent = () => (
    <svg
      width="500px"
      height="600px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 338 292">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "white", stopOpacity: "1" }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: "1" }} />
        </linearGradient>
      </defs>
      <rect
        x="10"
        y="10"
        rx="20"
        ry="20"
        width="318"
        height="262"
        fill="url(#gradient)"
      />
      <rect x="30" y="30" width="30" height="4" fill="#151516" />
      <rect x="43" y="30" width="4" height="20" fill="#151516" />
      <rect x="30" y="50" width="30" height="4" fill="#151516" />
    </svg>
  );

  return (
    <Box p={6} backgroundColor="#151516" color="white" minH="100vh">
      <Flex direction="column">
        <Flex justify="space-between">
          <Box display="flex" alignItems="center" as={NextLink} href="/">
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
                  fillOpacity="0.06"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="28"
                  height="29"
                  rx="4.5"
                  stroke="white"
                  strokeOpacity="0.09"
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
              fontFamily="Roboto, sans-serif"
              lineHeight="1.2"
              fontWeight="bold"
              fontSize="25px"
              color="#FFFFFF">
              <Text as="span" color="#FFFFFF">
                Inventory
              </Text>{" "}
              <Text as="span" color="#B36BFC">
                Developer
              </Text>
            </Text>
          </Box>
        </Flex>
        <Box mt={8}>
          <Divider orientation="horizontal" mb={60} borderColor="#5C5C5C" />
        </Box>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Flex flexDirection="column" alignItems="start" pl={20} mb={8}>
            <Flex flexDirection="column" alignItems="start" mt={8}>
              <Heading as="h2" size="2xl">
                Set up your game’s inventory
              </Heading>
              <Text fontSize="md" mt={4} color="gray.400">
                Name and style your inventory for how your users will see it in
                their wallet.
              </Text>
              <Flex flexDirection="row" mt={4}>
                <Box mr={40}>
                  <Text fontSize="md">What's the name of your game?</Text>
                  <Input
                    value={gameName}
                    placeholder="Game Name"
                    size="md"
                    my={2}
                    boxSizing="border-box"
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    p="25px 30px"
                    background="linear-gradient(238.01deg, rgba(217, 217, 217, 0.1) 23.35%, rgba(217, 217, 217, 0) 85.95%), rgba(98, 103, 113, 0.18)"
                    border="1px solid rgba(200, 200, 200, 0.12)"
                    borderRadius="65px"
                    onChange={handleGameNameChange}
                  />
                </Box>
                <Box>
                  <Text fontSize="md">Choose a theme colour</Text>
                  <Box mt={2}>
                    <HuePicker
                      color={color}
                      onChangeComplete={handleColorChange}
                    />
                  </Box>
                </Box>
              </Flex>
              <Button
                mt={10}
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                p="25px 30px"
                position="relative"
                width="266px"
                height="63px"
                bgGradient="linear-gradient(219.66deg, #B36BFC 18.38%, #6138CF 94.58%)"
                borderRadius="54px"
                onClick={handleButtonClick}
                isLoading={isLoading}
                // disable button if gameName is empty or isLoading is true
                isDisabled={gameName === "" || isLoading}>
                {isLoading ? <Spinner /> : "Finish setting up"}
              </Button>
            </Flex>
          </Flex>

          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={-100}>
            <SvgComponent />
          </Flex>
        </Grid>
      </Flex>
    </Box>
  );
}

export default CreateInput;
