import express, { Request, Response } from "express";
import { ParsedQs } from "qs";

const fs = require("fs");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

const app = express();

interface Token {
  contractId: string | ParsedQs | string[] | ParsedQs[] | undefined;
  tokenId: string | number | string[] | undefined;
}
app.use(express.json());
app.use(cors({ origin: true }));
app.listen(PORT, () => {
  console.log(`Server Listening on ${PORT}`);
});

console.log(process.env.PORT);

app.get("/tokens", async (req: Request, res: Response) => {
  const { contractId } = req.query;
  const { tokenId } = req.query;

  const currentFileData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../tokens.json"), "utf-8")
  );
  if (!contractId && !tokenId) {
    return res.status(200).json({
      data: currentFileData?.nftList?.map(
        (item: Token) => `${item.contractId}:${item.tokenId}`
      ),
    });
  }

  const filteredInfo = currentFileData.nftList.find((item: Token) => {
    if (contractId) {
      if (item.contractId == contractId) {
        return res
          .status(200)
          .json({ data: `${item.contractId}:${item.tokenId}` });
      }
    }
    // else if (tokenId) {
    //   if (item.contractId == contractId) {
    //     res.status(200).json({ data: `${item.contractId}:${item.tokenId}` });
    //   }
    // }
  });

  return res.status(404).json({ message: "Id not found" });
});
