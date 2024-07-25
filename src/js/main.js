const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

//Exemplo de como criar um novo axios com uma baseURL diferente e um header diferente do axios padrão, e com header default com authorization fora da instancia do axios - ambos tem o mesmo resultado
// const newAxios = axios.create({
//     baseURL: 'https://api.example.com'
// })
// newAxios.defaults.headers['Authorization'] = 'new axios token'

//Exemplo de como criar um novo axios com uma baseURL diferente e um header diferente do axios padrão, e com header default com authorization dentro da instancia do axios - ambos tem o mesmo resultado
const newAxios = axios.create({
    baseURL: 'https://api.example.com',
    headers: {
        Authorization: 'new axios token'
    }
})
//newAxios.defaults.headers['Authorization'] = 'new axios token'

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
axios.defaults.headers['Content-Type'] = 'application/json';

//Se for usar interceptores na nova instancia do axios, deve ser feito da seguinte forma:
// newAxios.interceptors.request.use( ...
// Assim como o axios no get deve ser usando a instancia desejada, no caso newAxios.get ...
// newAxios.get('/posts', config)
//     .then((response) => renderOutput(response))

axios.interceptors.request.use(
    function (config) {
        //console.log('Config do request', config);
        //console.log('Config headers do request', config.headers);

        // Verifica se os headers comuns estão definidos
        // Verifica se config.headers está definido: Se config.headers não estiver definido, cria um novo objeto para config.headers.
        // if (!config.headers) {
        //     config.headers = {};
        // }
        // if (!config.headers.common) {
        //     config.headers.common = {};
        // }

        //No exemplo abaixo ele ira introduzir um header com o nome qualquerCoisa e valor Token
        config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        //Exemplo de retorno:
        //         08: 39:03.931 Config headers do request 
        // Object { Accept: "application/json, text/plain, */*", "Content-Type": undefined }
        //         Accept: "application/json, text/plain, */*"
        //         Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        //         "Content-Type": undefined
        //             < prototype >: Object { … }
        console.log(config)

        //Exemplo de como adicionar o header Authorization no headers.common
        // Verifica se config.headers.common está definido: Se config.headers.common não estiver definido, cria um novo objeto para config.headers.common.
        // if (!config.headers.common) {
        //     config.headers.common = {};
        // }
        // Adiciona o header Authorization no headers.common
        // Adiciona o cabeçalho Authorization: Adiciona o cabeçalho Authorization dentro de config.headers.common
        // config.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        // console.log(config);

        // Ao fazer essas verificações, garantimos que common é um objeto válido e podemos adicionar o cabeçalho desejado corretamente.Isso deve resolver o problema e garantir que o cabeçalho Authorization seja aplicado a todas as requisições conforme esperado.
        return config
    },
    function (error) {
        return Promise.reject(error)
    });

// Adicionar um interceptor na resposta (response)
axios.interceptors.response.use(function (response) {
    console.log('sucesso')
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    console.log(error.response)

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

const get = () => {
    const config = {
        params: {
            _limit: 5
        }
    };
    axios.get('/posts', config)
        .then((response) => renderOutput(response))
}

const post = () => {
    const data = {
        title: 'foo',
        body: 'bar',
        userId: 1
    };
    axios.post(`/posts`, data)
        .then((response) => renderOutput(response))
}

const put = () => {
    const data = {
        title: 'foo',
        body: 'bar',
        userId: 1
    };
    axios.put(`/posts/1`, data)
        .then((response) => renderOutput(response))
}

const patch = () => {
    const data = {
        title: 'Vue.js',

    };
    axios.patch(`/posts/1`, data)
        .then((response) => renderOutput(response))
}

const del = () => {
    axios.delete(`/posts/2`, data)
        .then((response) => renderOutput(response))
}

const multiple = () => {
    Promise.all([
        axios.get(`/posts?_limit=5`),
        axios.get(`/users?_limit=5`)
    ]).then((response) => {
        //console.log(response);
        console.table(response[0].data);
        console.table(response[1].data);
        //console.log('posts', posts.data);
        //console.log('users', users.data);
    })
}

const transform = () => {
    const config = {
        params: {
            _limit: 5
        },
        transformResponse: [
            function (data) {
                const payload = JSON.parse(data).map(o => {
                    return {
                        ...o,
                        first_name: 'Jon',
                        last_name: 'Snow',
                        full_name: 'Jon Snow'
                    }
                })
                return payload;
            }],
    };
    axios.get('https://jsonplaceholder.typicode.com/posts', config)
        .then((response) => renderOutput(response))
}

const errorHandling = () => {
    axios.get('https://jsonplaceholder.typicode.com/postsz')
        .then((response) => renderOutput(response))
        .catch((error) => {
            if (error.response) {
                renderOutput(error.response);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                // console.log('Error with response', error.response.status);
            } else if (error.request) {
                renderOutput(error.request);
                // console.log('Error with request', error.request);
            } else {
                renderOutput(error.message);
                // console.log('Error', error.message);
            }
        })
}

const cancel = () => {
    const controller = new AbortController();
    const config = {
        params: {
            _limit: 5
        },
        signal: controller.signal
    };
    // Se for usar com o methodo post o config deve ser passado como segundo argumento, pois o primeiro parametro é o data;
    axios.get('https://jsonplaceholder.typicode.com/posts', config)
        .then((response) => renderOutput(response))
        .catch((error) => {
            console.log(error.message)
        })

    controller.abort();
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
