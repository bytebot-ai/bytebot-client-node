# Bytebot Node Library

[![npm shield](https://img.shields.io/npm/v/@bytebot/sdk)](https://www.npmjs.com/package/@bytebot/sdk)
[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-SDK%20generated%20by%20Fern-brightgreen)](https://github.com/fern-api/fern)

The Bytebot Node.js library provides access to the Bytebot API from JavaScript/TypeScript.

## API Docs

You can find Bytebot's complete API docs at [docs.bytebot.ai](https://docs.bytebot.ai).

## Installation

```
npm install --save @bytebot/sdk
# or
yarn add @bytebot/sdk
```

## Usage

```typescript
import { BytebotClient, Table, Column, Text } from "@bytebot/sdk";

const bytebot = new BytebotClient({
    apiKey: "YOUR_API_KEY",
});

async function run() {
    // Start a new session
    const startSessionResponse = await bytebot.browser.startSession("https://www.ycombinator.com/companies");
    const sessionId = startSessionResponse.sessionId;
    console.log("startSessionResponse", startSessionResponse);

    // Act actions
    await bytebot.browser.act({ sessionId, prompt: "Click on the W24 filter" }).then((res) => {
        console.log("act", res);
    });

    await bytebot.browser
        .extract({
            sessionId,
            schema: Table([
                Column("Company Name", Text("The name of the company")),
                Column("Company Description", Text("The description of the company")),
            ]),
        })
        .then((res) => {
            console.log("extract", res);
        });

    // End the session
    await bytebot.browser.endSession(sessionId);
}

run().catch(console.error);
```

## Beta status

This SDK is in beta, and there will be breaking changes between versions without a major version update.
