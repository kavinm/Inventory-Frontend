import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Heading,
  Box,
  Text,
  Flex,
  Button,
  useClipboard,
  Divider,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import axios from "axios";
import QRCode from "qrcode.react";
import { useAccount } from "wagmi";
import { polygon } from "viem/chains";

const MintNft = () => {
  const [collectionName, setCollectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const { collectionAddress } = router.query;
  const { address, isConnecting, isDisconnected } = useAccount();
  const { onCopy, hasCopied } = useClipboard(router.asPath);
  const polygonUrl = process.env.NEXT_PUBLIC_POLYGON_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (collectionAddress) {
      const fetchCollectionName = async () => {
        const provider = new ethers.providers.JsonRpcProvider(polygonUrl);
        const nftContract = new ethers.Contract(
          collectionAddress,
          ["function name() view returns (string)"],
          provider
        );
        const contractName = await nftContract.name();
        setCollectionName(contractName);
      };

      fetchCollectionName();
    }
  }, [collectionAddress]);

  const handleMint = async () => {
    setIsLoading(true);
    if (!collectionAddress || !address) {
      console.log("Waiting for data...");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/mint`, {
        contractAddress: collectionAddress,
        address: address, // Use the connected address
      });

      console.log(response.data);
      setTransaction(response.data);
      setIsLoading(false);
      onOpen();
    } catch (error) {
      console.error("Error minting token:", error);
      setIsLoading(false);
    }
  };

  const handleGoToInventory = () => {
    router.push("/inventoryDash");
  };

  return (
    <Box backgroundColor="#151516" minHeight="100vh">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="#151516"
        color="white"
        p={5}>
        <Flex>
          <Text fontSize="lg">Inventory</Text>
          <Text color="#B36BFC" fontSize="50%" ml={2}>
            Developer
          </Text>
        </Flex>
        <Box
          borderRadius="65px"
          backgroundColor="rgba(115, 101, 111, 0.1)"
          px={4}
          py={2}
          display="flex"
          alignItems="center"
          position="absolute"
          left="50%"
          top="3.5%"
          transform="translate(-50%, -50%)">
          <Text color="#5C5C5C" pr={4}>
            Create
          </Text>
          <Text color="White">Implement</Text>
        </Box>
        <ConnectButton />
      </Flex>
      <Divider orientation="horizontal" mb={60} borderColor="#5C5C5C" />
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={10}
        p={10}
        mt={-40}>
        <GridItem
          display="flex"
          flexDirection="column"
          justifySelf={{ base: "center", md: "end" }}
          justifyContent="center">
          <Flex align="center" mb={5}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 33 33"
              width="33"
              height="33"
              fill="none">
              <circle
                cx="16.5"
                cy="16.5"
                r="16.5"
                fill="#40D873"
                fillOpacity="0.1"
              />
              <path
                d="M10 17L14.5 21.5L24 12"
                stroke="#40D873"
                strokeWidth="2"
              />
            </svg>
            <Text ml={2} color="green.500">
              Success
            </Text>
          </Flex>
          <Heading as="h2" size="2xl" color="white" mb={5}>
            Your inventory has been created
          </Heading>
          <Text color="gray.300" fontSize="xl" mb={5}>
            Integrate this on your site with our documentation
          </Text>
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
            onClick={handleMint}
            isLoading={isLoading}>
            {isLoading ? <Spinner /> : "Mint Token"}
          </Button>
        </GridItem>
        <GridItem
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifySelf={{ base: "center", md: "start" }}
          pl={{ md: "40" }}
          justifyContent="center">
          <Text color="white" mt={3}>
            NFT Collection: {collectionName}
          </Text>
          <Box
            width="fit-content"
            padding={8}
            backgroundColor="white"
            borderRadius="md"
            mt={3}>
            <QRCode value={router.asPath} size={256} />
          </Box>
          <Text color="white" mt={3}>
            Share this page:
          </Text>
          <Text onClick={onCopy} color="blue.500">
            {hasCopied ? "Copied" : "Click to copy the current URL"}
          </Text>
        </GridItem>
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="#151516" color="white">
          <ModalHeader>Your NFT was minted successfully!</ModalHeader>
          <ModalBody>
            <Text>Token ID: {transaction && transaction.tokenId}</Text>
            <Text mt={5}>
              <a
                href={`https://opensea.io/assets/matic/${collectionAddress}/${
                  transaction && transaction.tokenId
                }`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#B36BFC", textDecoration: "underline" }}>
                View on OpenSea
              </a>
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              onClick={handleGoToInventory}
              bg="linear-gradient(219.66deg, #B36BFC 18.38%, #6138CF 94.58%)"
              color="white"
              borderRadius="54px">
              Go to Inventory
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MintNft;
