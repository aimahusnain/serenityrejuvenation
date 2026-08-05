// app/api/admin/blocked-days/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function startOfDayUTC(dateStr: string) {
  const d = new Date(dateStr);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  const days = await prisma.blockedDay.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ blockedDays: days });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { date, reason } = await request.json();
  if (!date) return NextResponse.json({ error: "Date required" }, { status: 400 });

  const day = startOfDayUTC(date);

  try {
    const blocked = await prisma.blockedDay.upsert({
      where: { date: day },
      update: { reason },
      create: { date: day, reason },
    });
    return NextResponse.json({ blocked });
  } catch (error) {
    console.error("Error blocking day:", error);
    return NextResponse.json({ error: "Failed to block day" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { date } = await request.json();
  if (!date) return NextResponse.json({ error: "Date required" }, { status: 400 });

  const day = startOfDayUTC(date);

  try {
    await prisma.blockedDay.delete({ where: { date: day } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unblocking day:", error);
    return NextResponse.json({ error: "Failed to unblock day" }, { status: 500 });
  }
}