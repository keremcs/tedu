"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Comp() {
  const [p1, setP1] = useState("");
  const [m1, setM1] = useState("");
  const [r1, setR1] = useState("");
  const [p2, setP2] = useState("");
  const [m2, setM2] = useState("");
  const [r2, setR2] = useState("");
  const [result, setResult] = useState<
    { plan1: number; plan2: number } | undefined
  >(undefined);

  function yod(payment: number, month: number, rate: number) {
    let x = 0;
    let y = 1 + rate / 1200;
    if (month === 1) {
      return y * payment;
    }
    for (let i = 0; i < month; i++) {
      x = y * x + 1;
    }
    return x * payment;
  }

  function yo() {
    const plan1 = yod(Number(p1), Number(m1), Number(r1));
    const plan2 = yod(Number(p2), Number(m2), Number(r2));
    setResult({ plan1, plan2 });
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8 p-12">
      <form
        action={yo}
        className="flex flex-col gap-4 p-4 bg-secondary rounded-md"
      >
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold">Plan 1</span>
            <Input
              name="p1"
              type="number"
              inputMode="numeric"
              placeholder="Monthly payment"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              required
            />
            <Input
              name="m1"
              type="number"
              inputMode="numeric"
              placeholder="Number of months"
              value={m1}
              onChange={(e) => setM1(e.target.value)}
              required
            />
            <Input
              name="r1"
              type="number"
              inputMode="numeric"
              placeholder="Interest on savings"
              value={r1}
              onChange={(e) => setR1(e.target.value)}
              required
            />
            {result && (
              <div
                className={`${
                  result.plan1 < result.plan2
                    ? "text-green-500"
                    : "text-red-500"
                } font-mono`}
              >
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(result.plan1)}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold">Plan 2</span>
            <Input
              name="p2"
              type="number"
              inputMode="numeric"
              placeholder="Monthly payment"
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              required
            />
            <Input
              name="m2"
              type="number"
              inputMode="numeric"
              placeholder="Number of months"
              value={m2}
              onChange={(e) => setM2(e.target.value)}
              required
            />
            <Input
              name="r2"
              type="number"
              inputMode="numeric"
              placeholder="Interest on savings"
              value={r2}
              onChange={(e) => setR2(e.target.value)}
              required
            />
            {result && (
              <div
                className={`${
                  result.plan2 < result.plan1
                    ? "text-green-500"
                    : "text-red-500"
                } font-mono`}
              >
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(result.plan2)}
              </div>
            )}
          </div>
        </div>
        <Button>Compare Payment Plans</Button>
      </form>
    </div>
  );
}
