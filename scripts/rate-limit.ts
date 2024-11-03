import fetch from 'node-fetch'

const url = "http://sc4013-alb-257362673.ap-southeast-1.elb.amazonaws.com:80"
const endpoint = "/healthz"

const callAPI = async () => {
  const response = await fetch(url + endpoint)
  const data = await response.text()
  console.log("response", data)
}

const sleep = async () => {
  new Promise((resolve) => {
    setTimeout(resolve, 60 * 1000)
  })
}

  ;
(async () => {
  for (var i = 0; i < 50; i++) {
    console.log("i", i)
    await callAPI()
  }

  console.log("start timeout")
  await sleep()
  console.log("end timeout")
  for (var j = 0; j < 150; j++) {
    console.log("j", j)
    await callAPI()
  }

})()


