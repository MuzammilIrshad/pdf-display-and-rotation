import { useCallback, useState } from 'react';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Grid } from '@mui/material';
import { PDFDocument, degrees } from 'pdf-lib';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 200;


export default function Sample() {
  const [file, setFile] = useState('./sample.pdf');
  const [numPages, setNumPages] = useState();
  const [isRotated, setIsRotated] = useState([])
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState();
  const [pdfFileData, setPdfFileData] = useState();
 const [arrayBuffer, setArrayBuffer] = useState()
  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  function renderPdf(uint8array) {
    const tempblob = new Blob([uint8array], {
      type: "application/pdf",
    });
    const docUrl = URL.createObjectURL(tempblob);
    setPdfFileData(docUrl);
  }

  async function extractPdfPage(arrayBuff, index=-1) {
    const pdfSrcDoc = await PDFDocument.load(arrayBuff);
    console.log(pdfSrcDoc)
    const pdfNewDoc = await PDFDocument.create();
    for (let i = 0; i < pdfSrcDoc.getPageCount(); i++) {
      const [copiedPage] = await pdfNewDoc.copyPages(pdfSrcDoc, [i]);
      if(index > -1 && index === i){
        console.log(index, i)
        copiedPage.setRotation(degrees(90))
        pdfNewDoc.addPage(copiedPage);
      }else{
        pdfNewDoc.addPage(copiedPage);
      }
    }
    const newpdf = await pdfNewDoc.save();
    return newpdf;
  }
  const onFileSelected = async (e) => {
    const fileList = e.target.files;
    if (fileList?.length > 0) {
      const pdfArrayBuffer = await readFileAsync(fileList[0]);
      console.log(pdfArrayBuffer)
      setArrayBuffer(pdfArrayBuffer)
      const newPdfDoc = await extractPdfPage(pdfArrayBuffer);
      renderPdf(newPdfDoc);
    }
  };
  const onResize = useCallback((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onFileChange(event) {
    const { files } = event.target;

    if (files && files[0]) {
      setFile(files[0] || null);
      onFileSelected(event)
    }
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    const myArray = new Array(nextNumPages).fill(false);
     setIsRotated(myArray);
    setNumPages(nextNumPages);
    console.log(nextNumPages);
  }
async function handleRotation (index){
  console.log(index)
  const newPdfDoc = await extractPdfPage(arrayBuffer, index);
  renderPdf(newPdfDoc);
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
          <input onChange={onFileChange} type="file" />
        </div>
        <div ref={setContainerRef}>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
          <Grid container spacing={2}>
            {Array.from(new Array(numPages), (el, index) => (
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

        {containerWidth}
        <iframe
        style={{ display: "block", width: "100%", height: "100%", border:"2px solid black" }}
        title="PdfFrame"
        src={pdfFileData}
        type="application/pdf"
      ></iframe>
    </div>
  );
}