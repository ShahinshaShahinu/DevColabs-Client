
import  { useEffect, useRef, useState } from 'react';
import { Jodit } from 'jodit-react';

interface RichTextEditorProps {
  initialValue: string;
  getValue: (newValue: string) => void;
}


function JoditPostCreation({ initialValue, getValue  }: RichTextEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [editorInstance, setEditorInstance] = useState<Jodit | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const jodit = Jodit.make(editorRef.current, {
        zIndex: 0,
        readonly: false,
        activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about', 'dots'],
        toolbarButtonSize: 'middle',
        theme: 'default',
        saveModeInCookie: false,
        spellcheck: true,
        editorCssClass: false,
        triggerChangeEvent: true,
        overflowY:'auto',
        width: 'auto',
        height: 'auto',
        minHeight: 300,
        direction: '',
        language: 'auto',
        debugLanguage: false,
       
        i18n: 'en',
        tabIndex: -1,
        toolbar: true,
        enter: 'P',
        defaultMode: Jodit?.defaultOptions?.defaultMode,
        useSplitMode: true,
        colors: {
          greyscale:  ['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF','#09131b'],
                   palette:    ['#980000', '#FF0000', '#FF9900', '#FFFF00', '#00F0F0', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'],
                   full: [
                       '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
                       '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
                       '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
                       '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
                       '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#733554',
                       '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130',
                 ]
        },
        colorPickerDefaultTab: 'background',
        imageDefaultWidth: 300,
        uploader: {
          insertImageAsBase64URI: true,
          scrollToPastedContent: true, // This value should be boolean, not 'boolean'
        },
       
        removeButtons: [],
                disablePlugins: [],
                extraButtons: [],
                  sizeLG: 900,
                  sizeMD: 700,
                  sizeSM: 400,
                buttons: [
                    'source', '|',
                    'bold',
                    'strikethrough',
                    'underline',
                    'italic', '|',
                    'ul',
                    'ol', '|',
                    'outdent', 'indent',  '|',
                    'font',
                    'fontsize',
                    'brush',
                    'paragraph', '|',
                    'image',
                    'video',
                    'table',
                    'link', '|',
                    'align', 'undo', 'redo', '|',
                    'hr',
                    'eraser',
                    'copyformat', '|',
                    'symbols',
                    'fullsize',
                    'print',
                    'about',
                    'preview',
                ],
                buttonsXS: [
                    'bold',
                    'image', '|',
                    'brush',
                    'paragraph', '|',
                    'align', '|',
                    'undo', 'redo', '|',
                    'eraser',
                    'dots'
                ],
                events: {},
                textIcons: false,
              });
      jodit.value = initialValue;
      setEditorInstance(jodit);
    }
  }, [initialValue]);

  useEffect(() => {
    if (editorInstance) {
      editorInstance?.events?.on('change', (newContent: string) => {
        getValue(newContent);
      });
    }
    
  }, [editorInstance, getValue]);

  return (
    <>
    <div style={{ maxWidth: '1000px', margin: 'auto', border: '1px solid #ccc', borderRadius: '10px', height: '310px', overflowY: 'auto' }}>
      <textarea id="editor" ref={editorRef} />
    </div>
    </>
    
  );
}

export default JoditPostCreation;
















// import  { useEffect, useRef, useState } from 'react';
// import 'jodit/build/jodit.min.css';
// import { Jodit } from "jodit";

// interface RichTextEditorProps {
//   initialValue: string;
//   getValue: (newValue: string) => void;
// }

// function JoditPostCreation({ initialValue, getValue }: RichTextEditorProps) {
//   const editorRef = useRef<HTMLTextAreaElement>(null);
//   const [editorInstance, setEditorInstance] = useState<Jodit | null>(null);

//   useEffect(() => {
//     if (editorRef.current) {
//       const jodit = Jodit.make(editorRef.current, {
//         zIndex: 0,
//         readonly: false,
//         activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about', 'dots'],
//         toolbarButtonSize: 'middle',
//         theme: 'default',
//         saveModeInCookie: false,
//         spellcheck: true,
//         editorCssClass: false,
//         triggerChangeEvent: true,
//         width: 'auto',
//         height: 'auto',
//         minHeight: 400,
//         direction: '',
//         language: 'auto',
//         debugLanguage: false,
//         i18n: 'en',
//         tabIndex: -1,
//         toolbar: true,
//         enter: 'P',
//         defaultMode: Jodit.defaultOptions.defaultMode,
//         useSplitMode: false,
//         colors: {
//           greyscale:  ['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'],
//         palette:    ['#980000', '#FF0000', '#FF9900', '#FFFF00', '#00F0F0', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'],
//         full: [
//             '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
//             '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
//             '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
//             '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
//             '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#733554',
//             '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
//         ]
//         },
//         colorPickerDefaultTab: 'background',
//         imageDefaultWidth: 300,
//         removeButtons: [],
//         disablePlugins: [],
//         extraButtons: [],
//         sizeLG: 900,
//         sizeMD: 700,
//         sizeSM: 400,
//         buttons: [
//             'source', '|',
//             'bold',
//             'strikethrough',
//             'underline',
//             'italic', '|',
//             'ul',
//             'ol', '|',
//             'outdent', 'indent',  '|',
//             'font',
//             'fontsize',
//             'brush',
//             'paragraph', '|',
//             'image',
//             'video',
//             'table',
//             'link', '|',
//             'align', 'undo', 'redo', '|',
//             'hr',
//             'eraser',
//             'copyformat', '|',
//             'symbol',
//             'fullsize',
//             'print',
//             'about'
//         ],
//         buttonsXS: [
//             'bold',
//             'image', '|',
//             'brush',
//             'paragraph', '|',
//             'align', '|',
//             'undo', 'redo', '|',
//             'eraser',
//             'dots'
//         ],
//         events: {},
//         textIcons: false,
//       });
//       jodit.value = initialValue;

