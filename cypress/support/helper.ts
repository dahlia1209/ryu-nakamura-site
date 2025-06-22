//アクセストークン
export function cyGetAccessToken(
  pythonScriptPath = 'C:\\src\\ryu-nakamura-api\\.venv\\Scripts\\auth_client.py',
) {
  return cy
    .exec(`python ${pythonScriptPath}`, {
      timeout: 30000,
    })
    .then((result) => {
      const accessToken = JSON.parse(result.stdout).access_token
      return String(accessToken)
    })
}

// ユーザ作成
export async function createUser(accessToekn: string, userId: string,provider: string,email: string) {
  const endpoint = new URL(`${Cypress.env('api_endpoint')}/users`)
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToekn}`,
    },
    body: JSON.stringify({
      id: userId,
      provider: provider,
      email: email,
    }),
  })
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  return
}

//ユーザ取得
export async function getUser(accessToekn: string, userId: string) {
  const endpoint = new URL(`${Cypress.env('api_endpoint')}/users/${userId}`)
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToekn}`,
    },
  })
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const data= await response.json()

  return data
}

// ユーザ削除
export async function deleteUser(accessToekn: string, userId: string) {
  const endpoint = new URL(`${Cypress.env('api_endpoint')}/users/${userId}`)
  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToekn}`,
    },
    body: JSON.stringify({}),
  })
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return
}

//オーダー取得
export async function getOrder(accessToekn: string, orderId: string) {
  const endpoint = new URL(`${Cypress.env('api_endpoint')}/orders?user_id=${orderId}&status=complete`)
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToekn}`,
    },
  })
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const data= await response.json()

  return data
}

//オーダー削除
export async function deleteOrder(accessToekn: string, orderId: string) {
  const endpoint = new URL(`${Cypress.env('api_endpoint')}/orders/${orderId}`)
  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToekn}`,
    },
    body: JSON.stringify({}),
  })
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return
}
