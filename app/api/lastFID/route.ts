import { init, fetchQuery } from "@airstack/node";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.AIRSTACK_API_KEY;
if (!apiKey) {
  throw new Error("AIRSTACK_API_KEY is not defined");
}
init(apiKey);

console.log("Airstack API initialized");

const userQuery = `
query LastFid {
  Socials(
    input: {filter: {dappName: {_eq: farcaster}}, blockchain: ethereum, limit: 1, order: {profileCreatedAtBlockTimestamp: DESC}}
  ) {
    Social {
      fid: userId
      profileName
    }
  }
}
`;

export async function GET(req: NextRequest) {
  console.log(`API route called at ${new Date().toISOString()}`);
  console.log(`Full URL: ${req.url}`);

  try {
    // console.log(`Fetching data from Airstack for userId: ${userId}`);
    const [lastFid] = await Promise.all([fetchQuery(userQuery)]);

    if (lastFid.error) {
      console.error("Airstack API error (user data):", lastFid.error);
      return NextResponse.json(
        { error: lastFid.error.message },
        { status: 500 }
      );
    }

    console.log(
      "Airstack API response (user data):",
      JSON.stringify(lastFid.data, null, 2)
    );
console.log(lastFid.data)
    return NextResponse.json({
      lastFid: lastFid.data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
