import * as React from "react";

export function Component(props: { message: string }) {
  const makeRequest = (event) => {
    event.preventDefault();
    fetch("http://localhost:3000/state")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <body>
      <h1>{props.message}</h1>
      <button onClick={makeRequest}>Request</button>
    </body>
  );
}
