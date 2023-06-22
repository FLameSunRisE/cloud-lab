export const callApi = async (url: string, method: string, data?: any) => {
  try {
    const response = await fetch(url, {
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
