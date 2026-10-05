const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const assert = require("assert");
const dns = require("dns");
require("dotenv").config();

dns.setDefaultResultOrder("ipv4first");

async function runComprehensiveTests() {
    const connectionString =
        process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL;

    console.log("==================================================");
    console.log("   🚀 RUNNING COMPREHENSIVE DB FLOW TESTS  ");
    console.log("==================================================");

    if (!connectionString) {
        console.error("❌ ERROR: Connection string not found in environment.");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 15000
    });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    const TEST_EMAIL = "test_flow_trader@pipforge.com";
    const TEST_USERNAME = "flow_trader_test";

    try {
        await prisma.$connect();
        console.log("✅ Successfully connected to PostgreSQL using Prisma Client.\n");

        // --------------------------------------------------
        // Pre-test Clean Up
        // --------------------------------------------------
        console.log("🧹 [Clean Up] Purging existing test records...");
        const existingUser = await prisma.user.findUnique({
            where: { email: TEST_EMAIL }
        });
        if (existingUser) {
            await prisma.user.delete({
                where: { id: existingUser.id }
            });
            console.log("   - Cleaned up previous test user.");
        }
        console.log("✅ Clean up complete.\n");

        // --------------------------------------------------
        // Test 1: User CRUD Operations
        // --------------------------------------------------
        console.log("🧪 [Test 1] Creating a new User...");
        const newUser = await prisma.user.create({
            data: {
                username: TEST_USERNAME,
                email: TEST_EMAIL,
                totalXP: 50,
                currentStreak: 2,
                tier: "PREMIUM"
            }
        });
        assert.ok(newUser.id, "User ID should be generated.");
        assert.strictEqual(newUser.username, TEST_USERNAME, "Username should match.");
        assert.strictEqual(newUser.email, TEST_EMAIL, "Email should match.");
        assert.strictEqual(newUser.totalXP, 50, "XP should match.");
        assert.strictEqual(newUser.tier, "PREMIUM", "Tier should match.");
        console.log(`✅ User created successfully with ID: ${newUser.id}\n`);

        // --------------------------------------------------
        // Test 2: User Updates & Increment Logic
        // --------------------------------------------------
        console.log("🧪 [Test 2] Updating user record (incrementing XP & streak)...");
        const updatedUser = await prisma.user.update({
            where: { id: newUser.id },
            data: {
                totalXP: { increment: 25 },
                currentStreak: { increment: 1 },
                lastActiveAt: new Date()
            }
        });
        assert.strictEqual(updatedUser.totalXP, 75, "Total XP should be incremented to 75.");
        assert.strictEqual(updatedUser.currentStreak, 3, "Current streak should be incremented to 3.");
        assert.ok(updatedUser.lastActiveAt, "lastActiveAt should be populated.");
        console.log("✅ User updates and atomic increments verified.\n");

        // --------------------------------------------------
        // Test 3: Educational Progress & Relations (CompletedLesson)
        // --------------------------------------------------
        console.log("🧪 [Test 3] Creating CompletedLesson record...");
        const lesson = await prisma.completedLesson.create({
            data: {
                userId: newUser.id,
                gradeId: "elementary",
                lessonSlug: "pips-and-ticks"
            }
        });
        assert.ok(lesson.id, "CompletedLesson ID should be generated.");
        assert.strictEqual(lesson.userId, newUser.id, "UserId should match user.");
        assert.strictEqual(lesson.lessonSlug, "pips-and-ticks", "LessonSlug should match.");
        console.log(`✅ CompletedLesson created successfully with ID: ${lesson.id}`);

        // Verify relationship fetch
        const userWithLessons = await prisma.user.findUnique({
            where: { id: newUser.id },
            include: { completedLessons: true }
        });
        assert.strictEqual(userWithLessons.completedLessons.length, 1, "Completed lessons list count should be 1.");
        assert.strictEqual(userWithLessons.completedLessons[0].lessonSlug, "pips-and-ticks", "Lesson slug should match in relation.");
        console.log("✅ User relation to CompletedLesson verified.\n");

        // Test Unique Constraint: User can complete a unique lesson only once
        console.log("🧪 [Test 3b] Verifying Unique Constraint on (userId, lessonSlug)...");
        try {
            await prisma.completedLesson.create({
                data: {
                    userId: newUser.id,
                    gradeId: "elementary",
                    lessonSlug: "pips-and-ticks"
                }
            });
            assert.fail("Unique constraint on CompletedLesson should have failed.");
        } catch (err) {
            assert.ok(err.code === "P2002", "Prisma should reject with a unique constraint error (P2002).");
            console.log("✅ Unique constraint correctly enforced (rejected duplicate lesson).\n");
        }

        // --------------------------------------------------
        // Test 4: Badges System
        // --------------------------------------------------
        console.log("🧪 [Test 4] Awarding a Badge (UserBadge)...");
        const badge = await prisma.userBadge.create({
            data: {
                userId: newUser.id,
                badgeId: "streak-3-days"
            }
        });
        assert.ok(badge.id, "Badge ID should be generated.");
        assert.strictEqual(badge.badgeId, "streak-3-days", "Badge ID should match.");
        console.log(`✅ Badge awarded successfully with ID: ${badge.id}`);

        // Test Unique Constraint: User can earn a badge only once
        console.log("🧪 [Test 4b] Verifying Unique Constraint on (userId, badgeId)...");
        try {
            await prisma.userBadge.create({
                data: {
                    userId: newUser.id,
                    badgeId: "streak-3-days"
                }
            });
            assert.fail("Unique constraint on UserBadge should have failed.");
        } catch (err) {
            assert.ok(err.code === "P2002", "Prisma should reject with a unique constraint error (P2002).");
            console.log("✅ Unique constraint correctly enforced (rejected duplicate badge).\n");
        }

        // --------------------------------------------------
        // Test 5: Daily Missions System
        // --------------------------------------------------
        console.log("🧪 [Test 5] Handling Daily Missions (UserMission)...");
        const mission = await prisma.userMission.create({
            data: {
                userId: newUser.id,
                missionId: "daily-quiz",
                isCompleted: false,
                resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // tomorrow
            }
        });
        assert.ok(mission.id, "Mission ID should be generated.");
        assert.strictEqual(mission.isCompleted, false, "Mission should initially be incomplete.");

        // Complete the mission
        const completedMission = await prisma.userMission.update({
            where: { id: mission.id },
            data: { isCompleted: true }
        });
        assert.strictEqual(completedMission.isCompleted, true, "Mission should now be marked as completed.");
        console.log("✅ Daily mission tracking verified successfully.\n");

        // --------------------------------------------------
        // Test 6: Clean Up (Tear Down)
        // --------------------------------------------------
        console.log("🧹 [Tear Down] Deleting the test user (cascade should remove dependencies)...");
        await prisma.user.delete({
            where: { id: newUser.id }
        });

        // Verify Cascade
        const checkLesson = await prisma.completedLesson.findMany({
            where: { userId: newUser.id }
        });
        const checkBadge = await prisma.userBadge.findMany({
            where: { userId: newUser.id }
        });
        const checkMission = await prisma.userMission.findMany({
            where: { userId: newUser.id }
        });

        assert.strictEqual(checkLesson.length, 0, "CompletedLessons should be cascade-deleted.");
        assert.strictEqual(checkBadge.length, 0, "UserBadges should be cascade-deleted.");
        assert.strictEqual(checkMission.length, 0, "UserMissions should be cascade-deleted.");

        console.log("✅ Cascade deletions verified (lessons, badges, missions purged successfully).\n");

        console.log("==================================================");
        console.log("   🎉 ALL DATABASE INTEGRITY TESTS PASSED! 🎉   ");
        console.log("==================================================");

    } catch (error) {
        console.error("\n❌ TEST FAILURE:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

runComprehensiveTests();
