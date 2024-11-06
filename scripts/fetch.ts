import fetch from "node-fetch";

(async () => {
  try {
    const url = "http://www.google.com"

    // Fetch external resource
    // VULNERABLE CODE: Using unvalidated URL from user input, which leads to RFI vulnerability
    const response = await fetch(url as string);
    console.log("response", response.body)
  } catch (error) {
    console.error(error)
  }
})()

