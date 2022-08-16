import React from "react";
import './App.css'
// MD_PARSER

const MD_TO_TOKEN_MAPPER = [
  { pattern: /^# (.*$)/, tag: 'h1' },
  { pattern: /^## (.*$)/, tag: 'h2' },
  { pattern: /```(.*)```/, tag: 'code' },
  { pattern: /(.*$)/, tag: 'p' }
];

const parseMd = (md) => {
  const mdLines = md.split('\n');

  return mdLines.map((line, idx) => {
    const token = MD_TO_TOKEN_MAPPER.find(({ pattern }) => pattern.test(line));
    return {
      line: idx,
      tag: token.tag,
      text: line.replace(token.pattern, '$1')
    };
  });
};

// END OF MD_PARSER


// VIEW LOGIC

const MarkdownEditor = ({ md, onChange }) => {
  const handleChange = event => {
    onChange(event.target.value);
  };
  return <textarea value={md} onChange={handleChange} />;
};

const Preview = ({ md }) => {
  const parsedMd = parseMd(md);

  return (
    <div className="App-Preview">
      MD Preview
      <hr />

      {parsedMd.map(({ tag, text }) => {
        return React.createElement(tag, {}, text)
      })}
    </div>
  );
};

const initialMd = "# My name is Mohit.\n\n## My name is actually not Mohit.\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.\n\n```undefined < undefined // false```";

const App = () => {
  const [markdown, setMarkdown] = React.useState(initialMd);

  return (
    <div className="App">
      <MarkdownEditor md={markdown} onChange={setMarkdown} />
      <Preview md={markdown} />
    </div>
  );
};

export default App