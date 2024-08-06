const firebaseConfig = {
    apiKey:             "AIzaSyDPz4F30B7qzxR1ZpGybHuZJeOTVAv4XxE",
    authDomain:         "dimazvalimisc.firebaseapp.com",
    databaseURL:        "https://dimazvalimisc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:          "dimazvalimisc",
    storageBucket:      "dimazvalimisc.appspot.com",
    messagingSenderId:  "1033227630983",
    appId:              "1:1033227630983:web:804a29311cb28a93e93b22"
};

let wallet ="UQAbMidsunh9esQXj1bd7zXNS-lamkN77cdqaF-GEdJ5W9yj";
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

                sub.append(ce(`button`,false,`thin`,`скрыть`,{
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
        this.name =         f.name;
        this.icon =         ko.observable(f.icon || `/images/auction/faq.svg`)
        this.description =  f.description;
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
        this.username = ko.observable(r.username || r.id);
        
    }
}

class Page{
    constructor(d,tg,handleError,host,userLoad,drawDate){
        this.showAlert = (txt) => tg.showAlert(txt);
        
        this.active =           ko.observable(`lobby`);

        this.transactionsOpen = ko.observable(false);
        
        this.showTransactions=()=>{
            this.transactionsOpen(!this.transactionsOpen())
        }

        this.faqs =     ko.observableArray(d.faqs.map(f=>new Faq(f)))
        this.refFaqs =  ko.observableArray(d.faqs.filter(f=>f.ref).map(f=>new Faq(f)))

        this.sactive= (v)=> {
            this.active(v)
            console.log(v)
            if(v == `profile`){
                this.transactions([])
                userLoad(`transactions`).then(transactions=>{
                    transactions.forEach(t => {
                        this.transactions.push({
                            comment:    t.comment || 'обновление',
                            amount:     t.amount,
                            date:       new Date(t.createdAt._seconds*1000).toLocaleDateString()+' / '+time(new Date(t.createdAt._seconds*1000))
                        })    
                    });
                    
                })
            }
        }


        this.transactions =     ko.observableArray([])
        this.auctions =         ko.observableArray(d.auctions.map(a=>new Auction(a)))
        
        this.totalStaked =      ko.observable(d.profile.totalStaked || 0)
        this.stakes =           ko.observable(d.profile.stakes || 0)
        this.total =            ko.observable(d.profile.total || 0)

        this.balance =          ko.observable(d.profile.score)
        this.tonBalance =       ko.observable(d.profile.tonScore || 0)
        this.refs =             ko.observable(d.profile.refs || 0)
        // this.iterations =   ko.observableArray(d.iterations.map(i=>new Iteration(i,tg,this.balance())))
        this.iterations =   ko.observableArray([])
        this.userId =       ko.observable(d.profile.id || null)
        this.username =     ko.observable(d.profile.username)
        this.avatar =       ko.observable(d.profile.photo_url)
        this.hash =         ko.observable(d.profile.hash)
        
        this.refs =         ko.observable(d.profile.refs.map(r=>new Ref(r)))

        this.refTonScore = ko.observable(d.profile.refTonScore || 0)
        this.refTonStakes = ko.observable(d.profile.refTonStakes || 0)

        this.copyRef =()=>{
            navigator.clipboard.writeText(`${botLink}?start=ref_${this.userId()}`).then(s=>{
                try {
                    tg.showAlert(`Ссылка скопирована`)    
                } catch (error) {
                    alert(`ссылка скопирована`)
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
                    tg.showAlert(s.data)
                })
                .catch(err=>{
                    if(err.response.data.invoice){
                        console.log(`УДАЛИТЬ инвойс`)
                        tg.showAlert(err.response.data.comment)
                        tg.openInvoice(err.response.data.invoice)
                    } else {
                        tg.showAlert(err.response.data ? err.response.data.comment : err.message)
                    }
                })
                .finally(i.active(true))
        }

        onValue(ref(db,`auction/users/${d.profile.hash}`),a=>{
            console.log(`обновился юзер`)
            a = a.val();
            if(a){
                console.log(a);

                this.balance(a.score)
                this.tonBalance(a.tonScore || 0)

                this.totalStaked(a.totalStaked || 0)
                this.stakes(a.stakes || 0)
                this.total(a.total || 0)

                this.refTonScore(a.refTonScore || 0)
                this.refTonStakes(a.refTonStakes || 0)
            }
        })

        onChildAdded(
            query(ref(db,`auction/iterations`), orderByChild(`active`),equalTo(true)),
            a=>{
                console.log(a.val())
                let n = new Iteration(a.val(),tg,this.balance(),drawDate)
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

                sub.append(ce(`button`,false,`thin`,`скрыть`,{
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


class Iteration{
    constructor (a,tg,balance,drawDate){
        this.ton =          ko.observable(a.ton || false);
        this.id =           a.id
        this.name =         ko.observable(a.auctionName),
        this.active =       ko.observable(a.active),
        this.base =         ko.observable(a.base),
        this.stake =        ko.observable(a.stake),
        this.stakeHolder =  ko.observable(a.stakeHolder),
        this.stakeHolderId =  ko.observable(a.stakeHolderId),
        this.timer =        ko.observable(a.timer._seconds ? a.timer._seconds*1000 : a.timer)
        this.left =         ko.observable(time2(+new Date(a.timer._seconds ? a.timer._seconds*1000 : a.timer) - new Date()))
        
        this.showHistory = ()=>{
            axios.get(`/auction/api/iterationStakes/${a.id}`).then(col=>{
                let m = ce(`div`,false,[`modal`,(tg.colorScheme=='dark'?`reg`:`light`)])
                m.append(ce(`h2`,false,false,`История`,{
                    onclick:()=>m.remove()
                }))
                let sub = ce(`div`,false, `vScroll`)
                    let t = ce(`table`);
                    sub.append(t);
                    let h = ce(`tr`)
                        t.append(h)
                        h.append(ce(`th`,false,false,`ID`))
                        h.append(ce(`th`,false,false,`Дата`))
                        h.append(ce(`th`,false,false,`Время`))
                        h.append(ce(`th`,false,false,`Ставка`))
                    col.data.forEach(r=>{
                        let row = ce(`tr`)
                            row.append(ce(`td`, false, false, r.you ? `Вы` : r.user));
                            row.append(ce(`td`, false, false, drawDate(r.createdAt._seconds*1000)));
                            row.append(ce(`td`, false, false, time(new Date(r.createdAt._seconds*1000))));
                            row.append(ce(`td`, false, `ton`, a.stake));
                        t.append(row);
                        

                        // sub.append(ce(`p`,false,false,`${drawDate(r.createdAt._seconds*1000,false,{time:true})}`))
                        // sub.append(ce(`p`,false,`info`, r.you? `Вы делаете ставку ${a.base}.` : `Юзер ${r.user} делает ставку ${a.base}.`))
                        // sub.append(ce(`p`,false,`info`,r.you? `Вы лидируете на аукционе` : `Юзер ${r.user} лидирует на аукционе.`))
                    })

                    sub.append(ce(`button`,false,`thin`,`скрыть`,{
                        onclick:()=>m.remove()
                    }))
                    
                m.append(sub)
                document.body.append(m)
            })
        }
        this.ava =          ko.observable(null);

        this.pushStake = (v) =>{
            console.log(balance)
            console.log(+this.base())
            
            if(balance > +this.base()){
                tg.showAlert(`ставлю`)
            } else {
                tg.showAlert(`нет денег`)
            }
        }

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
            
            console.log(`обновилась итерация аукциона ${this.name()}`)
            
            a = a.val();
            
            console.log(a)
            
            if(a){
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
            console.log(`обновился аукцион ${this.name()}`)
            a = a.val();
            if(a){
                this.name(a.name)
                this.active(a.active)
            }
            
        })
    }
    
}

export {
    Page,
    // tonConnectUI
}