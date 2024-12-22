model SignedUrl {
fileId uint
url string
isVisited
}

generateSignedUrl(fileId) {
let signedurl = new SignedUrl(fileId, uuid)
let uuid = new uuid(16)

    now i got a link localhost:8080/uuid
    lifetime - 1 hour

    startChronoTask({
        lifetime: "1 hour",
        task: deleteSignedUrl
    })

}
