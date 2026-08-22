/**
 * Local smoke test for Kakaitec → Pipsology provisioning webhook.
 * Usage: node scripts/test-provision-webhook.js
 */
const { createHmac } = require("crypto");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const secret = process.env.KAKAITEC_PROVISIONING_SECRET;
if (!secret) {
  console.error("Missing KAKAITEC_PROVISIONING_SECRET in .env");
  process.exit(1);
}

const bodyObj = {
  event: "access.granted",
  user: {
    id: "USR_TEST_001",
    name: "Webhook Test User",
    email: "webhook.test@example.com",
  },
  product: { id: "APP_PIPSOLOGY", name: "Pipsology" },
  license: {
    accessId: "ACC_TEST_001",
    planName: "Standard",
    expiresAt: null,
  },
};

const body = JSON.stringify(bodyObj);
const signature = createHmac("sha256", secret).update(body).digest("hex");
const url = process.env.PROVISION_TEST_URL || "http://127.0.0.1:3001/api/webhooks/provision";

async function post(label, sig) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kakaitec-Signature": sig,
    },
    body,
  });
  const text = await res.text();
  console.log(`\n=== ${label} ===`);
  console.log(`HTTP ${res.status}`);
  console.log(text);
  return res.status;
}

(async () => {
  const ok1 = await post("Signed free provision (create/update)", signature);
  const ok2 = await post("Same payload again (idempotent update)", signature);
  const bad = await post("Bad signature should 401", "deadbeef");
  if (ok1 !== 200 || ok2 !== 200 || bad !== 401) {
    process.exit(1);
  }
  console.log("\nAll checks passed.");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
