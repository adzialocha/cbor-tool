const path = require("path");
const { exec } = require("child_process");

const cbor = require("cbor");
const express = require("express");
const tmp = require("tmp-file");

const TIMEOUT = 1000 * 10; // in ms
const PORT = 3000;

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}


const app = express();
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "static")));

app.post("/api/toJSON", (req, res) => {
  cbor.decodeFirst(req.body.hex, (error, result) => {
    if (error) {
      res.statusMessage = `${error}`;
      res.status(400).end();
    } else {
      res.json({ result });
    }
  });
});

app.post("/api/toCBOR", (req, res, next) => {
  try {
    const data = JSON.parse(req.body.json);
    let encoded = cbor.encode(data);
    let result = toHexString(encoded);
    res.json({ result })
  } catch(error) {
    res.statusMessage = `${error}`;
    res.status(400).end();
  }
});

app.post("/api/validate", async (req, res) => {
  const { hex, cddl } = req.body;

  try {
    const cddlFile = await tmp.writeFile(cddl);
    const cborFile = await tmp.writeFile(Buffer.from(hex, "hex"));

    const path = `cddl ${cddlFile.path} validate ${cborFile.path}`;
    const options = { timeout: TIMEOUT };

    exec(path, options, (error, stdout, stderr) => {
      if (stderr) {
        res.json({ result: stderr });
      } else {
        res.json({ result: "OK" });
      }
    });
  } catch (error) {
    res.statusMessage = `${error}`;
    res.status(400).end();
  }
});

app.listen(PORT);
