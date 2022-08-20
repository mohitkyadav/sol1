import React from "react";
import './App.css'

// You have following object:
const res = [
  { line: 0, tag: "h1", text: "My name is Mohit." },
  { line: 1, tag: "h2", text: "My name is actually not Mohit." },
  {
    line: 2,
    tag: "p",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
  },
  { line: 3, tag: "code", text: "undefined < undefined // false" },
]

// 1. On the page as a user I see one big text area and one preview pane.
// 2. I should see the above response parsed as raw Markdown in the text area. Example: For first line in the text I should see:  # My name is Mohit.
// 3. In the preview I should be able to see the rendered Markdown.
// 4. As I change the text, the preview should also update.
// Notes: You are not allowed to use any library to render or process markdown. Our app only supports h1, h2, p, and code, don’t worry about other tags.

/*
  We could just render tag dynamically for now,but it's easier to customize it (style/behavior) later if each tag has a separate component
 */
const H1 = ({ text }) => <h1>{text}</h1>;

const H2 = ({ text }) => <h2>{text}</h2>;

const P = ({ text }) => <p class='markdonwn-p'>{text}</p>;

const Code = ({ text }) => <code class='markdown-code'>{text}</code>;

const TagKind = {
  H1: 'h1',
  H2: 'h2',
  P: 'p',
  CODE: 'code',
};

const tagToComponentMap = {
  [TagKind.H1]: H1,
  [TagKind.H2]: H2,
  [TagKind.P]: P,
  [TagKind.CODE]: Code,
};


const Preview = ({ content }) => {
  return (
    <div className="App-Preview">
      MD Preview
      <hr />
      {
        content.map(({ tag, text }) => {
          let Component = tagToComponentMap[tag];
          if (!Component) {
            console.error(`${tag} is not supported`);
            Component = P;
          }

          return <Component text={text} />
        })
      }
    </div>
  )
}

/*
  structure that defines start and end sequences for line to be parsed as corresponding tag
    [patternStart: string, tagKind: TagKind, patternEnd: string]
    empty string should be provided if start or end pattern should be empty
*/
const TagToMarkdownTypes = [
  ['## ', TagKind.H2, ''], 
  ['# ', TagKind.H1, ''],
  /* not clear if ```foo``` should be transformed, or space before text is required (behavior can be adjusted easily by pattern adjustment)
    
    inline code is not supported
  */
  ['```', TagKind.CODE, '```'],
  // always true
  ['', TagKind.P, ''],
];

const getTagFromMarkdownString = (str) => {
  // looks like in most implementation whitespace symbols are not preventing markdown from recognizing the pattern
  const trimmedStr = str.trimStart();
  return TagToMarkdownTypes
    .find(([patternStart, , patternEnd ]) => trimmedStr.startsWith(patternStart) && trimmedStr.endsWith(patternEnd));
};


const parseLine = (line, index) => {
  const [patternStart, tag, patternEnd] = getTagFromMarkdownString(line);

  /* 
    trim start of the string for all tags 
    except p (want to preserve whitespace for normal text)
  */
  const trimmedString = tag === TagKind.P 
    ? line : line.trimStart();
  return {
    line: index + 1,
    tag,
    text: trimmedString.substring(
      patternStart.length, 
      trimmedString.length - patternEnd.length
    ),
  };      
};

const textRepresentationToMarkdown = (text) => {
  return text.map(({ tag, text }) => {
    const type = TagToMarkdownTypes.find(([, t]) => tag === t);

    return `${type[0]}${text}${type[2]}`;
  // extra new line to separate markdown entries
  }).join('\n\n'); 
};

const App = () => {
  const [textRepresentation, setTextRepresentation] = React.useState([]);
  const [text, setText] = React.useState('');

  const parseRawText = (e) => {
    const value = e.currentTarget.value;
    const lines = value.split('\n');

    const result = lines.filter(line => line.length > 0).map(parseLine);

    setText(value);
    setTextRepresentation(result);
  };

  React.useEffect(() => {
    setText(textRepresentationToMarkdown(res));
    setTextRepresentation(res);
  }, []);

  return (
    <div className="App">
      <textarea value={text} onChange={parseRawText}/>
      <Preview content={textRepresentation}/>
    </div>
  )
}

export default App