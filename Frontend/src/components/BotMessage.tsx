interface BotMessageProps {
  text: string;
}

const BotMessage = ({ text }: BotMessageProps) => {
  const data = typeof text === "object" ? text : JSON.parse(text);

  return (
    <div className="space-y-3">
      {data.header && (
        <h3 className="text-lg font-bold text-orange-400">{data.header}</h3>
      )}

      {data.content && data.content.length > 0 && (
        <div className="space-y-2">
          <ul className="space-y-1 text-sm"></ul>
          {data.content?.map((paragraph: any, index: any) => (
            <li key={index} className="leading-relaxed ml-4">
              {paragraph}
            </li>
          ))}
        </div>
      )}

      {data.code && (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-orange-400">
              {data.language || "Code"}
            </span>
          </div>
          <pre className={"p-3 rounded-lg text-sm overflow-x-auto"}>
            <code>{data.code}</code>
          </pre>
        </div>
      )}

      {data.tips && data.tips.length > 0 && (
        <div className="mt-3">
          <h4 className="text-lg font-bold text-orange-400 mb-2">💡 Tips:</h4>
          <ul className="space-y-1 text-sm">
            {data.tips.map((tip: any, index: any) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.references && data.references.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-orange-400 mb-2">
            📚 References:
          </h4>
          <ul className="space-y-1 text-sm">
            {data.references.map((ref: any, index: any) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span>{ref}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.summary && (
        <div>
          <h3 className="text-lg font-bold text-orange-400">Summary</h3>
          <p>{data.summary}</p>
        </div>
      )}
    </div>
  );
};

export default BotMessage;
