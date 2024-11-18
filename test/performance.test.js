const path = require('path')
const fs = require('fs')
const FormData = require('form-data');
const { fileFromPath } = require("formdata-node/file-from-path")

const axios = require('axios');

const ec2 = "http://47.129.190.238:3000"
const waf = "http://sc4013-alb-257362673.ap-southeast-1.elb.amazonaws.com:80"
const sgIP = "180.129.28.186"
const usIP = "54.129.255.255"
const adminIP = "155.69.182.20" // hall room ip


require('dotenv').config()

  ;
describe("test suites", () => {

  test("ec2", async () => {
    var timings = 0

    for (var i = 0; i < 100; i++) {
      const start = Date.now()
      const { body, status: uploadStatus } = await uploadFile(ec2, Number(i))
      expect(uploadStatus).toEqual(200)
      const { status: downloadStatus } = await downloadFile(ec2, body["id"])
      expect(downloadStatus).toEqual(200)
      const { status: deleteStatus } = await deleteBook(ec2, body["id"])
      expect(deleteStatus).toEqual(200)
      const end = Date.now()
      timings += end - start
    }

    console.log("duration (with ec2):", timings / 100, "ms")

  }, 60000)

  test("waf", async () => {
    var timings = 0

    for (var i = 0; i < 100; i++) {
      const start = Date.now()
      const { body, status: uploadStatus } = await uploadFile(waf, Number(i))
      expect(uploadStatus).toEqual(200)
      const { status: downloadStatus } = await downloadFile(waf, body["id"])
      expect(downloadStatus).toEqual(200)
      const { status: deleteStatus } = await deleteBook(waf, body["id"])
      expect(deleteStatus).toEqual(200)
      const end = Date.now()
      timings += end - start
    }

    console.log("duration (with waf):", timings / 100, "ms")

  }, 60000)
})

const uploadFile = async (base, placeholder) => {
  const url = base + "/user/upload"

  // case 1: upload .txt file: not allowed
  var formData = new FormData()
  formData.append('title', placeholder)
  formData.append('author', placeholder)
  formData.append('file', fs.createReadStream('upload.pdf'))

  var options = {
    method: "POST",
    headers: {
      "X-Forwarded-For": sgIP,
      "Content-Type": "multipart/form-data",
    },
    data: formData
  }

  return await genericFetch(url, options)
}

const downloadFile = async (base, id) => {
  const url = base + `/user/download?id=${id}`
  const options = {
    method: "GET",
    headers: { "X-Forwarded-For": sgIP }
  }

  return await genericFetch(url, options)
}

const deleteBook = async (base, id) => {
  const url = base + `/admin/delete`
  const options = {
    method: "DELETE",
    headers: { "X-Forwarded-For": adminIP },
    data: { "id": id }
  }

  return await genericFetch(url, options)
}

const genericFetch = async (url, options = { method: "GET" }) => {
  try {
    const response = await axios(url, options);
    return { body: response.data, headers: response.headers, status: response.status }
  } catch (err) {
    console.log(err)
    return { body: err.response.data, headers: err.headers, status: err.status }
  }
}
