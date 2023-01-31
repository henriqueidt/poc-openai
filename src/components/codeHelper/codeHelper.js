import { useState } from "react";
import styles from "./codeHelper.module.css";

const CodeHelper = () => {
  const [functionInput, setFunctionInput] = useState("");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(isTest) {
    setResult(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ functionInput, isTest }),
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
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className={styles.form}
      >
        <textarea
          name="functionInput"
          placeholder="Enter a function"
          value={functionInput}
          onChange={(e) => setFunctionInput(e.target.value)}
          className={styles.textarea}
        />
        <button onClick={() => onSubmit(true)}>Generate tests</button>
        <button onClick={() => onSubmit(false)}>Generate documentation</button>
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
        {isLoading ? "Loading..." : null}
      </div>
    </div>
  );
};

export default CodeHelper;
