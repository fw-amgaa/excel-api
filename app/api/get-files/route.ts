import { NextRequest, NextResponse } from "next/server";
import { listFilesInFolder } from "../list-files";

export async function GET() {
  const response = await listFilesInFolder().then((res) => res);
  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: "Hello from POST!", data: body });
}
