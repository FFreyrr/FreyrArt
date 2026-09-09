#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const server = path.join(dist, "server");

rmSync(dist, { recursive: true, force: true });
mkdirSync(client, { recursive: true });
mkdirSync(server, { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });

const required = [
  "index.html",
  "assets",
  "Portfolio.pdf",
  "resume/index.html",
  "resume/assets",
  ".openai/hosting.json",
  "worker/index.js",
];
for (const entry of required) {
  if (!existsSync(path.join(root, entry))) throw new Error(`Missing build input: ${entry}`);
}

cpSync(path.join(root, "index.html"), path.join(client, "index.html"));
cpSync(path.join(root, "assets"), path.join(client, "assets"), { recursive: true });
cpSync(path.join(root, "Portfolio.pdf"), path.join(client, "Portfolio.pdf"));
cpSync(path.join(root, "resume"), path.join(client, "resume"), { recursive: true });
cpSync(path.join(root, ".openai", "hosting.json"), path.join(dist, ".openai", "hosting.json"));
cpSync(path.join(root, "worker", "index.js"), path.join(server, "index.js"));

console.log("Prepared Sites build in dist/");
