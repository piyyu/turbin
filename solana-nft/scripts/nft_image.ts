import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, signerIdentity, createSignerFromKeypair } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

;(async () => {
  // Create a devnet connection
  const umi = createUmi("https://api.devnet.solana.com")

  // Load local Solana CLI wallet
  const secretKey = JSON.parse(
    await readFile("/home/piyyu/.config/solana/id.json", "utf-8")
  )

  const keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey)
  )
  const signer = createSignerFromKeypair(umi, keypair)

  umi.use(signerIdentity(signer))
  umi.use(irysUploader())

  try {
    // 1. Load image from disk
    const imageBuffer = await readFile("./assets/nft.jpg")

    // 2. Convert image to generic file
    const image = createGenericFile(imageBuffer, "nft.jpg", {
      contentType: "image/jpeg",
    })

    // 3. Upload image
    const [myUri] = await umi.uploader.upload([image])

    console.log("Your image URI:", myUri)
  } catch (error) {
    console.log("Oops.. Something went wrong", error)
  }
})()
