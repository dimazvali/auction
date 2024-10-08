const firebaseConfig = {
    apiKey:             "AIzaSyDPz4F30B7qzxR1ZpGybHuZJeOTVAv4XxE",
    authDomain:         "dimazvalimisc.firebaseapp.com",
    databaseURL:        "https://dimazvalimisc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:          "dimazvalimisc",
    storageBucket:      "dimazvalimisc.appspot.com",
    messagingSenderId:  "1033227630983",
    appId:              "1:1033227630983:web:804a29311cb28a93e93b22"
};

const host = `auction`

// let wallet ="UQAbMidsunh9esQXj1bd7zXNS-lamkN77cdqaF-GEdJ5W9yj";
let wallet ="UQDPk82PTUD6Id1h6kI7wUOonLLzy8dy9gg5topazCejF8lS";
let wallet2="0:1b32276cba787d7ac4178f56ddef35cd4be95a9a437bedc76a685f8611d2795b"

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    onChildAdded,
    query,
    orderByChild,
    onChildChanged,
    equalTo,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    locals
} from "/javascripts/auction/locals.js";

function shimmer(tg,light){
    if(light) return tg.HapticFeedback.impactOccurred('light')
    tg.HapticFeedback.notificationOccurred('success')
}

let app = initializeApp(firebaseConfig);
let db = getDatabase(app)





function helper(type){
    let c = ce(`div`,false,`containerHelp`,`?`,{
        onclick:()=>{
            let m = ce(`div`,false,[`modal`,(tg.colorScheme=='dark'?`reg`:`light`)])
                m.append(ce(`h2`,false,false,helperTexts[type].title,{
                    onclick:()=>m.remove()
                }))
            let sub = ce(`div`,false, `vScroll`)
                helperTexts[type].text.forEach(p=>{
                    sub.append(ce(`p`,false,`info`,p))
                })

                sub.append(ce(`button`,false,`thin`,locals.termsAndButtons.hide[lang],{
                    onclick:()=>m.remove()
                }))
                
            m.append(sub)
            document.body.append(m)
        }
    });
    
    return c;
}


// const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
//     manifestUrl: 'https://e688-2a0b-6204-2fef-ea00-b9ef-2e62-626c-81c7.ngrok-free.app/tonconnect-manifest.json',
//     buttonRootId: 'ton-connect'
// });

// tonConnectUI.uiOptions = {
//     twaReturnUrl: 'https://e688-2a0b-6204-2fef-ea00-b9ef-2e62-626c-81c7.ngrok-free.app/auction/app'
// };


window.addEventListener('ton-connect-ui-connection-completed', (event) => {
    console.log('connected', event.detail);
});


class Faq{
    constructor(f){
        this.id =          f.id;
        this.name =         f.name;
        this.icon =         ko.observable(f.icon || `/images/${host}/faq.svg`)
        this.description =  ko.observable(f.description);
        this.timing =       f.timing || 1;
        this.ref =          f.ref || false;
        this.closed =       ko.observable(true)
        this.toggle = () => {
            console.log(!this.closed())
            this.closed(!this.closed())
        }
    }
}

class Ref{
    constructor(r){
        this.username =         ko.observable(r.username || r.id);
        this.totalStakesTon =   ko.observable(r.totalStakesTon || 0);
        this.score =            ko.observable(r.score);
    }
}


class Request{
    constructor(r){
        this.amount=     ko.observable(r.amount),
        this.date=       ko.observable(drawDate(r.createdAt._seconds*1000,lang,{time:true}))
    }
}

class Story{
    constructor(s){
        this.name =         s.name;
        this.description =  s.description;
        this.pic =          s.pic;
        this.shown =        ko.observable(s.shown || null);
        this.showMe = () =>{
            
            console.log(`показываем сторис ${s.id}`);

            showStory([s]);

            
            this.shown(true);
        }
    }
}


