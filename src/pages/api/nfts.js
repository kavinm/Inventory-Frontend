import { Network, Alchemy } from "alchemy-sdk";

export default async function handler(req, res) {
  const settings = {
    apiKey: "UzdW8jbBjtEUuntRHA_IEdNcGNTkAOAu",
    network: Network.ETH_SEPOLIA,
  };
  const alchemy = new Alchemy(settings);

  const { ownedNfts } = await alchemy.nft.getNftsForOwner(
    req.query.accountAddress
  );

  res.status(200).json(ownedNfts);
}
