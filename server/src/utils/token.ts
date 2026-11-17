import jwt, { 
    type JwtPayload,
    type SignOptions,
} from "jsonwebtoken";

// Token Payload Type
export interface AuthTokenPayload extends JwtPayload {
    userId: string;
}

// Generate Access Token
export const generateAccessToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"], 
        }
    );
};

// Generate Refresh toekn
export const generateRefreshToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
        }
    );
};

// Verify Access Token
export const verifyAccessToken = (
    token: string
): AuthTokenPayload => {
    const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
    );

    if (
        typeof decoded === "string" ||
        typeof decoded.userId !== "string"
    ) {
        throw new Error("Invalid access token");
    }


    return decoded as AuthTokenPayload;
};

// Verify Refresh token
export const verifyRefreshToken = (
  token: string
): AuthTokenPayload => {
  const decoded = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as string
  );

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string"
  ) {
    throw new Error("Invalid refresh token");
  }

  return decoded as AuthTokenPayload;
};