function showStory(arr){
    if(document.querySelector(`#popup`)) document.querySelector(`#popup`).remove();
    
    let popup = ce('div', false, 'popup')
            
    document.body.append(popup)
    let p = ce('div',false,`story`)
    
    popup.append(p)

    let i = 0;

    let s = arr[0]

    p.append(ce(`h3`,false,false,s.name));
    p.append(ce(`p`,false,false,s.description));
    
    let sc = ce(`div`,false,`storyCover`)

    sc.append(ce(`img`,false,false,false,{
        src: s.pic
    }));

    p.append(sc)
    
    axios.post(`/${host}/api/storiesViews/${s.id}`)

    if(i<arr.length-1){
        p.append(ce(`button`,false,`closeStory`,locals.termsAndButtons.next[lang],{
            onclick:()=>{
                arr.splice(0,1)
                showStory(arr)
            }
        }))
    } else {
        p.append(ce(`button`,false,[`stakeButton`,`closeStory`],locals.termsAndButtons.close[lang],{
            onclick:()=>{
                popup.remove()
            }
        }))
    }
    

}

function back2Lobby(){
    this.sactive(`lobby`)
    tg.BackButton.hide();
    tg.BackButton.offClick(back2Lobby)
}
class Page{
    constructor(d, tg, handleError,host,userLoad,drawDate){
        
        this.share = () => {
            tg.switchInlineQuery(`me`,[`users`])
        }

        this.theme = ko.observable(tg.colorScheme);

        this.lang = (lang) => {
            axios.put(`/${host}/api/lang`,{
                lang: lang
            }).then(()=>{
                window.location.search = `?lang=${lang}`
            })
        }

        this.stories = ko.observableArray(d.stories.map(s=>new Story(s)))

        if(d.stories.filter(s=>!s.shown).length) showStory(d.stories.filter(s=>!s.shown))
        
        this.tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://stars-auction-bot-0823eb8d3f85.herokuapp.com/tonconnect-manifest.json',
            buttonRootId: 'ton-connect'
        });
        
        this.tonConnectUI.uiOptions = {
            twaReturnUrl: 'https://t.me/starsAuctionBot/app'
        };

        this.refill = ko.observable(0.5);
        this.setRefill = (v) => this.refill(v);

        this.showRefFaq = () => {

            if(this.faqs().filter(f=>f.id == `zcBzZ5t1qjtijS4UZX7N`)[0]){
                this.faqs().filter(f=>f.id == `zcBzZ5t1qjtijS4UZX7N`)[0].closed(false)
            } else {
                this.faqs().filter(f=>f.id == `iP58dAInZpU6PY3npHBs`)[0].closed(false)
            }
            
        }

        this.sendMoney = async () => {
            const transaction = {
                messages: [
                    {
                        payload: d.profile.tonPayload,
                        address: wallet, // destination address
                        amount: this.refill()*1_000_000_000 //Toncoin in nanotons
                    }
                ]
            }
            try {
                const result = await this.tonConnectUI.sendTransaction(transaction)
            } catch(err){
                tg.showAlert(err.message)
            }
            
        }


        tg.onEvent(`themeChanged`,()=>{
            this.theme(tg.colorScheme)
        })

        this.showAlert = (txt) => tg.showAlert(txt);
        
        this.active =           ko.observable(`lobby`);
        this.swalletActive = (t) => {
            
            this.walletActive(t)

            if(t == `transactions`) this.transactionsRefresh();
            
            if(t == `out`) {
                userLoad(`requests`).then(reqs=>{    
                    this.requests(reqs.map(r=>new Request(r)))
                })
                console.log(this.requests())
            };
        }

        this.requests = ko.observableArray([]);
        
        this.walletActive = ko.observable('deposit')

        this.transactionsOpen = ko.observable(false);
        
        this.showTransactions=()=>{
            console.log(1)
            this.transactionsOpen(!this.transactionsOpen())
        }

        this.faqs =     ko.observableArray(d.faqs.map(f=>new Faq(f)))
        this.refFaqs =  ko.observableArray(d.faqs.filter(f=>f.ref).map(f=>new Faq(f)))

        this.transactionsRefresh = () =>{
            this.transactions([])
                userLoad(`transactions`).then(transactions=>{
                    transactions.forEach((t,i) => {
                        setTimeout(()=>{
                            this.transactions.push({
                                comment:    locals.transactionTypes[t.comment] ? locals.transactionTypes[t.comment][lang] : t.comment || 'update',
                                amount:     t.amount,
                                date:       new Date(t.createdAt._seconds*1000).toLocaleDateString()+' / '+time(new Date(t.createdAt._seconds*1000))
                            })
                        },i*100)
                            
                    });
                    
                })
        }

        this.sactive= (v)=> {
            
            this.active(v)
            
            shimmer(tg,true);

            switch(v){
                case `profile`:{
                    this.transactions([])
                    userLoad(`transactions`).then(transactions=>{
                        transactions.forEach(t => {
                            this.transactions.push({
                                // comment:    t.comment || 'обновление',
                                comment:    locals.transactionTypes[t.comment] ? locals.transactionTypes[t.comment][lang] : t.comment || 'update',
                                amount:     t.amount,
                                date:       new Date(t.createdAt._seconds*1000).toLocaleDateString()+' / '+time(new Date(t.createdAt._seconds*1000))
                            })    
                        });
                        
                    })
                    break;
                }
                case `before`:{
                    tg.BackButton.show();
                    tg.onEvent('backButtonClicked', ()=>{
                        this.sactive(`lobby`)
                        tg.BackButton.hide();
                        tg.BackButton.offClick(this)
                    })
                }
                case `faq`:{
                    tg.BackButton.show();
                    tg.onEvent('backButtonClicked', ()=>{
                        console.log(this.faqs())
                        if(this.faqs().filter(f=>!f.closed()).length){
                            this.faqs().forEach(f=>f.closed(true))
                        } else {
                            this.sactive(`lobby`)
                            tg.BackButton.hide();
                            tg.BackButton.offClick(this)    
                        }
                    })
                }
            }
        }

        this.archive = ko.observableArray([])

        this.showPrevousIterations = () =>{
            this.archive([])
            this.sactive(`before`)
            userLoad(`before`)
                .then(data=>this.archive(data.map(i=>new IterationArchive(i,d.profile.id,this.share))))
        }

        this.userwallet = ko.observable(d.profile.wallet || null)
        this.usermemo = ko.observable(d.profile.memo || null)

        this.transactions =     ko.observableArray([])
        this.auctions =         ko.observableArray(d.auctions.map(a=>new Auction(a)))
        
        this.totalStakedTon =      ko.observable(d.profile.totalStakedTon || 0)
        this.totalStakesTon =           ko.observable(d.profile.totalStakesTon || 0)
        this.total =            ko.observable(d.profile.total || 0)
        this.totalScoreTon =    ko.observable(0);
        this.balance =          ko.observable(d.profile.score)
        this.curScoreTon =       ko.observable(d.profile.curScoreTon || 0)

        this.totalRefScoreTon = ko.observable(d.profile.totalRefScoreTon || 0)
        this.curRefScoreTon = ko.observable(d.profile.curRefScoreTon || 0)
        this.totalRefStakesTon = ko.observable(d.profile.totalRefStakesTon || 0)

        
        this.iterations =   ko.observableArray([])
        this.userId =       ko.observable(d.profile.id || null)
        this.username =     ko.observable(d.profile.username)
        this.avatar =       ko.observable(d.profile.photo_url)
        this.hash =         ko.observable(d.profile.hash)
        
        this.refs =         ko.observable(d.profile.refs.map(r=>new Ref(r)))
        

        this.copy = (txt) => {
            navigator.clipboard.writeText(txt).then(s=>{
                try {
                    tg.showAlert(locals.updates.copied[lang])
                } catch (error) {
                    alert(error.message)
                }
                
            }).catch(err=>{
                console.warn(err)
            })
        }

        this.copyRef = () =>{
            navigator.clipboard.writeText(`${botLink}?start=ref_${this.userId()}`).then(s=>{
                try {
                    tg.showAlert(locals.updates.copied[lang])
                } catch (error) {
                    alert(error.message)
                }
                
            }).catch(err=>{
                console.warn(err)
            })
        }
        this.requestPaymentTon = (amount) =>{
            
            tg.BackButton.show();

            tg.onEvent('backButtonClicked', clearPopUp)

            tg.HapticFeedback.notificationOccurred('success')

    

            // mcb = clearPopUp
            
            let popup = ce('div', false, 'popup')
            

            document.body.append(popup)
            let p = ce('div')
            
            popup.append(p)

            p.append(ce(`h1`,false,false,`Пополнение TON`))
            // p.append(ce(`p`,false,`info`,`тут, наверное, какой-то текст про правила и всю хурму`))
            
            p.append(ce(`p`,false,`info`, `Вы можете перевести любое количество TON на кошелек <pre>${wallet}</pre>ОБЯЗАТЕЛЬНО УКАЖИТЕ ПРИМЕЧАНИЕ <pre>${this.hash()}</pre>`))
            
            p.append(ce(`button`,false,`thin`,`Скопировать адрес кошелька`,{
                onclick:function(){
                    navigator.clipboard.writeText(`${wallet}`).then(s=>{
                        try {
                            tg.showAlert(`Ссылка скопирована`)    
                        } catch (error) {
                            alert(`ссылка скопирована`)
                        }
                        
                    }).catch(err=>{
                        console.warn(err)
                    })
                } 
            }))
            
            let amountInput = ce(`input`,false,false,false,{
                placeholder: `сколько вы хотите внести`,
                value: amount,
                type: `number`,
                min: 0,
                step: 1
            })

            p.append(amountInput)
            
            let wallets = [{
                name: `Ton Wallet`,
                link:(v)=>`ton://transfer/${wallet}?amount=${+v*1000000000}&text=${this.hash()}`
            },{
                name: `Tonkeeper`,
                link:(v)=>`https://app.tonkeeper.com/transfer/${wallet}?amount=${+v*1000000000}&text=${this.hash()}`
            },{
                name: `Tonhub`,
                link:(v)=>`https://tonhub.com/transfer/${wallet}?amount=${+v*1000000000}&text=${this.hash()}`
            }]
            
            wallets.forEach(w=>{
                p.append(ce(`button`,false,false,w.name,{
                    onclick:()=>tg.openLink(w.link(+amountInput.value))
                }))
            })
        }
        this.requestWithDraw = (type) => {
            axios.post(`/${host}/api/withdraw`,{
                type: type
            }).then(()=>{
                tg.showAlert(`Ok!.`)
            }).catch(handleError)
        }
        
        this.toWithDraw = ko.observable(null)
        
        this.withdrawalInProcess = ko.observable(false)

        this.requestWithDrawTon = (type) => {
            
            if(!this.userwallet())                      return tg.showAlert(locals.errors.yourWallerData[lang]);
            if(!this.toWithDraw())                      return tg.showAlert(locals.errors.amountMissing[lang]);
            if(this.toWithDraw() > this.curScoreTon())  return tg.showAlert(locals.errors.notEnoughBalance[lang]);

            this.withdrawalInProcess(true);

            axios.post(`/${host}/api/withdraw`,{
                type:   `score`,
                amount: this.toWithDraw(),
                wallet: this.userwallet(),
                memo:   this.usermemo()
            }).then(()=>{
                tg.showAlert(`Ok!`)
            }).catch(handleError)
            .finally(this.withdrawalInProcess(false))
        }

        

        this.requestPayment = (amount) =>{
            axios.post(`/${host}/api/refill`,{
                amount: +amount
            }).then(s=>{
                
                tg.openInvoice(s.data.invoice);

            }).catch(handleError)
        }
        this.stake = (i) => {
            i.active(false)
            axios
                .post(`/${host}/api/stake/${i.id}`)
                .then(s=>{
                    shimmer(tg);
                    // tg.showAlert(s.data)
                })
                .catch(err=>{
                    if(err.response.data.invoice){
                        tg.showAlert(err.response.data.comment)
                        tg.openInvoice(err.response.data.invoice)
                    } else {
                        tg.showAlert(err.response.data ? err.response.data.comment : err.message)
                    }
                })
                .finally(i.active(true))
        }

        onValue(ref(db,`auction/users/${d.profile.hash}`),a=>{
            a = a.val();
            if(a){
                console.log(a);

                this.totalStakedTon(a.totalStakedTon || 0)
                this.totalStakesTon(a.totalStakesTon || 0)
                this.total(a.total || 0)
                this.totalScoreTon(a.totalScoreTon || 0)
                this.curScoreTon(a.curScoreTon || 0)
                this.curRefScoreTon(a.curRefScoreTon || 0)
                this.totalRefScoreTon(a.totalRefScoreTon || 0)
                this.totalRefStakesTon(a.totalRefStakesTon || 0)
            }
        })

        onChildAdded(
            query(ref(db,`auction/iterations`), orderByChild(`active`),equalTo(true)),
            a=>{
                console.log(a.val())
                let n = new Iteration(a.val(),tg,this.balance(),drawDate,this.hash())
                if(this.iterations.indexOf(n)==-1){
                    this.iterations.push(n)
                }
            }
        )

        // console.log(tonConnectUI)

        // if(tonConnectUI.wallet){
        //     document.querySelector(`#sendMe`).append(ce(`button`,false,false,`1 ton`,{
        //         onclick:()=>{
        //             let transaction = {
        //                 validUntil: Math.floor(Date.now() / 1000) + 60, 
        //                 messages: [
        //                     {
        //                         payload: d.profile.tonPayload,
        //                         address: wallet, // destination address
        //                         // address: '0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F',
        //                         amount: "1000000000" //Toncoin in nanotons
        //                     }
        //                 ]
        //             }
        
        //             tonConnectUI.sendTransaction(transaction)
        //         }
        //     }))
        // }
        // tonConnectUI.onModalStateChange(s=>{
        //     if(s.closeReason == "wallet-selected") {
        //         console.log(d.profile.tonPayload)
        //         document.querySelector(`#sendMe`).append(ce(`button`,false,false,`1 ton`,{
        //             onclick:()=>{
        //                 let transaction = {
        //                     validUntil: Math.floor(Date.now() / 1000) + 60, 
        //                     messages: [
        //                         {
        //                             payload: d.profile.tonPayload,
        //                             address: wallet, // destination address
        //                             // address: '0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F',
        //                             amount: "1000000000" //Toncoin in nanotons
        //                         }
        //                     ]
        //                 }
            
        //                 tonConnectUI.sendTransaction(transaction)
        //             }
        //         }))
        //     }
        // })
    
        // tonConnectUI.onStatusChange(c=>{
        //     console.log(c)
        //     if(c){
        //         console.log(d.profile.tonPayload)
        //         document.querySelector(`#sendMe`).append(ce(`button`,false,false,`1 ton`,{
        //             onclick:()=>{
        //                 let transaction = {
        //                     validUntil: Math.floor(Date.now() / 1000) + 60, 
        //                     messages: [
        //                         {
        //                             payload: d.profile.tonPayload,
        //                             address: wallet, // destination address
        //                             // address: '0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F',
        //                             amount: "1000000000" //Toncoin in nanotons
        //                         }
        //                     ]
        //                 }
            
        //                 tonConnectUI.sendTransaction(transaction)
        //             }
        //         }))
        //     }
        // })

        async function connectToWallet() {
            const connectedWallet = await tonConnectUI.connectWallet();
            // Do something with connectedWallet if needed
            console.log(connectedWallet);
        }

        // connectToWallet().catch(error => {
        //     console.error("Error connecting to wallet:", error);
        // });

        
    }
}

