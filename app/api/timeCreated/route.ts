import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  console.log(`API route called at ${new Date().toISOString()}`);
  console.log(`Full URL: ${req.url}`);

  const fid = req.nextUrl.searchParams.get("fid");
  console.log(`Requested fid: ${fid}`);

  if (!fid) {
    console.log("Error: fid parameter is missing");
    return NextResponse.json(
      { error: "fid parameter is required" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching data from API for fid: ${fid}`);
    const apiUrl = `https://fnames.farcaster.xyz/transfers?fid=${fid}`;
    const response = await axios.get(apiUrl);

    const transfers = response.data.transfers;

    if (!transfers || transfers.length === 0) {
      console.error("No transfer data found for the provided fid");
      return NextResponse.json(
        { error: "No transfer data found for the provided fid" },
        { status: 404 }
      );
    }

    const { timestamp, username } = transfers[0];

  
    console.log(`Fetched username: ${username}, date: ${timestamp}`);

    return NextResponse.json({
      username,
      timestamp,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
