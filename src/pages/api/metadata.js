import { Network, Alchemy } from "alchemy-sdk";

export default async function handler(req, res) {
  const { contract, tokenId } = req.query;

  const settings = {
    apiKey: "N5ohocT4fvLTU3g0M4xIE5xjLvylOlxf",
    network: Network.MATIC_MAINNET,
  };
  const alchemy = new Alchemy(settings);

  const nftMetadata = await alchemy.nft.getNftMetadata(contract, tokenId);

  res.status(200).json(nftMetadata);
}
