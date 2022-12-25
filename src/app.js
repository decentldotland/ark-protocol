import { sleepBlockCount } from "./utils/arweave/network.js";
import { getTransaction } from "./utils/evm/ethers.js";
import {
  getOracleState,
  getStats,
  getNetworkAddresses,
} from "./utils/cache-utils.js";
import { resolveAddress } from "./utils/endpoints/resolving.js";
import { runPolling } from "./utils/polling.js";
import { getArkProfile } from "./utils/server-utils.js";
import { getSoArkData } from "./utils/endpoints/soArk.js";
import { getNearNfts } from "./utils/server-utils.js";
import { getDomainsOf } from "./utils/endpoints/domains.js";
import { getNftsOf } from "./utils/endpoints/nfts.js";
import express from "express";
import base64url from "base64url";
import cors from "cors";
import { gzip } from "node-gzip";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(
  cors({
    origin: "*",
  })
);

app.set("view engine", "ejs");

app.use((err, res, req, next) => {
  res.setHeader("Content-Type", "application/json");
  res.status(500).send({"error": "timeout"});
  return;
});

app.get("/v2/oracle/state", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const encodedState = (await getOracleState())
  ;
  if (!encodedState) {
    res.send(JSON.parse(`{}`));
    return;
  }
  const jsonRes = JSON.parse(base64url.decode(encodedState));
  res.send(jsonRes);
});

app.get("/v2/protocol/stats", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const stats = await getStats();
  res.send(stats);
});

app.get("/v2/protocol/addresses", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const addresses = await getNetworkAddresses();
  res.send(addresses);
});

app.get("/v2/address/resolve/:address", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const identity = await resolveAddress(req.params?.address);
  const jsonRes = JSON.parse(base64url.decode(identity));
  res.send(jsonRes);
  return;
});

app.get("/v2/soark/:network/:address", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { network, address } = req.params;
  const response = await getSoArkData(network, address);
  const jsonRes = JSON.parse(base64url.decode(response));
  res.send(jsonRes);
  return;
});

app.get("/v2/domains/:network/:address", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { network, address } = req.params;
  const response = await getDomainsOf(network, address);
  const jsonRes = JSON.parse(base64url.decode(response));
  res.send(jsonRes);
  return;
});

app.get("/v2/allnft/:network/:address", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { network, address } = req.params;
  const response = await getNftsOf(network, address);
  const jsonRes = JSON.parse(base64url.decode(response));
  res.send(jsonRes);
  return;
});

app.get("/v2/nep/:address", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const response = await getNearNfts(req.params?.address);
    res.send({ result: response });
    return;
  } catch (error) {
    console.log(error);
    res.send({ result: null });
    return;
  }
});


app.get("/v2/profile/:network/:address/:compress?", async (req, res) => {
  const profile = await getArkProfile(req.params.network, req.params.address);
  if (!profile) {
    if (req.params.compress) {
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Encoding", "gzip")
      const data = await gzip(`{}`);
      res.send(data);
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.parse(`{}`));
    return;
  }

  if (req.params.compress) {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Encoding", "gzip")
    const decodedRes = base64url.decode(profile)
    const data = await gzip(JSON.stringify(decodedRes));
    res.send(data);
    return;
  }
  res.setHeader("Content-Type", "application/json");
  const jsonRes = JSON.parse(base64url.decode(profile));
  res.send(jsonRes);
});

app.listen(port, async () => {
  while (true) {
    await runPolling();
    console.log(`Ark Protocol running on PORT: ${port}`);
  }
});
