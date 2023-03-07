# proxy-example
This repository defines an example HTTP proxy server to interface with an [Iron Fish](https://ironfish.network) node.

## Setup and installation

1. Install [Node.js 18.x](https://nodejs.org/en/download/)
1. Install [Yarn](https://classic.yarnpkg.com/en/docs/install)
1. Run `yarn install` from the root directory to install dependencies

Follow the [Iron Fish Installation](https://ironfish.network/docs/onboarding/installation-iron-fish) guide to install Iron Fish. You will need to install Iron Fish in order to run a node to proxy requests to.

## Running the proxy server

### Starting the Iron Fish node

Run `ironfish start` to start the node. Visit the [Getting Started](https://ironfish.network/docs/onboarding/start-an-iron-fish-node) pages for more information on running a node.
### Configuring the Iron Fish node and SDK

The proxy server will make requests to the Iron Fish node over either IPC or TCP.

#### IPC

The Iron Fish node supports RPC requests over IPC by default. To configure the proxy server to make requests over IPC, specify the IPC filepath for your node in the `.ironfish.config.json` file, as shown below:

```json
{
  "configOverrides": {
    "ipcPath": "example"
  }
}
```

#### TCP

To enable TCP requests to your Iron Fish node you can start the node with `ironfish start --rpc.tcp` or set the node config value `enableRpcTcp` to `true`.

By default, the node requires an authentication token for TCP requests. You can use the `ironfish rpc:auth` command to get or set the token. Add the RPC token to `.ironfish.config.json` as shown below:

```json
{
  "internalOverrides": {
    "rpcAuthToken": "example"
  }
}
```

### Starting the server

Run `yarn run start` to start the server on port 8080.

## Sending requests

Each request to the proxy server must include a JSON payload specifying the Iron Fish RPC route to forward the request to and, optionally, any data to forward in the request.

The server has a single route that accepts POST requests at `/`.

The example payload below will proxy a request to the `chain/getBlock` endpoint to fetch data for the Iron Fish node's genesis block:

```json
{
  "route": "chain/getBlock",
  "data": {
    "sequence": 1
  }
}
```

An example request is shown here:
```sh
> curl --header "Content-Type: application/json" \
--request POST \
--data '{"route": "chain/getBlock", "data": {"sequence": 1}}' \
localhost:8080/
```
