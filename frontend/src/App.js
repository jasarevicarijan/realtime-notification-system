import Sender from "./components/Sender";
import Receiver from "./components/Receiver";

function App() {
  return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8 p-4">
        <Sender />
        <Receiver />
      </div>
  );
}

export default App;
