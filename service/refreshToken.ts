"use server";
import { cookies } from "next/headers";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { jwtUtils } from "@/utils/jwt";

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




export const isAccessTokenExist = async () => {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!accessToken && !refreshToken) {
    return null;
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      )
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      )
    : null;


  // access token expired
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {

    const result = await getNewAccessToken();

    if (result.success) {

      const newAccessToken = result.data.accessToken;

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      accessToken = newAccessToken;
    }
  }


  return accessToken;
};