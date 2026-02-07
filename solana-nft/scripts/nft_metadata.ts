import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

;(async () => {
  const umi = createUmi("https://api.devnet.solana.com")

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
    const image =
      "https://i.pinimg.com/236x/32/54/a2/3254a21bc8969ba06ddcc66b159b80bd.jpg"

    const metadata = {
      name: "meoward",
      symbol: "MEOW",
      description:
        "Meoward is a cool cat who loves to chill and have fun.",
      image,
      attributes: [
        { trait_type: "Assignment", value: "NFT Swap" }
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image
          }
        ]
      },
      creators: []
    }

    const myUri = await umi.uploader.uploadJson(metadata)
    console.log("Your metadata URI:", myUri)
  } catch (error) {
    console.log("Oops.. Something went wrong", error)
  }
})()
