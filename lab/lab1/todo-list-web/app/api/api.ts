// const apiHost = process.env.API_HOST;
// const apiPort = process.env.API_PORT;
// const apiUrl = `http://${apiHost}:${apiPort}/api/todos`;
// export const backendUrl = "http://backend:8080/";
export const backendUrl = "http://localhost:8080/";

export const callApi = async (url: string, method: string, data?: any) => {
  try {
    let apiUrl = backendUrl + url;
    console.log("callApi url:" + apiUrl);
    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data || {}),
    });

    if (response.ok) {
      if (response.status === 204) {
        return null; // 若狀態碼為 204，回傳 null 或其他你覺得適合的值
      } else {
        const responseData = await response.json();
        return responseData;
      }
    } else {
      throw new Error(`API request failed with status ${response.status}`);
    }
  } catch (error) {
    throw new Error(`API request error: ${error}`);
  }
};

export const callApiGet = async (url: string) => {
  try {
    let apiUrl = backendUrl + url;
    console.log("callApi url:" + apiUrl);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("API request error");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
};
