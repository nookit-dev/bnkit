import React from "react";
import "./index.css";

export function App() {
  // const
  React.useEffect(() => {
    setTimeout(() => {
      console.log("Hello, React!");
    }, 1000);
  }, []);

  console.log({
    window: typeof window
  })

  return <div>Rendered!</div>;
}
