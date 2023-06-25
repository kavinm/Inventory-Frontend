import { Network, Alchemy } from "alchemy-sdk";

export default async function handler(req, res) {
  const { contract, tokenId } = req.query;

  const settings = {
    apiKey: "UzdW8jbBjtEUuntRHA_IEdNcGNTkAOAu",
    network: Network.ETH_SEPOLIA,
  };
  const alchemy = new Alchemy(settings);

  const nftMetadata = await alchemy.nft.getNftMetadata(contract, tokenId);

  res.status(200).json(nftMetadata);
}