function requestPayment(amount){
    axios.post(`/${host}/refill`,{
        amount: +amount
    }).then(s=>{
        tg.openInvoice(s.data.invoice)
    }).catch(handleError)
}

function z(v){
    if(v<10) return '0'+v
    return v
}

function time2(v){
    let h = Math.floor(v / (60*60*1000))
    let hs = h*60*60*1000
    let m = Math.floor((v-hs) / (60*1000))
    let ms = m*60*1000
    let s = Math.floor((v-hs-ms) / 1000)
    return `${h?`${h}:`:''}${z(m)}:${z(s)}`
}


function history(log){
    let c = ce(`div`,false,`containerHelp`,`?`,{
        onclick:()=>{
            let m = ce(`div`,false,[`modal`,(tg.colorScheme=='dark'?`reg`:`light`)])
                m.append(ce(`h2`,false,false,helperTexts[type].title,{
                    onclick:()=>m.remove()
                }))
            let sub = ce(`div`,false, `vScroll`)
                log.forEach(r=>{
                    sub.append(ce(`p`,false,`info`,{}))
                })

                sub.append(ce(`button`,false,`thin`,locals.termsAndButtons.hide[lang],{
                    onclick:()=>m.remove()
                }))
                
            m.append(sub)
            document.body.append(m)
        }
    });
    
    return c;
}

