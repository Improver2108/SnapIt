chrome.runtime.sendMessage({snap:"takeSnap"});
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request.snap=="takeSnap"){
        html2canvas(document.body).then(function(canvas){
            canvas.toBlob(function(blob){
                window.saveAs(blob,"screenshot.png");
            });
        });
    }
    if (request.todo=="makePdf"){
        html2canvas(document.body).then(function(canvas) {
            var contentWidth = canvas.width;
            var contentHeight = canvas.height;
            var pageHeight = contentWidth / 592.28 * 841.89;
            var leftHeight = contentHeight;
            var position = 0;
            var imgWidth = 595.28;
            var imgHeight = 592.28/contentWidth * contentHeight;
            var pageData = canvas.toDataURL('image/jpeg', 1.0);
            var pdf = new jsPDF('', 'pt', 'a4');
            if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
            } else {
                while(leftHeight > 0) {
                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                    leftHeight -= pageHeight;
                    position -= 841.89;
                    //Avoid adding blank pages
                    if(leftHeight > 0) {
                      pdf.addPage();
                    }
                }
            }
            pdf.save('content.pdf');
        });
    }
});