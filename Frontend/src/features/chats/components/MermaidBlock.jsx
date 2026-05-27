import React, { useState, useRef, useEffect } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

const MermaidBlock = ({ code }) => {
  // eslint-disable-next-line no-unused-vars
  const ref = useRef(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const render = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
        setError(false);
      } catch {
        setError(true);
      }
    };
    render();
  }, [code]);

  if (error)
    return (
      <pre className="markdown-pre mermaid-error">
        <code>{code}</code>
      </pre>
    );

  return (
    <div className="mermaid-block" dangerouslySetInnerHTML={{ __html: svg }} />
  );
};

export default MermaidBlock;
