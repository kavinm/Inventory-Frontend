import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { ethers } from "ethers";
import { getAccount } from "@tokenbound/sdk-ethers";
import Image from "next/image";
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  Input,
  GridItem,
} from "@chakra-ui/react";
import Link from "next/link";

const polygonUrl = process.env.NEXT_PUBLIC_POLYGON_URL;

const Account = () => {
  const router = useRouter();
  const { contractAddress, tokenId, inventoryName } = router.query;
  const [nfts, setNfts] = useState([]);
  const [TbaAddress, setTbaAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryContractName, setInventoryContractName] = useState("");
  const [color, setColor] = useState("");
  const totalSlots = 16; // set this to the total number of slots in your grid

  useEffect(() => {
    const fetchNFTs = async () => {
      const provider = new ethers.providers.JsonRpcProvider(polygonUrl);
      const accountAddress = await getAccount(
        contractAddress,
        tokenId,
        provider
      );
      setTbaAddress(accountAddress);

      const nftContract = new ethers.Contract(
        contractAddress,
        [
          "function name() view returns (string)",
          "function colour() view returns (string)",
        ], // added colour function
        provider
      );
      const contractName = await nftContract.name();
      setInventoryContractName(contractName);

      const contractColor = await nftContract.colour(); // get color from contract
      setColor(contractColor); // set color state variable
      console.log(contractColor);

      const res = await fetch(`/api/nfts?accountAddress=${accountAddress}`);
      const ownedNfts = await res.json();
      const fetches = ownedNfts.map(async (nft) => {
        const metaRes = await fetch(nft.tokenUri.gateway);
        const { image, name } = await metaRes.json();
        const imgURL = image.replace("ipfs://", "https://dweb.link/ipfs/");
        console.log(imgURL);
        return { ...nft, imgURL, name };
      });
      const nftsArray = await Promise.all(fetches);
      setNfts(nftsArray);
    };

    if (contractAddress && tokenId) {
      fetchNFTs();
    }
  }, [contractAddress, tokenId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredNfts = nfts.filter((nft) =>
    nft.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // calculate empty slots for placeholder
  const emptySlots = totalSlots - filteredNfts.length;

  return (
    <Box
      width="100%"
      minHeight="100vh"
      background="#151516"
      p={3.2}
      position="relative">
      <Flex justify="space-between" align="center">
        <Text color="white" fontSize="3.2xl" ml={3.2}>
          Your {inventoryName} Inventory
        </Text>
        <Flex position="absolute" top="160px" right="16px" align="center">
          <Button
            as={NextLink}
            href="/inventoryDash"
            mt={3.2}
            mr={900}
            borderRadius="65px"
            backgroundColor="rgba(115, 101, 111, 0.1)"
            color="white">
            ← All Inventories
          </Button>
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            boxSizing="border-box"
            display="flex"
            flexDirection="row"
            alignItems="center"
            p="20px 24px"
            width="248.8px"
            height="44px"
            background="linear-gradient(238.01deg, rgba(217, 217, 217, 0.1) 23.35%, rgba(217, 217, 217, 0) 85.95%), rgba(98, 103, 113, 0.18)"
            border="1px solid rgba(200, 200, 200, 0.12)"
            borderRadius="52px"
            color="white"
            mt={3.2}
          />
          <Text color="white" ml={3.2}>
            {filteredNfts.length} NFTs shown
          </Text>
        </Flex>
      </Flex>

      <Flex mt={3.2}>
        <Box
          direction="column"
          alignItems="center"
          p="30px 36px"
          gap="8px"
          width="481.2px"
          height="608.4px"
          background="linear-gradient(220deg, #b36bfc 0%, #5e37ce 100%)"
          border="1px solid rgba(200, 200, 200, 0.12)"
          borderRadius="20.8px"
          boxShadow="0px 3.2px 3.2px rgba(0, 0, 0, 0.25)"
          marginTop="200px">
          <Text color="white" fontSize="4xl" fontWeight="bold" mb={3.2}>
            {inventoryContractName}
          </Text>
          <Box width="50px" height="50px" background={"#" + color}></Box>

          <Text color="white" fontSize="lg">
            {inventoryContractName} Inventory address:
          </Text>
          <Text color="white" fontSize="sm" isTruncated>
            {TbaAddress}
          </Text>
        </Box>
        <Box
          ml={40}
          marginTop="200px"
          flex="1"
          maxHeight="608.4px"
          overflow="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "0.4em",
              height: "0.4em",
              display: "none",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "0.2em",
            },
          }}>
          <Grid templateColumns="repeat(4, 1fr)" gap="30.4px">
            {filteredNfts.map((nft, index) => (
              <GridItem key={index}>
                <Box
                  height="238.4px"
                  borderRadius="16px"
                  boxShadow="0px 3.2px 3.2px rgba(0, 0, 0, 0.25)">
                  <Box
                    width="100%"
                    height="100%"
                    borderRadius="16px"
                    overflow="hidden"
                    position="relative">
                    <Link
                      href={{
                        pathname: "/nftView",
                        query: {
                          contract: nft.contract.address,
                          tokenId: nft.tokenId,
                          account: TbaAddress,
                        },
                      }}>
                      <Image
                        src={nft.imgURL}
                        alt={nft.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </Link>
                  </Box>
                </Box>
                <Box bg="#151516" p={1.6} borderRadius="md">
                  <Text color="white" fontSize="md" isTruncated>
                    {nft.name}
                  </Text>
                </Box>
              </GridItem>
            ))}
            {[...Array(emptySlots)].map((_, i) => (
              <GridItem key={i + filteredNfts.length}>
                <Box
                  height="238.4px"
                  border="1.6px dashed grey"
                  borderRadius="16px"
                />
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
};

export default Account;
