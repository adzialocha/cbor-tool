# cbor-tool

Tool to inspect and validate CBOR via CDDL.

## Requirements

* NodeJS 16
* Ruby 2.7.5
* [cddl](https://rubygems.org/gems/cddl) gem

## Install

```bash
npm install
npm start
# Go to http://localhost:3000
```

## Install via Docker

```bash
docker build . -t cbor-tool
docker run -p "3000:3000" cbor-tool:latest
# Go to http://localhost:3000
```

## License

`MIT`
