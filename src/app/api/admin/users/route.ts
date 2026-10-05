import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function GET() {
    try {
        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!prisma) {
            return NextResponse.json({ message: "Database not connected" }, { status: 500 });
        }

        // Fetch all users with their completed lessons to calculate progress
        const users = await prisma.user.findMany({
            include: {
                completedLessons: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Fetch total number of lessons to compute progress percentage
        const totalLessons = await prisma.lesson.count();

        // Map database users to standard format
        const mappedUsers = users.map((u: any) => {
            // Determine role: simple check if username or email contains "admin"
            const role = (u.email.toLowerCase().includes("admin") || u.username.toLowerCase().includes("admin"))
                ? "Admin"
                : "Student";

            // Format Joined date
            const joinedDate = new Date(u.createdAt);
            const joined = joinedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });

            // Calculate progress percentage
            let progress = "N/A";
            if (role !== "Admin") {
                const completedCount = u.completedLessons.length;
                const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                progress = `${percent}%`;
            }

            // Determine status based on lastActiveAt (within last 7 days = Active)
            let status = "Inactive";
            if (u.lastActiveAt) {
                const diffTime = Math.abs(new Date().getTime() - new Date(u.lastActiveAt).getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 7) {
                    status = "Active";
                }
            }

            return {
                id: u.id,
                name: u.username,
                email: u.email,
                role,
                joined,
                progress,
                status,
                avatar: u.avatar || null,
            };
        });

        // Compute Stats
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const totalStudents = mappedUsers.filter((u: any) => u.role === "Student").length;
        
        const activeToday = await prisma.user.count({
            where: {
                lastActiveAt: {
                    gte: startOfToday,
                },
            },
        });
        
        const newThisWeek = await prisma.user.count({
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
        });

        // Uncompleted registrations or OAuth users without passwordHash
        const pendingVerification = await prisma.user.count({
            where: {
                passwordHash: null,
            },
        });

        return NextResponse.json({
            users: mappedUsers,
            stats: {
                totalStudents: totalStudents.toLocaleString("en-US"),
                activeToday: activeToday.toLocaleString("en-US"),
                newThisWeek: newThisWeek > 0 ? `+${newThisWeek}` : "0",
                pendingVerification: pendingVerification.toLocaleString("en-US"),
            },
        });
    } catch (error: any) {
        console.error("Error in GET /api/admin/users:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