function time(date){
    return date.getHours()+':'+z(date.getMinutes())+':'+z(date.getSeconds())
}

function showIterationHistory(id,base){
    
        axios.get(`/${host}/api/iterationStakes/${id}`).then(col=>{
            let m = ce(`div`,false,[`modal`,`reg`])
            m.append(ce(`h2`,false,false,locals.headers.history[lang],{
                onclick:()=>m.remove()
            }))
            let sub = ce(`div`,false, `vScroll`)
                let t = ce(`table`);
                sub.append(t);
                let h = ce(`tr`)
                    t.append(h)
                    h.append(ce(`th`,false,false,`ID`))
                    h.append(ce(`th`,false,false,locals.headers.date[lang]))
                    h.append(ce(`th`,false,false,locals.headers.time[lang]))
                    h.append(ce(`th`,false,false,locals.headers.stake[lang]))
                col.data.forEach(r=>{
                    let row = ce(`tr`)
                        row.append(ce(`td`, false, false, r.you ? locals.you[lang] : r.user));
                        row.append(ce(`td`, false, false, drawDate(r.createdAt._seconds*1000,lang)));
                        row.append(ce(`td`, false, false, time(new Date(r.createdAt._seconds*1000))));
                        row.append(ce(`td`, false, `ton`, base));
                    t.append(row);
                })

                sub.append(ce(`button`,false,`thin`,locals.termsAndButtons.hide[lang],{
                    onclick:()=>m.remove()
                }))
                
            m.append(sub)
            document.body.append(m)
        })

}

