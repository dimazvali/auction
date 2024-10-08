
const tg = window.Telegram.WebApp;
const host = `auction`
let mcb, mbbc, curLecture, curTicket, curAlert = null;

window.Telegram.WebApp.disableVerticalSwipes()
window.Telegram.WebApp.expand()


function showLoad(){
    tg.MainButton.setParams({
        text:`загружаем`,
        is_visible: true
    })
    tg.MainButton.showProgress()
}

// tg.showAlert(tg.isVerticalSwipesEnabled)






function preparePopup(type) {
    tg.BackButton.show();
    tg.onEvent('backButtonClicked', clearPopUp)

    if (document.querySelector(`[data-type="${type}"]`)) {
        document.querySelector(`[data-type="${type}"]`).remove()
    }

    let index = Math.floor(Math.random()*4)+1

    mcb = clearPopUp
    let popup = ce('div', false, 'popup', false, {
        dataset: {
            type: type
        }
    })

    
    document.body.append(popup)
    let content = ce('div')
    // content.style.backgroundImage = `url(/images/books/bg/xray${index}.png)`
    // content.style.animation = `bgRise 1s forwards`
    popup.append(content)

    tg.MainButton.hide()
    return content
}


function clearPopUp() {
    let length = document.querySelectorAll('.popup').length;

    console.log(length)

    let p = document.querySelectorAll('.popup')[length - 1]

    console.log(p)

    p.classList.add('sb')

    setTimeout(function () {
        p.remove()
        if (!document.querySelectorAll('.popup').length) tg.BackButton.hide()
    }, 500)

    if (mcb) {
        tg.MainButton.offClick(mcb)
        mcb = null;
        tg.MainButton.hide()
    }

    if (mbbc) {
        tg.MainButton.hide()
        tg.MainButton.offClick(mbbc)
        mbbc = null
    }
}

function toast(txt){
    tg.MainButton.setParams({
        text: txt,
        is_visible: true
    })
    setTimeout(()=>{
        tg.MainButton.hide()
    },1500)
}







let confirmed = false;

// if(authNeeded){
    console.log(`Нужна авторизация`)
    confirmed = axios.post(`/${host}/authWebApp?token=userToken`,tg.initData)
        .then(s=>{
            // confirmed = 
            console.log(`получили данные админа ${s.data}`)
            return s.data.admin;
        })
// }

let pageData;

function requestPayment(amount){
    axios.post(`/${host}/refill`,{
        amount: +amount
    }).then(s=>{
        tg.openInvoice(s.data.invoice)
    }).catch(handleError)
}


function userLoad(collection, id, extra) {
    return axios.get(`/${host}/api/${collection}${id?`/${id}`:''}${extra?`?${Object.keys(extra).map(k=>`${k}=${extra[k]}`).join(`&`)}`:''}`)
        .then(data => {
            return data.data
        })
}

let user;

Promise
    .resolve(confirmed)
    .then(user=>{

        console.log(`погнали`)
        
        tg.requestWriteAccess();

        // document.body.innerHTML = null;

        // document.body.append(ce(`img`,`logo`,tg.colorScheme == `light` ? false : `bright`,false,{
        //     src: `/images/books/logo.png`
        // }))

        let c = ce(`div`,false,`mobile`)
        
            document.body.append(c);
        let data = [];

        data.push(userLoad(`auctions`))        
        data.push(userLoad(`auctionsIterations`))
        data.push(userLoad(`profile`))
        data.push(userLoad(`faqs`))
        data.push(userLoad(`stories`))
        // data.push(userLoad(`storiesSeen`))
        
        Promise.all(data).then(data=>{
            
            user = data[2];

            pageData = new Page({
                auctions:   data[0],
                iterations: data[1],
                profile:    data[2],
                faqs:       data[3],
                stories:    data[4]
            },tg,handleError,host,userLoad,drawDate)
            
            ko.applyBindings(pageData,document.querySelector(`#b`))
        })
        

        if(start) {
            start = start.split(`_`)
            switch(start[0]){
                
            }
        }
    })

    import {
        Page
    } from '/javascripts/auction/classes.js'