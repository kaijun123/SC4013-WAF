const path = require('path')
const fs = require('fs')
const FormData = require('form-data');
const { fileFromPath } = require("formdata-node/file-from-path")

const axios = require('axios');

// const base = "http://47.129.190.238:3000"
const base = "http://localhost:3000"
const sgIP = "180.129.28.186"
const sgIP2 = "180.129.28.187"
const usIP = "54.129.255.255"


require('dotenv').config()

  ;
describe("test suites", () => {

  test("test Geo-Blocking IP: Allowed IP", async () => {
    // set the X-Forwarded-For request header
    // case 1: singapore ip: allowed

    const url = base + "/healthz"
    const sgOptions = {
      method: "GET",
      header: {
        "X-Forwarded-For": sgIP
      }
    }
    const { status } = await genericFetch(url, sgOptions)
    expect(status).toEqual(200)
  })

  test("test Geo-Blocking IP: Blocked IP", async () => {
    // set the X-Forwarded-For request header
    // case 2: us ip: not allowed
    const usOptions = {
      method: "GET",
      header: {
        "X-Forwarded-For": usIP
      }
    }
    const { status } = await genericFetch(url, usOptions)
    expect(status).toEqual(403)
  })

  test("clear the database for consistent testing", async () => {
    const url = base + "/admin/deleteAll"
    const sgOptions = {
      method: "DELETE",
      header: {
        "X-Forwarded-For": sgIP
      }
    }
    const { status } = await genericFetch(url, sgOptions)
    expect(status).toEqual(200)
  })

  test("test file upload: invalid file extensions (.txt)", async () => {
    // calls /user/upload api
    const url = base + "/user/upload"
    // console.log("url", url)

    // const filePath = path.resolve("./upload.pdf");
    // console.log("filePath", filePath)

    // case 1: upload .txt file: not allowed
    var formData = new FormData()
    formData.append('title', 'txtFile')
    formData.append('author', 'txtFile')
    formData.append('file', fs.createReadStream('upload.txt'))

    var txtOptions = {
      method: "POST",
      header: {
        "X-Forwarded-For": sgIP,
        "Content-Type": "multipart/form-data",
      },
      data: formData
    }

    const { status } = await genericFetch(url, txtOptions)
    expect(status).toEqual(400)
  })

  test("test file upload: valid file extensions (.pdf)", async () => {
    // calls /user/upload api
    const url = base + "/user/upload"
    // console.log("url", url)

    // const filePath = path.resolve("./upload.pdf");
    // console.log("filePath", filePath)

    // case 2: upload .pdf file: allowed
    const formData = new FormData()
    formData.append('title', 'pdfFile')
    formData.append('author', 'pdfFile')
    formData.append('file', fs.createReadStream('upload.pdf'))

    const txtOptions = {
      method: "POST",
      header: {
        "X-Forwarded-For": sgIP,
        "Content-Type": "multipart/form-data",
      },
      data: formData
    }

    const { status } = await genericFetch(url, txtOptions)
    expect(status).toEqual(200)
  })

  test("test file upload: invalid file size (> 1MB)", async () => {
    // calls /user/upload api
    // upload oversized document
    const url = base + "/user/upload"

    const formData = new FormData()
    formData.append('title', 'oversized')
    formData.append('author', 'oversized')
    formData.append('file', fs.createReadStream('oversized.pdf'))

    const txtOptions = {
      method: "POST",
      header: {
        "X-Forwarded-For": sgIP,
        "Content-Type": "multipart/form-data",
      },
      data: formData
    }

    const { status } = await genericFetch(url, txtOptions)
    expect(status).toEqual(200)
  })

  test("test file download: XSS and social engineering", async () => {
    // step 1: upload malicious file
    var url = base + "/user/upload"

    var formData = new FormData()
    formData.append('title', 'malicious')
    formData.append('author', 'malicious')
    formData.append('file', fs.createReadStream('malicious.txt'))

    var txtOptions = {
      method: "POST",
      header: {
        "X-Forwarded-For": sgIP,
        "Content-Type": "multipart/form-data",
      },
      data: formData
    }

    const { status: maliciousStatus, body: maliciousBody } = await genericFetch(url, txtOptions)
    expect(maliciousStatus).toEqual(400)

    // step 2: download a malicious file
    const id = maliciousBody["id"]
    url = base + `/user/download?id=${id}`
    txtOptions = {
      method: "GET",
      header: { "X-Forwarded-For": sgIP }
    }

    const { body, header, status } = await genericFetch(url, txtOptions)
    // console.log("body", body)
    // console.log("header", header)
    // console.log("status", status)

    expect(status).toEqual(400)
  })

  test("test local file inclusion", async () => {
    const url = base + "/user/lfi?path=/etc/passwd"
    const options = {
      method: "GET",
      header: { "X-Forwarded-For": sgIP }
    }
    const { body, status } = await genericFetch(url, options)
    console.log("body", body)
    console.log("status", status)
    expect(status).toEqual(400)
  })

  test("test remote file inclusion", async () => {
    const url = base + "/user/rfi?url=http://localhost:3000/healthz"
    const options = {
      method: "GET",
      header: { "X-Forwarded-For": sgIP }
    }
    const { status } = await genericFetch(url, options)
    expect(status).toEqual(200)
  })

  test("test the sql injection", async () => {
    // calls /user/upload api
    // malicious request body

    const url = base + "/user/upload"

    const formData = new FormData()
    formData.append('author', "placeholder'); DROP TABLE books; --")
    formData.append('title', "placeholder")
    formData.append('file', fs.createReadStream('upload.txt'))

    const txtOptions = {
      method: "POST",
      header: {
        "X-Forwarded-For": sgIP,
        "Content-Type": "multipart/form-data",
      },
      data: formData
    }

    const { status } = await genericFetch(url, txtOptions)
    expect(status).toEqual(200)
  })

  test("test rate-limit: below rate-limit", async () => {
    // limit: not more than 30 requests per 1 min
    // use the X-Forwarded-For header to prevent rate limiting for the rest of the test
    const url = base + "/user/list"
    const options = {
      method: "GET",
      header: { "X-Forwarded-For": sgIP }
    }

    // case 1: below the limit
    for (var i = 0; i < 50; i++) {
      const { status } = await genericFetch(url, options)
      if (i < 30) expect(status).toEqual(200)
      else if (i > 30) expect(status).toEqual(400)
    }
  }, 100000)
})


const genericFetch = async (url, options = { method: "GET" }) => {
  const response = await axios(url, options);
  return { body: response.data, header: response.headers, status: response.status }
}

const delay = (durationInSec) => new Promise((resolve) => setTimeout(resolve, durationInSec * 1000))