class IterationArchive{
    constructor(i,userId,share){
        this.date =             new Date(i.createdAt._seconds*1000).toLocaleDateString()
        this.id =               i.id;
        this.stakeHolderId =    ko.observable(i.stakeHolderId);
        this.stakeHolder =      ko.observable(i.stakeHolder);
        this.stake =            ko.observable(i.stake);
        this.base =             ko.observable(i.base);
        this.time =             time2(+new Date(i.timer._seconds*1000)-new Date(i.createdAt._seconds*1000));
        this.showHistory = ()=>{
            showIterationHistory(i.id,i.base)
        }
        this.showShare = function(){
            let c = ce(`div`,false,[`box2`,`big`,`float`,`vector`],false,{
                onclick:()=>c.remove()
            })
                let h = ce(`div`,false,[`flexSpread`,`borderBottom`])
                    h.append(ce(`span`,false,`info`,locals.headers.date[lang]))
                    h.append(ce(`span`,false,`info`,this.date))
                c.append(h);
                let details = ce(`div`,false,`flexSpread`)
                
                let id = ce(`div`)
                    id.append(ce(`p`,false,`info`,`ID`))
                    id.append(ce(`p`,false,`topLess`,this.id.slice(0,6)))
                details.append(id)

                let t = ce(`div`)
                    t.append(ce(`p`,false,`info`,locals.headers.length[lang]))
                    t.append(ce(`p`,false,'topLess',time2(+new Date(i.timer._seconds*1000)-new Date(i.createdAt._seconds*1000))))
                details.append(t)

                let w = ce(`div`)
                    w.append(ce(`p`,false,[`info`,`winner`],locals.headers.winner[lang]))
                    w.append(ce(`p`,false,'topLess',i.stakeHolderId || '—'))
                details.append(w)
            c.append(details)

            c.append(ce(`div`,false,[`xl`,`ton`],i.base.toFixed(2)))
            c.append(ce(`span`,false,`info`,locals.headers.earnedSum[lang]))
            let f = ce(`div`,false,`flexSpread`)
                let l = ce(`div`)
                    l.append(ce(`p`,false,`t`,locals.headers.refLink[lang]))
                    l.append(ce(`span`,false,`info`,locals.termsAndButtons.shareLink[lang]))
                f.append(l)
                let r = ce(`img`,false,[`block`,`qr`],false,{
                    src: `/${host}/qr?user=${userId}`,
                    onclick:()=>share()
                })
                f.append(r)
            c.append(f);    

            c.append(ce(`button`,false,false,`share`,{onclick:()=>share()}))

            document.body.append(c)
        }
    }
}