//       setEditorInstance(jodit);
//     }
//   }, [initialValue]);

//   useEffect(() => {
//     if (editorInstance) {
//       editorInstance.events.on('change', (newContent: string) => {
//         getValue(newContent);
//       });
//     }
//   }, [editorInstance, getValue]);

//   return (
//     <div style={{ maxWidth: '881px', margin: 'auto', border: '1px solid #ccc', borderRadius: '10px' }}>
//       <textarea id="editor" ref={editorRef} />
//     </div>
//   );
// }

// export default JoditPostCreation;




















// import React, { useState } from 'react';
// import JoditEditor from "jodit-react-ts";
// import 'jodit/build/jodit.min.css';
// function JoditPostCreation() {
//   const [content, setContent] = useState('');

//   const config = {
//     uploader: {
//       insertImageAsBase64URI: true
//     }
//   };

//   return (
//     <div style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ccc', borderRadius: '5px' }}>
//       <JoditEditor
//         config={config}
//         onChange={newContent => setContent(newContent)}
//       />
//     </div>
//   );
// }

// export default JoditPostCreation;



























// import { useRef } from "react";
// import JoditEditor from "jodit-react-ts";

// // Assuming types for initialValue and getValue parameters
// type InitialValueType = string;
// type GetValueFunctionType = (newContent: string) => void;

// const config = {
//   buttons: ["bold", "italic"],
// };

// function RichTextEditor({ initialValue, getValue }: { initialValue: InitialValueType; getValue: GetValueFunctionType }) {
//   const editorRef = useRef<any>(null); // Use a different name for the ref to avoid conflicts

//   return (
//     <div>
//       <JoditEditor
//         ref={editorRef}
//         value={initialValue}
//         config={config}
//         tabIndex={1}
//         onChange={(newContent) => getValue(newContent)}
//       />
//     </div>
//   );
// }

// export default RichTextEditor;





// <JoditEditor
    //   ref={editor}
    //   value={initialValue}
    //   config={config}
    //   tabIndex={1}
    //   // onBlur={(newContent) => getValue(newContent)}
    //   onChange={(newContent) => getValue(newContent)}
    // />





// import JoditEditor from 'jodit-react-ts';
// import 'jodit/build/jodit.min.css';
// import React, { useRef, useState } from 'react';
// import Navbar from '../Home/Navbar';
// // import Navbar from '../Home/Navbar';


// function joditPostCreation() {

//   const [content, setContent] = useState('');










//   return (
//     <>



//       <div className=" relative z-20 ">
//         <Navbar />

//       </div>










//       <div className='w-full h-screen flex mt-7'>
//         <div className='grid grid-cols-1 md:grid-cols-2 m-auto h-[750px] shadow-lg shadow-gray-600 sm:max-w-[900px]'>
//           <div className='p-4 flex flex-col justify-center items-start relative'>

//             <div className='bg-fuchsia-500 absolute md:-inset-x-32  -inset-x-0 md:left-56  left-0 top-0 flex justify-center items-center'>
//               <h1 className=''>Create Post</h1>
//             </div>

//             <div className='bg-black w-full h-72 bottom-44 relative flex justify-start'>
//             <JoditEditor
//               // ref={editor}

//               value={content}
//               onChange={newContent => setContent(newContent)}

//             />
//             </div>

//           </div>
//         </div>
//       </div>



//       {/* <div className='p-4 flex flex-col justify-start items-start'>

//             <div className='bg-black w-96 h-72 flex justify-start'>

//             </div>
//           </div> */}









//       <div className="min-h-screen flex top-20 relative items-center justify-center  bg-white  ">
//         <div className=" h-16   bottom-auto    grid grid-cols-1 m-auto max-h-[400px] overflow-hidden rounded-lg shadow-lg bg-gray-200 relative left-10 w-[20rem] ml-1">


//           <div className="p-4  flex flex-col justify-around md:order-first md:w-2/5">
//             <ul>
//               <div className="flex cursor-pointer  absolute top-1  items-center w-20 h-12">


//               </div>



//             </ul>
//           </div>



//         </div>






//         <div className="w-screen h-screen flex relative bottom-0 md:right-11 rounded-sm">
//           <div className="relative grid grid-cols-1 md:grid-cols-2 m-auto h-[550px]     overflow-hidden     shadow-lg shadow-gray-600 w-[900px] rounded-xl ">


//             {/* Content Post Type  start*/}

//             {/* <div className='bg-black w- '>
//               <JoditEditor 
//                 // ref={editor}
//                 // value={content}
//                 onChange={newContent => setContent(newContent)}
//                 style={{ height: '100px' }} 
//               />
//             </div> */}







//             <textarea id="editor"></textarea>









//             <div className="max-w-sm p-6 top-32 absolute   ">


//             </div>




//             {/* <div className="max-w-sm p-6 absolute  mx-6  top-72   border border-gray-200 rounded-lg shadow bg-[#E4FCFF] dark:border-gray-500">
             

//             </div> */}










//           </div>

//         </div>

//       </div>






























//     </>
//   )



//   // return (
//   //   <JoditEditor

//   //   onChange={newContent => setContent(newContent)}

//   //   />

//   // )
// }

// export default joditPostCreation

