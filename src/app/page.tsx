import ClockCollection from "./components/ClockCollection";

export default function Home() {
  return (
    <div className="min-h-screen w-full p-0 m-0 overflow-hidden">
      <ClockCollection mainClockSize={420} smallClockCount={24} />
    </div>
  );
}
