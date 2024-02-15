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
import { BytebotClient } from '@bytebot/sdk';
import puppeteer from 'puppeteer';

const bytebot = new BytebotClient({
  apiKey: 'BYTEBOT_API_KEY',
});


(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('<URL>');

  await bytebot.prompt("Extract the names and locations from the table", page);

  ...


})();

```

## Alpha status

This SDK is in alpha, and there will be breaking changes between versions without a major version update.
