import { useState } from "react";
import styles from "./codeHelper.module.css";

const CodeHelper = () => {
  const [functionInput, setFunctionInput] = useState("");
  const [testsCount, setTestsCount] = useState(0);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ functionInput, testsCount }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <textarea
          name="functionInput"
          placeholder="Enter a function"
          value={functionInput}
          onChange={(e) => setFunctionInput(e.target.value)}
        />
        <input
          type="number"
          name="testsCount"
          value={testsCount}
          onChange={(e) => setTestsCount(e.target.value)}
        />
        <input type="submit" value="Generate tests" />
      </form>
      <div>
        {result ? (
          <div
            className={styles.result}
            dangerouslySetInnerHTML={{
              __html: `<code>${result}</code>`,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CodeHelper;
