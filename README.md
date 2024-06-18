# Bytebot Node Library

[![npm shield](https://img.shields.io/npm/v/@bytebot/sdk)](https://www.npmjs.com/package/@bytebot/sdk)
[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-SDK%20generated%20by%20Fern-brightgreen)](https://github.com/fern-api/fern)

The Bytebot Node.js library provides access to the Bytebot API from JavaScript/TypeScript.

## Requirements

Bytebot works with Puppeteer version **21.9.0** or greater, and Playwright version **1.44.0** or greater.

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
import puppeteer from "puppeteer";
import { BytebotClient, Table, Column, Text } from "@bytebot/sdk";

const bytebot = new BytebotClient({
    apiKey: "YOUR_API_KEY",
});
async function run() {
    // Launch a browser and open a page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.ycombinator.com/companies", {
        waitUntil: "networkidle0",
    });

    // Act actions
    console.log("Acting on the page");
    const actActions = await bytebot.puppeteer.act({
        prompt: "Click on the W23 filter",
        page,
    });

    // Print the actions returned by the Bytebot API
    console.log("actActions", actActions);

    // Execute the actions
    await bytebot.puppeteer.execute(actActions, page);

    // Extract actions
    console.log("Extracting table data");
    const extractActions = await bytebot.puppeteer.extract({
        schema: Table([
            Column("Company Name", Text("The name of the company")),
            Column("Company Description", Text("The description of the company")),
        ]),
        page,
    });

    // Print the actions returned by the Bytebot API
    console.log("extractActions", JSON.stringify(extractActions, null, 2));

    // Execute the actions
    const result = await bytebot.puppeteer.execute(extractActions, page);

    // Print the extracted table data
    console.log("Extracted table data", result);

    await browser.close();
}

run().catch(console.error);
```

## Beta status

This SDK is in beta, and there will be breaking changes between versions without a major version update.
