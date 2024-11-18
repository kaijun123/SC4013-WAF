const path = require('path')
const fs = require('fs')
const FormData = require('form-data');
const { fileFromPath } = require("formdata-node/file-from-path")
require('dotenv').config()

const axios = require('axios');

const base = process.env.WAF
// const base = proecess.env.EC2
// const base = "http://localhost:3000"

const usIP = process.env.US_IP
const sgIP = process.env.SG_IP
const adminIP = process.env.ADMIN_IP

let id = ""

require('dotenv').config()

  ;
describe("test suites", () => {

  test("test Geo-Blocking IP: Allowed IP: working", async () => {
    // set the X-Forwarded-For request header
    // case 1: singapore ip: allowed

    const url = base + "/healthz"
    const sgOptions = {
      method: "GET",
      headers: {
        "X-Forwarded-For": sgIP
      }
    }
    const { status } = await genericFetch(url, sgOptions)
    expect(status).toEqual(200)
  })

  test("test Geo-Blocking IP: Blocked IP: working", async () => {
    const url = base + "/healthz"
    // set the X-Forwarded-For request headers
    // case 2: us ip: not allowed
    const usOptions = {
      method: "GET",
      headers: {
        "X-Forwarded-For": usIP
      }
    }
    const { status } = await genericFetch(url, usOptions)
    expect(status).toEqual(401)
  })

  // test("test rate-limit: below rate-limit: not working", async () => {
  //   // limit: not more than 30 requests per 1 min
  //   // use the X-Forwarded-For headers to prevent rate limiting for the rest of the test
  //   const url = base + "/user/list"
  //   const options = {
  //     method: "GET",
  //     headers: { "X-Forwarded-For": sgIP }
  //   }

  //   // case 1: below the limit
  //   for (var i = 0; i < 200; i++) {
  //     const { status } = await genericFetch(url, options)
  //     // console.log(url, i, status)
  //     // if (i < 30) expect(status).toEqual(200)
  //     // else if (i >= 30) expect(status).toEqual(429)
  //   }
  // }, 100000)

  test("test Admin IP Whitelist: Allowed IP: working", async () => {
    const url = base + '/admin/deleteAll'

    const options = {
      method: "DELETE",
      headers: { "X-Forwarded-For": adminIP }
    }
    const { status } = await genericFetch(url, options)
    expect(status).toEqual(200)
  })

  test("test Admin IP Whitelist: Blocked IP: working", async () => {
    const url = base + '/admin/deleteAll'

    const options = {
      method: "DELETE",
      headers: { "X-Forwarded-For": sgIP }
    }
    const { status } = await genericFetch(url, options)
    expect(status).toEqual(402)
  })

  test("clear the database for consistent testing: working", async () => {
    const url = base + "/admin/deleteAll"
    const options = {
      method: "DELETE",
      headers: {
        "X-Forwarded-For": adminIP
      }
    }
    const { headers, status, body } = await genericFetch(url, options)
    // console.log("headers", headers, "status", status, "body", body)
    expect(status).toEqual(200)
  })

  // test("test file upload: invalid file extensions (.txt): working", async () => {
  //   // calls /user/upload api
  //   const url = base + "/user/upload"
  //   // console.log("url", url)

  //   // const filePath = path.resolve("./upload.pdf");
  //   // console.log("filePath", filePath)

  //   // case 1: upload .txt file: not allowed
  //   var formData = new FormData()
  //   formData.append('title', 'txtFile')
  //   formData.append('author', 'txtFile')
  //   formData.append('file', fs.createReadStream('upload.txt'))

  //   var options = {
  //     method: "POST",
  //     headers: {
  //       "X-Forwarded-For": sgIP,
  //       "Content-Type": "multipart/form-data",
  //     },
  //     data: formData
  //   }

  //   const { status } = await genericFetch(url, options)
  //   expect(status).not.toEqual(200)
  //   // expect(status).toEqual(403)
  // })

  // test("test file upload: valid file extensions (.pdf): not working", async () => {
  //   // calls /user/upload api
  //   const url = base + "/user/upload"
  //   // console.log("url", url)

  //   // case 2: upload .pdf file: allowed
  //   const formData = new FormData()
  //   formData.append('title', 'pdfFile')
  //   formData.append('author', 'pdfFile')
  //   formData.append('file', fs.createReadStream('upload.pdf'))

  //   const options = {
  //     method: "POST",
  //     headers: {
  //       "X-Forwarded-For": sgIP,
  //       "Content-Type": "multipart/form-data",
  //     },
  //     data: formData
  //   }

  //   const { status, body } = await genericFetch(url, options)
  //   id = body.id
  //   expect(status).toEqual(200)
  // })

  // // what is catching this test is that the waf thinks that the json object is invalid:
  // // and if we set the rule to reject invalid json objects, then it will reject
  // test("test file upload: invalid file size (> 1MB): working", async () => {
  //   // calls /user/upload api
  //   // upload oversized document
  //   const url = base + "/user/upload"

  //   const formData = new FormData()
  //   formData.append('title', 'oversized')
  //   formData.append('author', 'oversized')
  //   formData.append('file', fs.createReadStream('oversized.pdf'))

  //   const options = {
  //     method: "POST",
  //     headers: {
  //       "X-Forwarded-For": sgIP,
  //       "Content-Type": "multipart/form-data",
  //     },
  //     data: formData
  //   }

  //   const { status } = await genericFetch(url, options)
  //   expect(status).toEqual(404)
  // })

  // test("test file download: XSS and social engineering: not working", async () => {
  //   // step 1: upload malicious file
  //   var url = base + "/user/upload"

  //   var formData = new FormData()
  //   formData.append('title', 'malicious')
  //   formData.append('author', 'malicious')
  //   formData.append('file', fs.createReadStream('malicious.txt'))

  //   var options = {
  //     method: "POST",
  //     headers: {
  //       "X-Forwarded-For": sgIP,
  //       "Content-Type": "multipart/form-data",
  //     },
  //     data: formData
  //   }

  //   const { status: maliciousStatus, body: maliciousBody } = await genericFetch(url, options)
  //   expect(maliciousStatus).toEqual(403)

  //   // step 2: download a malicious file
  //   const id = maliciousBody ? maliciousBody["id"] : ""
  //   url = base + `/user/download?id=${id}`
  //   options = {
  //     method: "GET",
  //     headers: { "X-Forwarded-For": sgIP }
  //   }

  //   const { body, headers, status } = await genericFetch(url, options)
  //   // console.log("body", body)
  //   // console.log("headers", headers)
  //   // console.log("status", status)

  //   expect(status).toEqual(400)
  // })

  test("test local file inclusion: working", async () => {
    // Note: this attack will only breach the system if the current user has access to the desired files
    const url = base + "/user/lfi?path=/home/ubuntu/.ssh/authorized_keys"
    const options = {
      method: "GET",
      headers: { "X-Forwarded-For": sgIP }
    }
    const { body, status } = await genericFetch(url, options)
    // console.log("body", body)
    // console.log("status", status)
    expect(status).toEqual(405)
  })

  test("test remote file inclusion: HTTP: working", async () => {
    const url = base + "/user/rfi?url=http://localhost:3000/healthz"
    const options = {
      method: "GET",
      headers: { "X-Forwarded-For": sgIP }
    }
    const { status } = await genericFetch(url, options)
    expect(status).toEqual(406)
  })

  test("test remote file inclusion: HTTPS: working", async () => {
    const url = base + "/user/rfi?url=https://jsonplaceholder.typicode.com/comments?postId=2"
    const options = {
      method: "GET",
      headers: { "X-Forwarded-For": sgIP }
    }
    const { status } = await genericFetch(url, options)
    expect(status).toEqual(407)
  })

  // note: sql injection rule must come before file size check: so that it catches first
  test("test the sql injection: working", async () => {
    // calls /user/upload api
    // malicious request body

    const url = base + "/admin/insert"

    const txtOptions = {
      method: "PATCH",
      headers: {
        "X-Forwarded-For": adminIP,
      },
      data: {
        "id": "db9d85f2-298a-5772-a374-8b953a383e01",
        "title": "placeholder2",
        "author": "'placeholder'); DROP TABLE books; --"
      }
    }

    const { status } = await genericFetch(url, txtOptions)
    expect(status).toEqual(408)
  })

})


const genericFetch = async (url, options = { method: "GET" }) => {
  try {
    const response = await axios(url, options);
    return { body: response.data, headers: response.headers, status: response.status }
  } catch (err) {
    // console.error(err)
    return { body: err.data, headers: err.headers, status: err.status }
  }
}

const delay = (durationInSec) => new Promise((resolve) => setTimeout(resolve, durationInSec * 1000))
