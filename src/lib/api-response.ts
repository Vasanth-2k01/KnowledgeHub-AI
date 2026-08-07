import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export function apiSuccess<T = any>(
  data: T,
  message?: string,
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    } as ApiResponse<T>,
    { status }
  );
}

export function apiError(
  error: any,
  message: string = "An error occurred",
  status: number = 500
) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: error?.message || error,
    } as ApiResponse,
    { status }
  );
}
