import { useFetcher } from "..";
import "./App.css";

interface DataType {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const { get, status, useData } = useFetcher<DataType>({
    options: {
      baseUrl: "https://jsonplaceholder.typicode.com/",
    },
  });

  return (
    <div>
      <div>{status}</div>

      <pre>{JSON.stringify(useData())}</pre>

      <button
        onClick={() => {
          get("todos/1");
        }}
      >
        Click Me!
      </button>
    </div>
  );
}

export default App;
