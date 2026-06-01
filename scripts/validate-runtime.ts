import "dotenv/config";

import { createClient } from "@supabase/supabase-js";
import IORedis from "ioredis";

async function validateSupabase() {
  console.log(
    "\n🔍 Checking Supabase..."
  );

  const supabase =
    createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

  const { error: savesError } =
    await supabase
      .from("saves")
      .select("id")
      .limit(1);

  if (savesError) {
    throw new Error(
      `saves table check failed: ${savesError.message}`
    );
  }

  const {
    error: embeddingsError,
  } = await supabase
    .from("memory_embeddings")
    .select("id")
    .limit(1);

  if (embeddingsError) {
    throw new Error(
      `memory_embeddings table check failed: ${embeddingsError.message}`
    );
  }

  console.log(
    "✅ Supabase OK"
  );
}

async function validateRedis() {
  console.log(
    "\n🔍 Checking Redis..."
  );

  const redis =
    new IORedis({
      host:
        process.env.UPSTASH_REDIS_HOST,
      port: Number(
        process.env.UPSTASH_REDIS_PORT
      ),
      password:
        process.env.UPSTASH_REDIS_PASSWORD,
      tls: {},
    });

  await redis.ping();

  console.log(
    "✅ Redis OK"
  );

  redis.disconnect();
}

async function validateOllama() {
  console.log(
    "\n🔍 Checking Ollama..."
  );

  const response =
    await fetch(
      "http://127.0.0.1:11434/api/tags"
    );

  if (!response.ok) {
    throw new Error(
      "Ollama unavailable"
    );
  }

  console.log(
    "✅ Ollama OK"
  );
}

async function validateEnv() {
  console.log(
    "\n🔍 Checking ENV..."
  );

  const required = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "UPSTASH_REDIS_HOST",
    "UPSTASH_REDIS_PORT",
    "UPSTASH_REDIS_PASSWORD",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(
        `Missing env: ${key}`
      );
    }
  }

  console.log(
    "✅ ENV OK"
  );
}

async function main() {
  try {
    await validateEnv();

    await validateSupabase();

    await validateRedis();

    await validateOllama();

    console.log(
      "\n🎉 Runtime validation passed."
    );
  } catch (error) {
    console.error(
      "\n❌ Runtime validation failed"
    );

    console.error(error);

    process.exit(1);
  }
}

main();