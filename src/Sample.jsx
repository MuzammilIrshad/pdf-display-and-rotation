import { useCallback, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Grid } from '@mui/material';
import {ExtractPdfPages, RotatePdfPage} from '@muzammil931/pdf-pages-rotation'
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};


const maxWidth = 200;


export default function PdfPageRotationAndDownload() {
  const [file, setFile] = useState('./sample.pdf');
  const [event, setEvent] = useState('')
  const [numOfPages, setNumOfPages] = useState();
  const [isRotated, setIsRotated] = useState([])
  const [pdfFileData, setPdfFileData] = useState();

  const [pagesRotated, setPagesRotated] = useState([])


  const onFileSelection = async (e) => {
    const { files } = e.target;
    setFile(files[0] || null);
    setEvent(e)
         const url = await ExtractPdfPages(e);
         setPdfFileData(url);
  };

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    const myArray = new Array(nextNumPages).fill(false);
     setIsRotated(myArray);
    setNumOfPages(nextNumPages);
    console.log(nextNumPages);
  }
async function handleRotation (index){
  console.log(index)
  const numOfPagesRotated = [...pagesRotated, index]
  setPagesRotated(numOfPagesRotated)
  const url = await RotatePdfPage(event, numOfPagesRotated);
  setPdfFileData(url);
  let array = [...isRotated];
  array[index] = !isRotated[index]
  setIsRotated(array)
}
  const downloadPdf = () => {
    // Create a Blob URL from the PDF Blob
    // const pdfBlobUrl = URL.createObjectURL(pdfFileData);

    // Create a hidden anchor element
    const link = document.createElement('a');
    link.href = pdfFileData;
    link.download = 'document.pdf'; // You can specify the filename here
    link.style.display = 'none';

    // Append the anchor element to the document
    document.body.appendChild(link);

    // Simulate a click event to trigger the download
    link.click();

    // Clean up: remove the anchor element and revoke the Blob URL
    document.body.removeChild(link);
    URL.revokeObjectURL(pdfFileData);
  };
  return (
    <div>
      <header>
        <h1>react-pdf sample page</h1>
      </header>
        <div className="Example__container__load">
          <label htmlFor="file">Load from file:</label>{' '}
          <input onChange={onFileSelection} type="file" />
        </div>
        <div>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
          <Grid container spacing={2}>
            {Array.from(new Array(numOfPages), (el, index) => (
              <Grid item xs={8}  md={4} key={`page_${index + 1}`}>
                <div 
                style={{height:"auto", 
                width:"200px", 
                marginInline:"auto", 
                rotate:`${isRotated[index] ? '90deg':'0deg'}`, 
                justifyContent:"center", 
                scrollBehavior:"auto",
                pointerEvents:"cursor"}} onClick={()=>handleRotation(index)}>
                <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={maxWidth}
                style={{rotate:"90deg"}}
              />
                </div>
             </Grid>
            
            ))}
                      </Grid>

          </Document>
        </div>
        <div>
      <button onClick={downloadPdf}>Download PDF</button>
    </div>
        <iframe
        style={{ display: "block", width: "100%", height: "100%", border:"2px solid black" }}
        title="PdfFrame"
        src={pdfFileData}
        type="application/pdf"
      ></iframe>
    </div>
  );
}