
# PreRequisites:

+ Recommended library to render/display pdf pages is,  [react-pdf](https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md). You can also use anyother pdf library as well in order to render your pdf.

+ You can also use iframe tag to render the url that the below functions will return.


+ For complete Project which includes [react-pdf](https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md) implementation as well. Please follow this github:

[Github/MuzammilIrshad](https://github.com/MuzammilIrshad/pdf-display-and-rotation)
# Getting Started

### Step 01:
   
   **```npm i @muzammil931/pdf-pages-rotation```**

### Step 02:

```import {ExtractPdfPages, RotatePdfPage} from '@muzammil931/pdf-pages-rotation'```

In this import, **`ExtractPdfPages`** function takes argument event and returns back a url which you can use to render your pdf.

The **`RotatePdfPage1`** function takes `event` as well as an `array of numbers` as arguments. The `event` will contain pdf file and `array of numbers` will contain all those page numbers on which user has clicked on and changed their rotation. So that user can rotate multiple pdf pagess, instead of one at a time.

### Step 03:

```
const pagesAlreadyRotated = [] //stores page numbers of pages that are already rotated.
let pdfFileUrl = '' // stores url of pdf to render pdf in browser
let event = '' // stores event which contains user selected pdf file

  const onFileSelection = async (e) => {
    const { files } = e.target;
    event = e;
         const url = await ExtractPdfPages(e);
         pdfFileUrl = url
  };
```
> This function is an onChange function and whenever the pdf input tag will change, this function will be called and a url will be given, which will contain all pdf pages in a single form.
  
```
async function handleRotation (pageNumber){

  const numOfPagesRotated = [...pagesAlreadyRotated, pageNumber]
  const url = await RotatePdfPage(event, numOfPagesRotated);
  pdfFileUrl = url
  <!--
   Logic to show user a rotated page on frontend.
    For example: A logic which will rotate the div in which page is being displayed or to download the updated file. Simply add this:

    // Create a hidden anchor element
    const link = document.createElement('a');
    link.href = pdfFileUrl;
    link.download = 'document.pdf'; // You can specify the filename here
    link.style.display = 'none';

    // Append the anchor element to the document
    document.body.appendChild(link);

    // Simulate a click event to trigger the download
    link.click();

    // Clean up: remove the anchor element and revoke the Blob URL
    document.body.removeChild(link);
    URL.revokeObjectURL(pdfFileUrl);
   -->
}
```

The `handleRotation` function will return the url of updated pdf which will contain the pages that user rotated, alongside rest of the pages. 

