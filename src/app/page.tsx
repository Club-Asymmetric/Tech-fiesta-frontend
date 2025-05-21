import Clocks from "./components/Clocks";

export default function Home() {
  return (
    <div className="min-h-screen w-full p-0 m-0 overflow-hidden">
      <Clocks mainClockSize={360} smallClockCount={42} />
    </div>
  );
}
