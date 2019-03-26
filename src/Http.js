import axios from 'axios';

let $http;
/**
 * get(url,{params:{}}).then(res=>{}).cache(err=>{});
 * post(url, {}).then(res => {}).cache(err => {});
 * axios({ method: 'post', url: '',data: {}});

    并发 axios.all([...]).then(axios.spread(function (acct, perms) {
        // 两个请求现在都执行完成
    }));
    简写
    axios.request(config)
    axios.get(url[, config])
    axios.delete(url[, config])
    axios.head(url[, config])
    axios.post(url[, data[, config]])
    axios.put(url[, data[, config]])
    axios.patch(url[, data[, config]])
 */
$http = axios.create({
    baseURL: 'api/',
    timeout: 10000,
})

export default $http;