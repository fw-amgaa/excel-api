import { NextRequest, NextResponse } from "next/server";
import { listFilesInFolder } from "../list-files";

export async function GET() {
  const response = await listFilesInFolder().then((res) => res);

  if (response?.fileData) {
    return NextResponse.json({
      message: "Successful!",
      data: response.fileData,
    });
  }

  return NextResponse.json({
    message: "Error!",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: "Hello from POST!", data: body });
}
