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
  const hasOwnedTokens = ownedTokenIds && ownedTokenIds.length > 0;

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#151516" color="white">
          <ModalHeader>Select account to view (by tokenId)</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            {hasOwnedTokens ? (
              ownedTokenIds.map((tokenId) => (
                <Button
                  mr="3%"
                  bg="linear-gradient(220deg, #b36bfc 0%, #6138cf 100%)"
                  onClick={() => handleTokenClick(tokenId)}
                  key={tokenId}>
                  {tokenId}
                </Button>
              ))
            ) : (
              <Text>No owned tokens</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
const InventoryDash = () => {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { address, isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${apiUrl}/collections`);
        const provider = new ethers.providers.JsonRpcProvider(
          "https://solemn-damp-layer.matic.discover.quiknode.pro/c692cad72ccd79420e11105cc7496b02d000ac19/"
        );
        const ownedCollections = [];

        for (let collection of response.data) {
          const ownershipResult = await provider.send("qn_fetchNFTs", [
            {
              wallet: address,
              contracts: [collection.contractAddress],
            },
          ]);

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
      } catch (error) {
        console.error("Error fetching collections:", error);
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
          <Heading color="white" fontSize="xl" mb="1%">
            Inventory
          </Heading>
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

        <Flex
          direction="row"
          height="auto"
          overflowY="auto"
          py={2}
          justify="flex-start">
          {filteredCollections.map((collection) => (
            <CollectionCard
              key={collection.contractAddress}
              collection={collection}
              ownedTokenIds={collection.ownedTokenIds}
            />
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default InventoryDash;
