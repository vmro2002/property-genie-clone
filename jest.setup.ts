import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";

// TextEncoder / TextDecoder are available in Node.js but not always exposed to jsdom globals
import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextEncoder, TextDecoder });

// Polyfill the Web Crypto API (crypto.subtle) which jsdom doesn't expose but Node.js has natively
import { webcrypto } from "crypto";
Object.defineProperty(global, "crypto", {
  value: webcrypto,
  writable: true,
});

fetchMock.enableMocks();

// Reset mocks between tests
beforeEach(() => {
  fetchMock.resetMocks();
});
