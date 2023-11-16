"use client";

import { useSearchParams } from "next/navigation";

export default function Messages() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  return (
    <>
      {error && (
        <p className="p-4 rounded-md bg-red-700 text-white text-center">
          {error}
        </p>
      )}
    </>
  );
}
