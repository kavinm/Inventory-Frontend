import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  Text,
  Spacer,
  InputGroup,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import axios from "axios";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Divider,
  Spinner,
} from "@chakra-ui/react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CollectionCard = ({ collection, ownedTokenIds }) => {
  const { name, contractAddress, color } = collection;
  const router = useRouter();

  const gradientStyle = {
    stopColor: "#" + color,
    stopOpacity: 1,
  };

  const gradientId = `gradient-${contractAddress}`;

  // Check if ownedTokenIds is defined and has at least one element
  const hasMultipleTokenIds = ownedTokenIds && ownedTokenIds.length > 1;
  const hasOwnedTokens = ownedTokenIds && ownedTokenIds.length > 0;

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const handleOpen = () => {
    if (hasMultipleTokenIds) {
      setIsOpen(true);
    } else if (ownedTokenIds && ownedTokenIds.length === 1) {
      handleTokenClick(ownedTokenIds[0]);
    }
  };
  const handleTokenClick = (tokenId) => {
    router.push({
      pathname: "/account",
      query: { contractAddress, tokenId },
    });
  };

  return (
    <Box
      width="350px"
      height="500px"
      mb="4"
      mr="4"
      onClick={handleOpen}
      style={{ cursor: "pointer" }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 338 292">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop offset="100%" style={gradientStyle} />
          </linearGradient>
        </defs>
        <rect
          x="10"
          y="10"
          rx="20"
          ry="20"
          width="318"
          height="262"
          fill={`url(#${gradientId})`}
        />
        <rect x="30" y="30" width="30" height="4" fill="#151516" />
        <rect x="43" y="30" width="4" height="20" fill="#151516" />
        <rect x="30" y="50" width="30" height="4" fill="#151516" />
      </svg>
      <Text color="white" fontSize="xl" mt={2}>
        {name}
      </Text>
      <Text color="white" fontSize="sm" isTruncated maxWidth="90%">
        {contractAddress}
      </Text>

      {hasMultipleTokenIds && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg="#151516" color="white">
            <ModalHeader>Select account to view (by tokenId)</ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              {ownedTokenIds.map((tokenId) => (
                <Button
                  mr="3%"
                  bg="linear-gradient(220deg, #b36bfc 0%, #6138cf 100%)"
                  onClick={() => handleTokenClick(tokenId)}
                  key={tokenId}>
                  {tokenId}
                </Button>
              ))}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};
const InventoryDash = () => {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { address, isConnecting, isDisconnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/collections`);
        const provider = new ethers.providers.JsonRpcProvider(
          "https://solitary-dimensional-resonance.ethereum-sepolia.discover.quiknode.pro/f993e4f77c1dd3ce2e9cac4225d5b7683cbbef54/"
        );
        const ownedCollections = [];

        for (let collection of response.data) {
          const ownershipResult = await provider.send("qn_fetchNFTs", [
            {
              wallet: address,
              contracts: [collection.contractAddress],
            },
          ]);
          console.log(collection.contractAddress);
          console.log(ownershipResult);

          if (
            ownershipResult &&
            ownershipResult.assets &&
            ownershipResult.assets.length > 0
          ) {
            const ownedTokenIds = ownershipResult.assets.map(
              (asset) => asset.collectionTokenId
            );
            ownedCollections.push({ ...collection, ownedTokenIds });
          }
        }

        setCollections(ownedCollections);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [address]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      background="#151516"
      p={4}
      overflowY="auto">
      <Flex direction="column">
        <Flex justify="space-between">
          <Box display="flex" alignItems="center">
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
        <Divider mt="1%" />
        <Flex
          justify="space-between"
          my={4}
          align="center"
          marginTop="3%"
          mb="5%">
          <Heading color="white" fontSize="5xl">
            Your Inventories
          </Heading>
          <Text color="white" fontSize="md" ml="43%">
            {filteredCollections.length}
            {filteredCollections.length === 1
              ? "   inventory"
              : "   inventories"}
          </Text>
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            boxSizing="border-box"
            display="flex"
            flexDirection="row"
            alignItems="center"
            p="25px 30px"
            width="311px"
            height="55px"
            background="linear-gradient(238.01deg, rgba(217, 217, 217, 0.1) 23.35%, rgba(217, 217, 217, 0) 85.95%), rgba(98, 103, 113, 0.18)"
            border="1px solid rgba(200, 200, 200, 0.12)"
            borderRadius="65px"
            color="white"
          />
        </Flex>

        {isLoading ? (
          <Flex justify="center" align="center" height="100%">
            <Spinner size="xl" color="purple.300" />
          </Flex>
        ) : (
          <Flex
            direction="row"
            height="auto"
            overflowY="auto"
            py={2}
            justify="flex-start"
            marginTop="80px">
            {filteredCollections.map((collection) => (
              <CollectionCard
                key={collection.contractAddress}
                collection={collection}
                ownedTokenIds={collection.ownedTokenIds}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default InventoryDash;
