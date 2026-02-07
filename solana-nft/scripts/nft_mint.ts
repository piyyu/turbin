import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
  signerIdentity,
  generateSigner,
  percentAmount,
  createSignerFromKeypair
} from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata"
import { readFile } from "fs/promises"
import base58 from "bs58"

const RPC_ENDPOINT = "https://api.devnet.solana.com"
const umi = createUmi(RPC_ENDPOINT)

// Load local Solana CLI wallet
const secretKey = JSON.parse(
  await readFile("/home/piyyu/.config/solana/id.json", "utf-8")
)

const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(secretKey)
)
const signer = createSignerFromKeypair(umi, keypair)

umi.use(signerIdentity(signer))
umi.use(mplTokenMetadata())

const mint = generateSigner(umi)

;(async () => {
  try {
    // 👇 paste the metadata URI you got earlier
    const metadataUri = "PASTE_METADATA_URI_HERE"

    const tx = await createNft(umi, {
      mint,
      name: "meoward",
      symbol: "MEOW",
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(0),
    })

    const result = await tx.sendAndConfirm(umi)
    const signature = base58.encode(result.signature)

    console.log(
      `Successfully Minted!\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
    )
    console.log("Mint Address:", mint.publicKey)
  } catch (error) {
    console.log("Oops.. Something went wrong", error)
  }
})()
