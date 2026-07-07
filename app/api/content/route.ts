import { NextResponse } from "next/server";
import content from "@/data/content.json";

// Served as the current content baseline for the /admin.html editor.
export async function GET() {
  return NextResponse.json(content);
}
