// import React, { useState, useRef } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// // import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a style of your preference

// const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'undo', 'redo'];

// const modules = {
//   syntax: {
//     highlight: (text: string) => text // Disable the built-in syntax highlighter of Quill
//   },
//   toolbar: {
//     container: [
//       [
//         { 'header': [1, 2, false] }
//       ],
//       ['bold', 'italic'],
//       [
//         { 'list': 'ordered' },
//         { 'list': 'bullet' }
//       ],
//       ['link'],
//       ['image'],
//       ['undo'],
//       ['redo'],
//       ['code-block']
//     ],
//     syntax: true,
//     handlers: {
//       'insertSnippet': function () {
//         const snippet = '// Your code snippet goes here\nconsole.log("Hello, world!");';
//         const range = mainRef.current?.getEditor().getSelection();
//         mainRef.current?.getEditor().insertText(range?.index || 0, snippet);
//       }
//     }
//   },
//   history: {
//     delay: 200,
//     maxStack: 500,
//     userOnly: true
//   }
// };

// function QuillEditorPostCreation() {
//   const [value, setValue] = useState('');
//   const mainRef = useRef<ReactQuill>(null);

//   const renderCustomBlock = (props: any, _editor: any, _next: any) => {
//     if (props?.node?.tagName === 'PRE') {
//       return <SyntaxHighlighter language="javascript" style={vscDarkPlus}>{props?.children}</SyntaxHighlighter>;
//     }
//   };

//   return (
//     <div>
//       <ReactQuill
//         id='quillmain'
//         modules={modules}
//         formats={formats}
//         theme="snow"
//         value={value}
//         onChange={setValue}
//         ref={mainRef}
//         renderCustomBlock={renderCustomBlock}
//       />
//     </div>
//   );
// }

// export default QuillEditorPostCreation;




















// // import React, { useState } from 'react';
// // import ReactQuill from 'react-quill';
// // import 'react-quill/dist/quill.snow.css';
// // import hljs from "highlight.js";
// // import 'highlight.js/styles/github.css';
// // import 'highlight.js/lib/languages/java'; // Import the "java" language

// // let mainRef = React.createRef<ReactQuill>();
// // const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'undo', 'redo'];

// // hljs.configure({
// //   languages: ['javascript', 'php', 'go', 'typescript', 'python', 'java'] // Add "java" language for syntax highlighting
// // });

// // const modules = {
// //   syntax: {
// //     highlight: (text: string) => hljs.highlightAuto(text).value
// //   },
// //   toolbar: {
// //     container: [
// //       [
// //         { 'header': [1, 2, false] }
// //       ],
// //       ['bold', 'italic'],
// //       [
// //         { 'list': 'ordered' },
// //         { 'list': 'bullet' }
// //       ],
// //       ['link'],
// //       ['image'],
// //       ['undo'],
// //       ['redo'],
// //       ['code-block']
// //     ],
// //     syntax: true,
// //     handlers: {
// //       'undo': function () {
// //         console.log(mainRef.current)
// //       },
// //       'redo': function () {
// //         console.log(mainRef.current)
// //       },
// //       'insertSnippet': function () {
// //         const snippet = '// Your code snippet goes here\nconsole.log("Hello, world!");';
// //         const range = mainRef.current?.getEditor().getSelection();
// //         mainRef.current?.getEditor().insertText(range?.index || 0, snippet);
// //       }
// //     }
// //   },
// //   history: {
// //     delay: 200,
// //     maxStack: 500,
// //     userOnly: true
// //   }
// // };

// // function QuillEditorPostCreation() {
// //   const [value, setValue] = useState('');

// //   return (
// //     <div>
// //       <ReactQuill
// //         id='quillmain'
// //         modules={modules}
// //         formats={formats}
// //         theme="snow"
// //         value={value}
// //         onChange={setValue}
// //         ref={mainRef}
// //       />
// //     </div>
// //   );
// // }

// // export default QuillEditorPostCreation;











// // import React, { useState } from 'react';
// // import ReactQuill from 'react-quill';
// // import 'react-quill/dist/quill.snow.css';
// // import hljs from "highlight.js";
// // import 'highlight.js/styles/github.css';

