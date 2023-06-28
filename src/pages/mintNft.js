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
import NextLink from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const MintNft = () => {
  const [collectionName, setCollectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [waitingForTx, setWaitingForTx] = useState(false);

  const router = useRouter();
  const { collectionAddress } = router.query;
  const { address, isConnecting, isDisconnected } = useAccount();
  const { onCopy, hasCopied } = useClipboard(router.asPath);

  useEffect(() => {
    if (collectionAddress) {
      const fetchCollectionName = async () => {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://eth-sepolia.g.alchemy.com/v2/UzdW8jbBjtEUuntRHA_IEdNcGNTkAOAu"
        );
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
    setWaitingForTx(true);
    if (!collectionAddress || !address) {
      console.log("Waiting for data...");
      setIsLoading(false);
      setWaitingForTx(false);
      return;
    }
    try {
      const response = await axios.post("api/mint", {
        contractAddress: collectionAddress,
        address: address, // Use the connected address
      });

      console.log(response.data);
      setTransaction(response.data);
      setIsLoading(false);
      setWaitingForTx(false);
      onOpen();
    } catch (error) {
      console.error("Error minting token:", error);
      setIsLoading(false);
      setWaitingForTx(false);
    }
  };

  const handleGoToInventory = () => {
    router.push("/inventoryDash");
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      background="#151516"
      p={4}
      overflowY="auto">
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
            Inventory
          </Text>
        </Box>
        <ConnectButton />
      </Flex>
      <Box mt={8}>
        <Divider orientation="horizontal" mb={60} borderColor="#5C5C5C" />
      </Box>

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
          <Flex align="center" mb={5}></Flex>
          <Heading as="h2" size="2xl" color="white" mb={5}>
            Your inventory has been created
          </Heading>
          <Text color="gray.300" fontSize="xl" mb={5}>
            Integrate this on your site with our documentations
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
            {waitingForTx ? (
              <Spinner />
            ) : (
              <>
                <Text>Token ID: {transaction && transaction.tokenId}</Text>
                <Text mt={5}>
                  <a
                    href={`https://testnets.opensea.io/assets/sepolia/${collectionAddress}/${
                      transaction && transaction.tokenId
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#B36BFC", textDecoration: "underline" }}>
                    View on OpenSea
                  </a>
                </Text>
              </>
            )}
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
