const path = require("path");
const { exec } = require("child_process");

const cbor = require("cbor");
const express = require("express");
const tmp = require("tmp-file");

const TIMEOUT = 1000 * 10; // in ms
const PORT = 3000;

const app = express();
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "static")));

app.post("/api/convert", (req, res) => {
  cbor.decodeFirst(req.body.hex, (error, result) => {
    if (error) {
      res.statusMessage = `${error}`;
      res.status(400).end();
    } else {
      res.json({ result });
    }
  });
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