// // let mainRef = React.createRef<ReactQuill>();
// // const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'undo', 'redo'];

// // hljs.configure({
// //   languages: ['javascript', 'php', 'go', 'typescript', 'python'] // Add more languages for syntax highlighting
// // });

// // const modules = {
// //   syntax: {
// //     highlight: (text: string) => hljs.highlightAuto(text).value
// //   },
// //   toolbar: {
// //     container: [
// //       [
// //         { 'header': [1, 2, false] }
// //       ],
// //       ['bold', 'italic'],
// //       [
// //         { 'list': 'ordered' },
// //         { 'list': 'bullet' }
// //       ],
// //       ['link'],
// //       ['image'],
// //       ['undo'],
// //       ['redo'],
// //       ['code-block']
// //     ],
// //     syntax: true,
// //     handlers: {
// //       'undo': function () {
// //         console.log(mainRef.current)
// //       },
// //       'redo': function () {
// //         console.log(mainRef.current)
// //       }
// //     }
// //   },
// //   history: {
// //     delay: 200,
// //     maxStack: 500,
// //     userOnly: true
// //   }
// // };

// // function QuillEditorPostCreation() {
// //   const [value, setValue] = useState('');

// //   return (
// //     <div>
// //       <ReactQuill
// //         id='quillmain'
// //         modules={modules}
// //         formats={formats}
// //         theme="snow"
// //         value={value}
// //         onChange={setValue}
// //         ref={mainRef}
// //       />
// //     </div>
// //   );
// // }

// // export default QuillEditorPostCreation;





















// // import React, { useState } from 'react';
// // import ReactQuill from 'react-quill';
// // import 'react-quill/dist/quill.snow.css';
// // import hljs from "highlight.js";

// // let icons = ReactQuill.Quill.import("ui/icons");
// // const formats = ['header','bold', 'italic', 'underline', 'strike', 'blockquote','list', 'bullet', 'indent','link', 'image', 'undo', 'redo'];
// // let mainRef = React.createRef<ReactQuill>();

// // hljs.configure({   // optionally configure hljs
// //   languages: ['javascript', 'ruby', 'python']
// // });

// // const ReactQuill = dynamic(
// //   () => {
// //       hljs.configure({   // optionally configure hljs
// //           languages: ['javascript', 'php', 'go']
// //       })
// //       // @ts-ignore
// //       window.hljs = hljs
// //      return  import ("react-quill")
// //   }, {
// //   ssr: false,
// //   loading: () => <p>Loading</p>
// // })

// // const modules = {
// //   syntax: {
// //     highlight: (text: string) => hljs.highlightAuto(text).value
// //   },
  
// //   toolbar: {
// //     container: [
// //       [
// //         { 'header': [1, 2, false] }
// //       ],
// //       ['bold', 'italic'],
// //       [
// //         {'list': 'ordered'},
// //         {'list': 'bullet'}
// //       ],
// //       ['link'],
// //       ['image'],
// //       ['undo'],
// //       ['redo'],
// //       ['code-block']

// //     ],
// //     syntax: true,
// //     handlers: {
// //       'undo': function () {
// //         console.log(mainRef.current)
// //       },
// //       'redo': function () {
// //         console.log(mainRef.current)
// //       }
// //     }
// //   },
// //   history: {
// //     delay: 200,
// //     maxStack: 500,
// //     userOnly: true
// //   }
// // };

// // function QuillEditorPostCreation() {
// //   const [value, setValue] = useState('');




// //   return (
// //     <div>
// // <div>
// //         <ReactQuill id='quillmain' modules={modules} formats={formats} theme="snow" value={value} onChange={setValue} ref={mainRef}/>
// //     </div>
// //     </div>
// //   )
// // }

// // export default QuillEditorPostCreation

// // function dynamic(arg0: () => Promise<{ default: typeof ReactQuill; prototype: ReactQuill; displayName: string; Quill: typeof import("quill").Quill; defaultProps: { theme: string; modules: {}; readOnly: boolean; }; contextType?: React.Context<any> | undefined; }>, arg1: { ssr: boolean; loading: () => import("react/jsx-runtime").JSX.Element; }) {
// //   throw new Error('Function not implemented.');
// // }
