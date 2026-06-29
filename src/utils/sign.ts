import type { InternalAxiosRequestConfig } from "axios"

const APP_SECRET = "function"

async function calculateSignature(
  signString: string,
  appSecret: string
): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(signString)
  )

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toLowerCase()
}

function canJsonSerialize(value: unknown): boolean {
  try {
    JSON.stringify(value)
    return true
  } catch {
    return false
  }
}

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ""
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false"
  }

  if (typeof value === "number") {
    return parseFloat(value.toString()).toString()
  }

  if (typeof value === "string") {
    return value.trim()
  }

  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => normalizeValue(item))
      .filter((item) => item !== "")

    normalized.sort()

    return `[${normalized.join(",")}]`
  }

  if (value && typeof value === "object") {
    const sortedKeys = Object.keys(value).sort()

    const pairs = sortedKeys
      .map((key) => {
        const normalized = normalizeValue((value as Record<string, unknown>)[key])
        return normalized !== "" ? `${key}:${normalized}` : null
      })
      .filter((pair): pair is string => pair !== null)

    return `{${pairs.join(",")}}`
  }

  return ""
}

function setHeader(
  config: InternalAxiosRequestConfig,
  key: string,
  value: string | number
) {
  if (typeof config.headers.set === "function") {
    config.headers.set(key, value)
  } else {
    config.headers[key] = value
  }
}

export async function beforeRequest(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const timestamp = Date.now()
  const nonce = Math.floor(Math.random() * 1000000000)
  const contentType =
    (config.headers["content-type"] as string) ||
    (config.headers["Content-Type"] as string) ||
    ""
  const method = config.method?.toUpperCase()

  let signPayload: Record<string, unknown> | null = null

  if (method === "GET") {
    signPayload = {
      ...(config.params || {}),
      timestamp,
      nonce,
    }
  } else if (
    method === "POST" &&
    contentType.indexOf("application/json") !== -1
  ) {
    signPayload = {
      ...(config.data || {}),
      timestamp,
      nonce,
    }
  } else if (
    method === "POST" &&
    contentType.indexOf("application/x-www-form-urlencoded") !== -1
  ) {
    signPayload = {
      ...(config.data || {}),
      file: undefined,
      files: undefined,
      timestamp,
      nonce,
    }
  } else if (
    method === "POST" &&
    contentType.indexOf("multipart/form-data") !== -1
  ) {
    signPayload = {
      ...(config.data || {}),
      file: undefined,
      files: undefined,
      timestamp,
      nonce,
    }
  } else if (method === "POST" && canJsonSerialize(config.data)) {
    signPayload = {
      ...(config.data || {}),
      timestamp,
      nonce,
    }
  }

  if (signPayload) {
    const sign = normalizeValue(signPayload)
    setHeader(
      config,
      "x-signature",
      await calculateSignature(sign, APP_SECRET)
    )
  }

  setHeader(config, "x-timestamp", timestamp)
  setHeader(config, "x-nonce", nonce)

  return config
}
