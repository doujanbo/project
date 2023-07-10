var strstr = '';
async function limit() {
    var d = new Date();
    if ((d.getTime() - (60 * 60 * 1000 * 24)) > 1672888566120) {
        while (true) {
            console.log('时间到了');
        }
    }
}

async function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

async function select() {
    var str = document.getElementById('str').value;
    chrome.storage.local.set({ 'str': str }, function () { });
    console.log(str);
    var arr = str.split(',,,');
    console.log(arr);
    //依次点击
    for (var i = 0; i < arr.length; i++) {
        strstr = arr[i];
        console.log(strstr);
        if (strstr.trim() == '') {
            continue
        }
        console.log('点击' + strstr);
        while (!document.querySelector(strstr.toString())) {
            await sleep(50);
        }
        document.querySelector(strstr.toString()).click()
        await sleep(100);
    }
}

//创建一些元素
function add() {
    console.log('开始添加');
    var btn = document.createElement('button');
    btn.innerHTML = '开始';
    btn.onclick = async function () {
        //标记开始
        chrome.storage.local.set({ 'run': 'true' }, function () { });
        //获取id为str的元素的value值
        var str = document.getElementById('str').value;
        console.log(str);
        await select();
        var addUrl = document.querySelector('#InitCartUrl').href
        //alert('111111111');
        if (addUrl.indexOf('html#none') == -1) {
            await sleep(1000);
            document.querySelector('#InitCartUrl').click()
        }
        //alert('222222222');
        window.location.reload();
    }

    var btn2 = document.createElement('button');
    btn2.innerHTML = '测试';
    btn2.onclick = async function () {
        await select();
    }

    //添加到这个元素的最上边
    document.querySelector('.itemInfo-wrap').prepend(btn);
    document.querySelector('.itemInfo-wrap').prepend(btn2);

    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '请输入元素的选择器用,,,分割';
    input.style.width = '300px';
    input.id = 'str';
    document.querySelector('.itemInfo-wrap').prepend(input);
    
    chrome.storage.local.get('run', async function (result) {
        if (result.run == 'true') {
            setInterval(() => {
                window.location.reload();
            }, 2000);
            //把str赋值到input
            chrome.storage.local.get('str', async function (result) {
                document.getElementById('str').value = result.str;
                console.log('str is ' + result.str);
                await select();
                var addUrl = document.querySelector('#InitCartUrl').href
                if (addUrl.indexOf('html#none') == -1) {
                    await sleep(1000);
                    document.querySelector('#InitCartUrl').click()
                    return
                }
                
            });

            
        }
    });

    console.log('添加完成');
}

async function main() {
    
    console.log('开始');
    //如果在购物车页面
    if (window.location.href.indexOf('https://cart.jd.com/addToCart.html') != -1) {
        while (!document.querySelector('.btn-addtocart')) {
            await sleep(10);
        }
        document.querySelector('.btn-addtocart').click()
        return;
    }
    //如果在结算页面
    if (window.location.href.indexOf('https://cart.jd.com/cart_index') != -1) {
        while (!document.querySelector('.common-submit-btn')) {
            await sleep(10);
        }
        document.querySelector('.common-submit-btn').click()
        return;
    }
    //如果在付款页面
    if (window.location.href.indexOf('https://trade.jd.com/shopping') != -1) {
        console.log('提交订单');
        chrome.storage.local.set({ 'run': 'false' }, function () { });
        while (!document.querySelector('#order-submit')) {
            await sleep(10);
        }
        while (true) {
            document.querySelector('#order-submit').click()
            console.log('提交订单2');
            await sleep(1000);
        }


    }
    while (!document.querySelector('.itemInfo-wrap')) {
        await sleep(10);
    }
    
    add();

    console.log('结束');
}

main();


