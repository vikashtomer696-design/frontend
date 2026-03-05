async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const bodyText = await response.text();
  let body;

  try {
    body = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    body = bodyText;
  }

  if (!response.ok) {
    const error = new Error(`HTTP request failed with status ${response.status}`);
    error.statusCode = response.status;
    error.responseBody = body;
    throw error;
  }

  return body;
}

module.exports = { requestJson };
