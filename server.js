const path = require('path');
const { exec } = require('child_process');

const cbor = require('cbor');
const express = require('express');
const tmp = require('tmp-file');

const app = express();
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'static')));

app.post('/api/convert', (req, res) => {
  cbor.decodeFirst(req.body.hex, (error, result) => {
    if (error) {
      res.statusMessage = `${error}`;
      res.status(400).end();
    } else {
      res.send({ result }).end();
    }
  });
});

app.post('/api/validate', async(req, res) => {
  const { hex, cddl } = req.body;

  try {
    const cddlFile = await tmp.writeFile(cddl);
    const cborFile = await tmp.writeFile(Buffer.from(hex, 'hex'));

    exec(['cddl', cddlFile.path, 'validate', cborFile.path].join(' '), { timeout: 500 },
      (error, stdout, stderr) => {
        if (stderr) {
          res.send({ result: stderr }).end();
        } else if (error) {
          res.statusMessage = `${error}`;
          res.status(400).end();
        } else {
          res.send({ result: 'OK' }).end();
        }
      }
    );
  } catch (error) {
    res.statusMessage = `${error}`;
    res.status(400).end();
  }
});

app.listen(3000);
