import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ProvisionPayload = {
  event: "access.granted" | "access.revoked";
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
  };
  license: {
    accessId: string;
    planName: string;
    expiresAt: string | null;
  };
};

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function baseUsername(name: string, email: string): string {
  const fromName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
  if (fromName.length >= 3) return fromName;
  const local = email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]+/g, "") || "user";
  return local.slice(0, 24) || "user";
}

async function uniqueUsername(seed: string): Promise<string> {
  let candidate = seed;
  let n = 0;
  while (true) {
    const existing = await prisma.user.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
    n += 1;
    candidate = `${seed.slice(0, 20)}${n}`;
  }
}

function resolveTier(planName: string): "FREE" | "PREMIUM" {
  const plan = planName.toLowerCase();
  if (
    plan.includes("premium") ||
    plan.includes("pro") ||
    plan.includes("paid") ||
    plan.includes("monthly") ||
    plan.includes("yearly") ||
    plan.includes("annually")
  ) {
    return "PREMIUM";
  }
  return "FREE";
}

export async function POST(req: Request) {
  try {
    const secret = process.env.KAKAITEC_PROVISIONING_SECRET;
    if (!secret) {
      console.error("[provision] KAKAITEC_PROVISIONING_SECRET is not set");
      return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-kakaitec-signature");
    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    let payload: ProvisionPayload;
    try {
      payload = JSON.parse(rawBody) as ProvisionPayload;
    } catch {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    if (payload.event !== "access.granted") {
      return NextResponse.json({ success: true, ignored: true, event: payload.event });
    }

    const email = payload.user?.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ message: "Missing user.email" }, { status: 400 });
    }

    if (!prisma) {
      return NextResponse.json({ message: "Database is not connected" }, { status: 500 });
    }

    const name = (payload.user.name || "").trim();
    const tier = resolveTier(payload.license?.planName || "Standard");
    const existing = await prisma.user.findUnique({ where: { email } });

    let user;
    let created = false;

    if (existing) {
      user = await prisma.user.update({
        where: { id: existing.id },
        data: {
          tier,
          // Keep existing username; refresh avatar initials if empty
          avatar: existing.avatar || (name || email).slice(0, 2).toUpperCase(),
        },
        select: {
          id: true,
          username: true,
          email: true,
          tier: true,
        },
      });
    } else {
      const username = await uniqueUsername(baseUsername(name, email));
      user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash: null,
          avatar: (name || username).slice(0, 2).toUpperCase(),
          tier,
          totalXP: 0,
          currentStreak: 0,
        },
        select: {
          id: true,
          username: true,
          email: true,
          tier: true,
        },
      });
      created = true;
    }

    console.log(
      `[provision] ${created ? "created" : "updated"} user=${user.email} tier=${user.tier} accessId=${payload.license?.accessId} product=${payload.product?.name}`
    );

    return NextResponse.json({
      success: true,
      message: created ? "User provisioned" : "User updated",
      user,
      license: {
        accessId: payload.license?.accessId,
        planName: payload.license?.planName,
        expiresAt: payload.license?.expiresAt,
      },
    });
  } catch (error: any) {
    console.error("[provision] error:", error);
    return NextResponse.json(
      { message: "Provisioning failed", error: error.message },
      { status: 500 }
    );
  }
}
