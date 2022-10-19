import posthog from "posthog-js";

const IS_PROD = process.env.NODE_ENV === "production";
const IS_LOCAL = window.location.href.includes("localhost:");

if (IS_PROD && !IS_LOCAL) {
  posthog.init("PCoHEHV8I8etm7-gSY6RT8tcev9M3VWoejzJKjv2Ifw", {
    api_host: "https://app.posthog.com",
  });
}

export default function Analytics() {
  return null;
}
