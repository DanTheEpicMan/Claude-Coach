import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({apiKey: process.env.CLAUDE_CODE_OAUTH_TOKEN});
const MODEL = "claude-sonnet-4-6";

async function runAgent()