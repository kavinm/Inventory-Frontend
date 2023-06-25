import { Network, Alchemy } from "alchemy-sdk";

export default async function handler(req, res) {
  const settings = {
    apiKey: "N5ohocT4fvLTU3g0M4xIE5xjLvylOlxf",
    network: Network.MATIC_MAINNET,
  };
  const alchemy = new Alchemy(settings);

  const { ownedNfts } = await alchemy.nft.getNftsForOwner(
    req.query.accountAddress
  );
  console.log();

  res.status(200).json(ownedNfts);
}