class Iteration{
    constructor (a,tg,balance,drawDate,hash){
        this.userActive =       ko.observable(false);
        this.ton =              ko.observable(a.ton || false);
        this.id =               a.id
        this.name =             ko.observable(a.auctionName),
        this.active =           ko.observable(a.active),
        this.base =             ko.observable(a.base),
        this.stake =            ko.observable(a.stake),
        this.stakeHolder =      ko.observable(a.stakeHolder),
        this.stakeHolderId =    ko.observable(a.stakeHolderId),
        this.timer =            ko.observable(a.timer._seconds ? a.timer._seconds*1000 : a.timer)
        this.left =             ko.observable(time2(+new Date(a.timer._seconds ? a.timer._seconds*1000 : a.timer) - new Date()))
        
        this.showHistory = ()=>{
            showIterationHistory(a.id,a.base)
        }

        this.ava =          ko.observable(null);


        this.setAva = (pic) => {
            this.ava(pic)
            // setTimeout(()=>{
            //     this.ava(null)
            // },1000)
        }

        setInterval(()=>{
            this.left(time2(+new Date(this.timer()) - new Date()))
        },1000)  

        onValue(ref(db,`auction/iterations/${a.id}`),a=>{
            a = a.val();
            if(a){
                if(a.users && a.users[hash]) this.userActive(true)
                this.name(a.auctionName)
                this.active(a.active || false)
                this.base(a.base)
                this.stake(a.stake)
                this.stakeHolder(a.stakeHolder)
                this.stakeHolderId(a.stakeHolderId||null)
                this.setAva(a.stakeHolderAva || null)
                this.timer(a.timer)
            }
            
            
        })
    }
}
class Auction{
    constructor (a){

        this.id =       a.id
        this.name =     ko.observable(a.name),
        this.active =   ko.observable(a.active),
        this.base =     ko.observable(a.base)
        
        onValue(ref(db,`auction/auction/${a.id}`),a=>{
            a = a.val();
            if(a){
                this.name(a.name)
                this.active(a.active)
            }
        })
    }
    
}

document.ontouchmove = function(event){
    event.preventDefault();
}


export {
    Page,
    // tonConnectUI
}

