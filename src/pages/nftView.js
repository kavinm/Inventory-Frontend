import React, { useEffect, useState } from "react";
import {
  Button,
  VStack,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Image,
  Text,
  Center,
  AspectRatio,
  Flex,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { prepareExecuteCall } from "@tokenbound/sdk-ethers";

const NftView = () => {
  const router = useRouter();
  const { contract, tokenId, account } = router.query;
  const [nftData, setNftData] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [address, setAddress] = useState("");
  const current6551Account = account;

  useEffect(() => {
    const fetchNftData = async () => {
      const res = await fetch(
        `/api/metadata?contract=${contract}&tokenId=${tokenId}`
      );
      const nftMetadata = await res.json();

      console.log("nftMetadata", nftMetadata);

      if (nftMetadata.tokenUri && nftMetadata.tokenUri.raw) {
        const metadataURI = nftMetadata.tokenUri.raw.replace(
          "ipfs://",
          "https://dweb.link/ipfs/"
        );

        setNftData({
          ...nftMetadata,
          tokenUri: { ...nftMetadata.tokenUri, raw: metadataURI },
        });

        try {
          const res2 = await fetch(metadataURI, { mode: "cors" });
          const attributeData = await res2.json();
          setAttributes(attributeData.attributes);
        } catch (e) {
          console.error("Failed to fetch attribute data", e);
        }
      }
    };

    if (contract && tokenId) {
      fetchNftData();
    }
  }, [contract, tokenId]);

  const handleSend = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const toAddress = address;

    const erc721Interface = new ethers.utils.Interface([
      "function safeTransferFrom(address _from, address _to, uint256 _tokenId)",
    ]);

    const data = erc721Interface.encodeFunctionData("safeTransferFrom", [
      current6551Account,
      toAddress,
      tokenId,
    ]);

    const transactionData = await prepareExecuteCall(
      current6551Account,
      contract,
      0,
      data
    );

    await signer.sendTransaction(transactionData);

    onClose();
  };

  if (!nftData) {
    return <div>Loading...</div>;
  }

  const mediaURL = nftData.media[0].raw
    ? nftData.media[0].raw.replace("ipfs://", "https://dweb.link/ipfs/")
    : nftData.media[0];

  return (
    <Flex direction="column" minHeight="100vh" overflow="hidden">
      <ConnectButton ml="50" />
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${mediaURL})`}
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        filter="blur(60px) brightness(0.8)"
        zIndex="-1"
      />

      <Box p="5">
        <Text fontSize="xl" fontWeight="bold">
          {nftData.name}
        </Text>
      </Box>

      <Button
        bg="rgba(255, 255, 255, 0.2)"
        borderRadius="14px"
        p="25px 30px"
        position="absolute"
        width="318px"
        height="50px"
        left="54px"
        top="250px"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap="10px"
        onClick={onOpen}
        color="white">
        Send
      </Button>

      <Box
        bg="rgba(255, 255, 255, 0.2)"
        borderRadius="14px"
        p="25px 30px"
        position="absolute"
        width="318px"
        left="54px"
        top="320px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="10px">
        {attributes && attributes.length > 0 && (
          <>
            <Text color="white">Attributes</Text>
            {attributes.map((attribute, index) => (
              <Text color="white" key={index}>
                {attribute.trait_type}: {attribute.value}
              </Text>
            ))}
          </>
        )}
      </Box>

      <Center height="100vh" flexDirection="column" alignItems="center">
        <Text
          fontSize="4xl"
          fontWeight="bold"
          fontFamily="Roboto"
          color="white"
          fontFamily="inherit"
          mb="4">
          {nftData.title}
        </Text>
        <Box
          borderRadius="xl"
          overflow="hidden"
          width={["300px", "400px", "500px", "600px"]}
          height={["300px", "400px", "500px", "600px"]}
          bg="white">
          <AspectRatio ratio={1}>
            <Image
              src={mediaURL}
              alt={nftData.contract.name}
              objectFit="cover"
            />
          </AspectRatio>
        </Box>
      </Center>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter the address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              bg="linear-gradient(220deg, #b36bfc 0%, #6138cf 100%)"
              mr={3}
              onClick={handleSend}>
              Send
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default NftView;
