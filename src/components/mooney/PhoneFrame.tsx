import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center bg-mooney-black p-0 sm:items-center sm:p-6">
      <div className="flex w-full max-w-[420px] flex-col bg-mooney-black sm:rounded-[40px] sm:p-2">
        <div className="flex items-center justify-between px-5 py-2 text-[12px] font-semibold text-mooney-white">
          <span>5:13 PM</span>
          <span className="text-mooney-white/70">▲ ▮ ▮▮</span>
        </div>
        <div className="relative flex min-h-[calc(100vh-40px)] flex-col overflow-hidden rounded-[32px] bg-mooney-white sm:min-h-[780px]">
          {children}
        </div>
      </div>
    </div>
  );
}
