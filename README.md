# cbor-tool

Tool to inspect hex-encoded [CBOR](https://cbor.io/) data and validate it against [CDDL](https://datatracker.ietf.org/doc/html/rfc8610) schemata.

## Usage

You can use it online here: https://wasser.liebechaos.org or follow the installation instructions below.

## Install

### Requirements

* NodeJS 16
* Ruby 2.7.5
* [cddl](https://rubygems.org/gems/cddl) gem

### Install manually

Make sure you have the `cddl` ruby gem installed, run `npm install` and `npm start` and go to http://localhost:3000.

### Install via `docker`

```bash
docker build . -t cbor-tool
docker run -p "3000:3000" cbor-tool:latest
```

### Install via `docker-compose`

The image is published on [DockerHub](https://hub.docker.com/r/p2panda/cbor-tool). You can use it to install `cbor-tool` via `docker-compose` for example:

```yaml
version: '3'

services:
  app:
    image: p2panda/cbor-tool:v0.1.1
    container_name: cbor-tool
    restart: always
```

## License

`MIT`
