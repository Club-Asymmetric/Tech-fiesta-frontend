'use client';

import ClockCollection from "./components/ClockCollection";
import Clocks from "./components/Clocks";

export default function Home() {
  return (
    <div className="min-h-screen w-full p-0 m-0 overflow-hidden">
      <Clocks />
    </div>
  );
}
