const path = require('path')
const fs = require('fs')
const FormData = require('form-data');
const { fileFromPath } = require("formdata-node/file-from-path")

const axios = require('axios');

const ec2 = "http://47.129.190.238:3000"
const waf = "http://47.129.190.238:3000"
const sgIP = "180.129.28.186"
const usIP = "54.129.255.255"


require('dotenv').config()

  ;
describe("test suites", () => {

  test("waf", async () => {
    const start = Date.now()

    for (var i = 0; i < 100; i++) {
      const { body } = await uploadFile(waf, Number(i))
      await downloadFile(waf, body["id"])
    }

    const end = Date.now()
    console.log("duration:", end - start)
  })

  test("ec2", async () => {
    const start = Date.now()

    for (var i = 0; i < 100; i++) {
      const { body } = await uploadFile(ec2, Number(i))
      await downloadFile(ec2, body["id"])
    }

    const end = Date.now()
    console.log("duration:", end - start)
  })
})

const uploadFile = async (base, placeholder) => {
  const url = base + "/user/upload"

  // case 1: upload .txt file: not allowed
  var formData = new FormData()
  formData.append('title', placeholder)
  formData.append('author', placeholder)
  formData.append('file', fs.createReadStream('upload.txt'))

  var txtOptions = {
    method: "POST",
    header: {
      "X-Forwarded-For": sgIP,
      "Content-Type": "multipart/form-data",
    },
    data: formData
  }

  return await genericFetch(url, txtOptions)
}

const downloadFile = async (base, id) => {
  const url = base + `/user/download?id=${id}`
  const txtOptions = {
    method: "GET",
    header: { "X-Forwarded-For": sgIP }
  }

  return await genericFetch(url, txtOptions)
}


const genericFetch = async (url, options = { method: "GET" }) => {
  const response = await axios(url, options);
  return { body: response.data, header: response.headers, status: response.status }
}
