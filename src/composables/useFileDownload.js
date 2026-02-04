// composables/useFileDownload.js
export function useFileDownload() {
    function downloadBlob(blob, fileName, mime = 'application/octet-stream') {
        const url = window.URL.createObjectURL(
            new Blob([blob], { type: mime })
        )

        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        window.URL.revokeObjectURL(url)
    }

    return { downloadBlob }
}
