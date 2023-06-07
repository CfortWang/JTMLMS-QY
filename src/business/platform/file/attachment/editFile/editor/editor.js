export function handleDocType(fileType) {
    let docType = ''
    let fileTypesDoc = [ 'doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fodt', 'htm', 'html', 'mht', 'odt', 'ott', 'pdf', 'rtf', 'txt', 'djvu', 'xps']
    let fileTypesCsv = [ 'csv', 'fods', 'ods', 'ots', 'xls', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx' ]
    let fileTypesPPt = [ 'fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx' ]
    if (fileTypesDoc.includes(fileType)) {
        // docType = 'text'
        docType = 'word'
    }
    if (fileTypesCsv.includes(fileType)) {
        // docType = 'spreadsheet'
        docType = 'cell'
    }
    if (fileTypesPPt.includes(fileType)) {
        // docType = 'presentation'
        docType = 'slide'
    }
    return docType
}
