"use server";
import { cookies } from "next/headers";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    // throw new Error("User Not Logged In!..");
    return {
      success: false,
      message: "Refresh token not found!",
    };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        // Authorization: accessToken as unknown as string,
        // Authorization: `${accessToken}`,
        //   Authorization: `Bearer ${accessToken}`,

        cookie: `refreshToken=${refreshToken}`,
      },

      cache: "no-cache",
    },
  );

  const result = await res.json();
  console.log(result);

  return result;
};
