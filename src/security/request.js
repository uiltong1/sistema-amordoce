const baseUrl = "https://api-amordoce.herokuapp.com/api/"

function getHeaders(){
    const token = localStorage.getItem('token')
    return {
        'Content-type':'application/json',
        ...token && {
            'Authorization': `Bearer${token}`
        }
    };
}

async function request(method, url, body){
    const options = {
        method,
        headers: getHeaders(),
        ...(method != 'GET') && {
            body: JSON.stringify(body)
        }
    };
const response = await fetch(baseUrl + url, options)
return await response.json()
}

export {request as default, request, getHeaders}