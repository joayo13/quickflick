// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@/mocks/node.ts";
import "@testing-library/jest-dom";
vi.mock("zustand"); // to make it work like Jest (auto-mocking)

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
