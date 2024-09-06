const ngrok2 = process.env.ngrok2;
const ngrok = process.env.ngrok;
const host = `auction`
const token = process.env.auctionToken;
const defaultIterationLength = 30;
const casinoRevenue =   .15;
const refRevenue =      .1;
const withdrawMin =     0.5;
const languages = [`en`,`ru`];
var QRCode =    require('qrcode')

const topMonthRef = 78;
// топовый доход по рефералке в месяц. используется в инлайн-инвайтах

const curScoreTon =         `текущий баланс в тон`
// tonScore

const totalScoreTon =       `всего получили в ton`
// totalTonScore

const totalStakedTon =      `сумма ставок в ton`
// totalStaked

const totalStakesTon =      `всего ставок в ton`
// stakes

const curRefScoreTon =     `текущий баланс по рефералке`
// refTonScore

const totalRefScoreTon =   `всего доход по рефералке`
// refTonScoreTotal

const totalRefStakesTon =   `всего ставок у рефералов в TON`
// refTonStakes


const requestsStatuses = {
    cancelledByConsequent: `Отменен последовавшим запросом.`
}

var beginCell = require('ton').beginCell;

// import { beginCell } from '@ton/ton'


function tonPayload(v){
    return beginCell()
    .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
    .storeStringTail(v) // write our text comment
    .endCell()
    .toBoc()
    .toString("base64");
}

var express =   require('express');
var router =    express.Router();
var axios =     require('axios');

const fileUpload = require('express-fileupload');

var cors = require('cors')
var fs = require('fs');

let botLink = `https://t.me/starsAuctionBot`

// import { HttpApi, fromNano, toNano } from "ton";




const {
    dimazvali,
    getDoc,
    uname,
    drawDate,
    devlog,
    letterize,
    letterize2,
    shuffle,
    handleQuery,
    handleDoc,
    handleError,
    cur,
    sudden,
    authTG,
    ifBefore,
    authWebApp,
    alertMe,
    consistencyCheck,
    sanitize,
} = require('./common.js')


const {
    sendMessage2,
    getUser,
    greeting
} = require('./methods.js');

var cron = require('node-cron');

router.use(cors())

router.use(fileUpload({
    // Configure file uploads with maximum file size 10MB
    limits: {
        fileSize: 10 * 1024 * 1024
    },

    // Temporarily store uploaded files to disk, rather than buffering in memory
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

const {
    initializeApp,
    applicationDefault,
    cert
} = require('firebase-admin/app');

const {
    getFirestore,
    Timestamp,
    FieldValue
} = require('firebase-admin/firestore');

const {
    getDatabase,
    increment
} = require('firebase-admin/database');

const {
    getStorage,
    getDownloadURL
} = require('firebase-admin/storage');

var FormData = require('form-data');

const {
    ObjectStreamToJSON
} = require('sitemap');
const { database } = require('firebase-admin');

const locals = require('./locals.js');

// const locals = require('../public/javascripts/auction/locals.js').default



// let gcp = initializeApp({
//     credential: cert({
//         "type": "service_account",
//         "project_id": "starsauctionbot",
//         "private_key_id": "d4d9ca3d5d7d97b4e02670f6c5d5adb2d7eecab6",
//         "private_key": process.env.auctionGCPKey.replace(/\\n/g, '\n'),
//         "client_email": "firebase-adminsdk-3qg1r@starsauctionbot.iam.gserviceaccount.com",
//         "client_id": "105257691854835814162",
//         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//         "token_uri": "https://oauth2.googleapis.com/token",
//         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//         "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3qg1r%40starsauctionbot.iam.gserviceaccount.com",
//         "universe_domain": "googleapis.com"
//       }
//       ),
//     databaseURL: "https://starsauctionbot-default-rtdb.europe-west1.firebasedatabase.app"
// }, host);


let gcp = initializeApp({
    credential: cert({
        "type":             "service_account",
        "project_id":       "dimazvalimisc",
        "private_key_id":   "5eb5025afc0fe53b63f518ba071f89e7b7ce03af",
        "private_key":      process.env.sssGCPKey.replace(/\\n/g, '\n'),
        "client_email":     "firebase-adminsdk-4iwd4@dimazvalimisc.iam.gserviceaccount.com",
        "client_id":        "110523994931477712119",
        "auth_uri":         "https://accounts.google.com/o/oauth2/auth",
        "token_uri":        "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4iwd4%40dimazvalimisc.iam.gserviceaccount.com"
      }),
    databaseURL: "https://dimazvalimisc-default-rtdb.europe-west1.firebasedatabase.app"
}, host);



let fb =    getFirestore(gcp);
let s =     getStorage(gcp)
let rtb =   getDatabase(gcp)


setTimeout(function () {
    axios.get(`https://api.telegram.org/bot${token}/setWebHook?url=${ngrok}/${host}/hook`).then(() => {
        console.log(`${host} hook set on ${ngrok}`)
    }).catch(err => {
        handleError(err)
    })
}, 1000)



if(!process.env.develop){
    setInterval(() => {
        checkIncoming()
    }, 3000);   
}

let processedPayments = {};


function checkIncoming(){
    axios.get(`https://toncenter.com/api/v2/getTransactions?address=${process.env.OWNER_WALLET}&limit=100&api_key=${process.env.TONCENTER_TOKEN_PROD}`)
        .then(data=>{
            data.data.result.filter(p=>p.in_msg && p.in_msg.body_hash && p.in_msg.message && !processedPayments[p.transaction_id.hash]).forEach(p=>{
                getDoc(tonPayments,p.transaction_id.hash.replace(/\//g,'')).then(payment=>{
                    if(!payment){
                        ifBefore(udb,{
                            hash: p.in_msg.message
                        }).then(u=>{
                            if(u[0]){
                                score(u[0],p.in_msg/1000000000,false, userLang(locals.updates.income,u[0].language_code),true)
                            } else {
                                alertAdmins({
                                    text: `Пришел непонятный платеж ${p.in_msg.message}`
                                })
                            }

                            processedPayments[p.transaction_id.hash] = true;

                        }).catch(err=>{
                            alertMe({
                                text: err.message
                            })
                        })

                        tonPayments.doc(p.transaction_id.hash.replace(/\//g,'')).set({parsed:true})
                    } else {
                        processedPayments[p.transaction_id.hash] = true;
                    }
                })
            })
        })
        .catch(err=>{
            // alertAdmins({
            //     text: `Ошибка обновления переводов: ${err.message}`
            // })
        })
}


let adminTokens =               fb.collection(`${host}AdminTokens`);
let udb =                       fb.collection(`${host}Users`);
let auctions =                  fb.collection(`${host}Auctions`);
let auctionsIterations =        fb.collection(`${host}AuctionsIterations`);
let auctionsIterationsUsers =   fb.collection(`${host}AuctionsIterationsUsers`);
let auctionsBets =              fb.collection(`${host}AuctionsBets`);
let messages =                  fb.collection(`${host}UsersMessages`);
let logs =                      fb.collection(`${host}Logs`);
let transactions =              fb.collection(`${host}Transactions`);
let hashes =                    fb.collection(`${host}UsersHashes`);
let invoices =                  fb.collection(`${host}Invoices`);
let tonPayments =               fb.collection(`${host}tonPayments`);
let refStakes =                 fb.collection(`${host}refStakes`)
let faqs =                      fb.collection(`${host}Faqs`);
let requests =                  fb.collection(`${host}Requests`);
let stories =                   fb.collection(`${host}Stories`);
let storiesViews =              fb.collection(`${host}StoriesViews`);

let iterations = {}

if(!process.env.develop) ifBefore(auctionsIterations).then(col=>{
    col.forEach(i=>{
        if(i.timer._seconds*1000 < new Date()) {
            stopIteration(i)
        } else {
            iterations[i] = setTimeout(()=>{
                getDoc(auctionsIterations,i.id).then(iteration=>{
                    stopIteration(iteration)
                })
            },i.timer._seconds*1000 - +new Date())
        }
    })
    
})

// sendMessage2({
//     chat_id: dimazvali,
//     text: `random tr`,
//     reply_markup:{
//         inline_keyboard:[[{
//             text: `1 nanoton2`,
//             url: `ton://transfer/${process.env.OWNER_WALLET}/?text=randomText&amount=1`
//         }]]
//     }
// },false, token)


const datatypes = {
    requests:{
        col:        requests
    },
    stories:{
        col:        stories,
        newDoc:     storiesAdd,
        callback:()=>{
            console.log(`удаление stories`)
        }
    },
    faqs:{
        col:        faqs,
        newDoc:     faqAdd,
        extras:     [`nameEn` , `descriptionEn`],
        callback:   ()=>{
            console.log(`удаление faq`)
        }
    },
    transactions:{
        col:    transactions,
        newDoc: transactionsAdd,
        callback:   ()=>{
            console.log(`удаление transactions`)
        }
    },
    auctions:{
        newDoc: auctionsAdd,
        col:    auctions,
        callback:   ()=>{
            console.log(`удаление auctions`)
        }
    },
    auctionsBets:{
        newDoc: auctionsBetsAdd,
        col:    auctionsBets,
        callback:   ()=>{
            console.log(`удаление auctionsBets`)
        }
    },
    auctionsIterations:{
        newDoc:     auctionsIterationsAdd,
        col:        auctionsIterations,
        callback:   stopIteration
    },
    messages:{
        newDoc: sendMessage,
        col:    messages,
        callback:   ()=>{
            console.log(`удаление messages`)
        }
    },
    users:{
        col: udb
    }
}

function userLang(txt,lang){
    if(!lang) lang = `ru`;
    if(txt[lang]) return txt[lang]
    
    alertMe({
        text: `Нет перевода ${lang} для ${txt.ru || txt}`
    })
    
    return txt.ru || txt
}

function accessError(res,access){
    
    alertAdmins({
        text: `Кто-то без полномочий пытается воспользоваться методом ${access}.`
    })
    
    res.status(401).send(`Who are you?..`)
}


function stopIteration(iteration,user){

    auctionsIterations.doc(iteration.id).update({
        active: false
    })

    rtb.ref(`/${host}/iterations/${iteration.id}`).update({
        active:         false
    })

    getDoc(auctions,iteration.auction).then(a=>{
        if(a.active) auctionsIterationsAdd({body:{
            auction:    a.id,
            ton:        a.ton || false,
            till:       +new Date()+defaultIterationLength*60*1000
        }},false,false)
    })
    
    if(iteration.stakeHolder){
        
        ifBefore(udb,{hash:iteration.stakeHolder}).then(winners=>{
            
            sendMessage2({
                chat_id:    winners[0].id,
                text:       userLang(locals.users.congrats(iteration),winners[0].language_code)
            },false,token,messages)
            
            score(winners[0], iteration.stake, iteration, userLang(locals.termsAndButtons.win,winners[0].language_code))

            if(iteration.ton){
                userIncrement(winners[0],`totalScoreTon`, iteration.stake)            
            } else {
                userIncrement(winners[0],`totalScore`,delta)
            }
            
            ifBefore(auctionsBets,{auctionsIteration: iteration.id}).then(bets=>{
            
                let users = [... new Set(bets.map(b=>b.user))].filter(u=>+u != +winners[0].id)
                
                devlog(users);
    
                users.forEach(u=>{
                    sendMessage2({
                        chat_id:    u,
                        text:       userLang(locals.users.iterationOver(iteration),u.language_code)
                    },false,token)
                })
            })

        })

        
    }

    
}

function mask(id){
    id = id.toString();
    return `***${id.slice(id.length-4,id.length)}`
}

router.get('/qr', async (req, res) => {
    if (req.query.user) {
        QRCode.toFile(__dirname + `/../public/images/auction/qr/invite_${req.query.user}.png`, `${botLink}?start=ref_${req.query.user}`, {
            color: {
                dark: req.query.dark || '#0E1728',
                light: req.query.light || '#ffffff',
            },
            maskPattern: req.query.m || 0,
            type: 'png',
        }).then(s => {
            res.sendFile(`invite_${req.query.user}` + '.png', {
                root: './public/images/auction/qr/'
            })
        }).catch(err => {
            console.log(err)
            res.sendStatus(500)
        })
    } else {
        res.status(500).send(`no place provided`)
    }
})

function userIncrement(user, field, val){

    devlog(`обновляем юзера ${user.id}: ${field}: ${val}`)

    if(!val) val = 1;
    
    udb.doc(user.id.toString()).update({
        [field]: FieldValue.increment(val)
    })

    rtb.ref(`${host}/users/${user.hash}`).update({
        [field]:  database.ServerValue.increment(val)
    })
}

router.all(`/api/:method/:id`,(req,res)=>{

    let token = req.signedCookies.userToken;
    
    if (!token) return accessError(res,`${req.method} ${req.params.method}/${req.params.id}`)
    
    adminTokens.doc(token).get().then(doc => {

        if (!doc.exists) return res.sendStatus(403)

        let token = handleDoc(doc)

        getUser(token.user, udb).then(user => {

            if (!user) return res.sendStatus(403)
            
                devlog(req.params.method);

                switch(req.params.method){

                    case `storiesViews`:{
                        return storiesViews.add({
                            story:      req.params.id,
                            user:       +user.id,
                            createdAt:  new Date()
                        }).then(()=>{
                            res.sendStatus(200)
                        }).catch(err=>{
                            console.log(err)
                        })
                    }

                    case `iterationStakes`:{
                        return ifBefore(auctionsBets,{auctionsIteration:req.params.id}).then(col=>{
                            res.json(col.map(s=>{
                                return {
                                    createdAt: s.createdAt,
                                    user: mask(s.user),
                                    you: s.user == +user.id ? true : false
                                }
                            }))
                        })
                    }
                    case `stake`:{
                        return getDoc(auctionsIterations,req.params.id).then(i=>{
                            if(!i || !i.active) return res.status(400).send(userLang(locals.errors.noSuchAuction,user.language_code))
                            devlog(user.score,i.base)
                            if(i.ton){
                                
                                if(+user.curScoreTon >= +i.base){

                                    rtb.ref(`${host}/iterations/${req.params.id}/users`).update({
                                        [user.hash]: true
                                    })

                                    if(i.stakeHolder) ifBefore(udb,{hash:i.stakeHolder}).then(winners=>{
                                        sendMessage2({
                                            chat_id: winners[0].id,
                                            photo: `${ngrok}/images/${host}/beated/${Math.floor(Math.random()*10)}.png`,
                                            caption: userLang(locals.users.stakeHolderChanged(i),user.language_code),
                                            reply_markup:{
                                                inline_keyboard: [[{
                                                    text: userLang(locals.termsAndButtons.open,user.language_code),
                                                    web_app: {
                                                        url: `${ngrok}/${host}/app`
                                                    }
                                                }]]
                                            }
                                        },`sendPhoto`,process.env.auctionToken,messages)
                                    })
    
                                    score(user,+i.base*-1, i, userLang(locals.termsAndButtons.stake,user.language_code));
                                    
                                    let cv = +i.base*casinoRevenue
                                    let stakeUpdate = +i.base - cv

                                    auctionsBets.add({
                                        auctionsIteration:  i.id,
                                        user:               +user.id,
                                        createdAt:          new Date()
                                    })
    
                                    auctionsIterations.doc(req.params.id).update({
                                        stake:          FieldValue.increment(stakeUpdate),
                                        stakeHolder:    user.hash,
                                        stakeHolderId:  mask(user.id),
                                    })

                                    rtb.ref(`${host}/iterations/${i.id}`).update({
                                        stake:          database.ServerValue.increment(stakeUpdate),
                                        stakeHolder:    user.hash,
                                        stakeHolderId:  mask(user.id),
                                        stakeHolderAva: user.photo_url || null
                                    })

                                    

                                    userIncrement(user,`totalStakesTon`,1)
                                    userIncrement(user,`totalStakedTon`,+i.base)


                                    if(user.ref){

                                        getUser(user.ref,udb)
                                            .then(refUser=>{
                                                if(refUser){
                                                    refStakes.add({
                                                        createdAt:  new Date(),
                                                        iteration:  i.id,
                                                        user:       +user.id,
                                                        toUser:     user.ref,
                                                        amount:     cv*refRevenue
                                                    })
            
                                                    userIncrement({
                                                        id:     refUser.id,
                                                        hash:   refUser.hash
                                                    },`curRefScoreTon`,cv*refRevenue)

                                                    userIncrement({
                                                        id:     refUser.id,
                                                        hash:   refUser.hash
                                                    },`totalRefScoreTon`,cv*refRevenue)

                                                    userIncrement({
                                                        id:     refUser.id,
                                                        hash:   refUser.hash
                                                    },`totalRefStakesTon`,1)

            
                                                    if(process.env.develop) {
                                                        sendMessage2({
                                                            chat_id: user.ref,
                                                            text: `(ОТЛАДКА): ${uname(user,user.id)} только что принес вам ${cv*refRevenue} по рефералке.`
                                                        },false,process.env.auctionToken)
                                                    }
                                                }        
                                            })
                                        
                                    }
    
                                    let timerCorrection = null;
    
                                    let left = (+new Date(i.timer._seconds*1000) - +new Date())
    
                                    if(left < 1*60*1000) {
                                        devlog(`остается меньше 1 минуты`)
                                        timerCorrection = 1*60*1000-left
                                    } else if(left < 3*60*1000) {
                                        devlog(`остается меньше 3 минут`)
                                        timerCorrection = 3*60*1000-left
                                    } else if(left < 5*60*1000) {
                                        devlog(`остается меньше 5 минут`)
                                        timerCorrection = 5*60*1000-left
                                    } else if (left < 10*60*1000){
                                        devlog(`остается меньше 10 минут`)
                                        timerCorrection = 10*60*1000-left
                                    } else if (left < 15*60*1000){
                                        devlog(`остается меньше 15 минут`)
                                        timerCorrection = 15*60*1000-left
                                    }
    
                                    
                                    if(timerCorrection){
    
                                        devlog(`надо накинуть ${timerCorrection/1000}`)
    
                                        let newDate = new Date(i.timer._seconds*1000 + timerCorrection)
    
                                        devlog(`получится ${newDate}`)
    
                                        auctionsIterations.doc(req.params.id).update({
                                            timer: newDate
                                        })
    
                                        rtb.ref(`/${host}/iterations/${i.id}`).update({
                                            timer:         +newDate
                                        })
                                        
                                        clearInterval(iterations[req.params.id])
    
                                        iterations[req.params.id] = setTimeout(()=>{
                                            getDoc(auctionsIterations,req.params.id).then(iteration=>{
                                                if(iteration.active) stopIteration(iteration)
                                            })
                                        },+newDate - +new Date())
                                    }
    
    
    
                                    
    
                                    res.send(userLang(locals.termsAndButtons.staked,user.language_code))
    
                                } else {
                                    res.status(400).json({
                                        success: false,
                                        comment: `Not enough balance.`
                                    })
                                }
                            } 
                            // else {
                            //     if(+user.score >= +i.base){

                            //         if(i.stakeHolder) ifBefore(udb,{hash:i.stakeHolder}).then(winners=>{
                            //             sendMessage2({
                            //                 chat_id: winners[0].id,
                            //                 photo: `${ngrok}/images/${host}/beated/${Math.floor(Math.random()*10)}.png`,
                            //                 caption: userLang(locals.users.stakeHolderChanged(i),user.language_code),
                            //                 reply_markup:{
                            //                     inline_keyboard: [[{
                            //                         text: userLang(locals.termsAndButtons.open,user.language_code),
                            //                         web_app: {
                            //                             url: `${ngrok}/${host}/app`
                            //                         }
                            //                     }]]
                            //                 }
                            //             },`sendPhoto`,process.env.auctionToken,messages)
                            //         })
    
                            //         score(user,+i.base*-1, i, userLang(locals.termsAndButtons.stake,user.language_code));
    
                            //         auctionsBets.add({
                            //             auctionsIteration:  i.id,
                            //             user:               +user.id,
                            //             createdAt:          new Date()
                            //         })
    
                            //         auctionsIterations.doc(req.params.id).update({
                            //             stake:          FieldValue.increment(+i.base),
                            //             stakeHolder:    user.hash
                            //         })
    
                            //         let timerCorrection = null;
    
                            //         let left = (+new Date(i.timer._seconds*1000) - +new Date())
    
                            //         devlog((left/1000)/60)
    
                            //         if(left < 1*60*1000) {
                            //             devlog(`остается меньше 1 минуты`)
                            //             timerCorrection = 1*60*1000-left
                            //         } else if(left < 3*60*1000) {
                            //             devlog(`остается меньше 3 минут`)
                            //             timerCorrection = 3*60*1000-left
                            //         } else if(left < 5*60*1000) {
                            //             devlog(`остается меньше 5 минут`)
                            //             timerCorrection = 5*60*1000-left
                            //         } else if (left < 10*60*1000){
                            //             devlog(`остается меньше 10 минут`)
                            //             timerCorrection = 10*60*1000-left
                            //         } else if (left < 15*60*1000){
                            //             devlog(`остается меньше 10 минут`)
                            //             timerCorrection = 15*60*1000-left
                            //         }
    
                                    
                            //         if(timerCorrection){
    
                            //             devlog(i.timer)
                            //             devlog(+i.timer)
                                        
                            //             devlog(`надо накинуть ${timerCorrection/1000}`)
    
                            //             let newDate = new Date(i.timer._seconds*1000 + timerCorrection)
    
                            //             devlog(`получится ${newDate}`)
    
                            //             auctionsIterations.doc(req.params.id).update({
                            //                 timer: newDate
                            //             })
    
                            //             rtb.ref(`/${host}/iterations/${i.id}`).update({
                            //                 timer:         +newDate
                            //             })
                                        
                            //             clearInterval(iterations[req.params.id])
    
                            //             iterations[req.params.id] = setTimeout(()=>{
                            //                 getDoc(auctionsIterations,req.params.id).then(iteration=>{
                            //                     if(iteration.active) stopIteration(iteration)
                            //                 })
                            //             },+newDate - +new Date())
                            //         }
    
    
    
                            //         rtb.ref(`${host}/iterations/${i.id}`).update({
                            //             stake:          database.ServerValue.increment(+i.base),
                            //             stakeHolder:    user.hash,
                            //             stakeHolderId:  mask(user.id),
                            //             stakeHolderAva: user.photo_url || null
                            //         })
    
                            //         res.send(userLang(locals.termsAndButtons.staked,user.language_code))
    
    
                            //     } else {
    
                            //         let toPay = +i.base - +user.score;
    
                            //         invoices.add({
                            //             user:       +user.id,
                            //             iteration:  req.params.id,
                            //             amount:     toPay
                            //         }).then(s=>{
                            //             sendMessage2({
                            //                 "chat_id": user.id,
                            //                 "title": `${toPay} звезд`,
                            //                 "description": userLang(locals.users.toPayDesc,user.language_code),
                            //                 "payload": s.id,
                            //                 "currency": "XTR",
                            //                 "prices": [{
                            //                     "label":    userLang(locals.termsAndButtons.priceLabel,user.language_code),
                            //                     "amount":   toPay
                            //                 }]
                            //             }, 'createInvoiceLink', process.env.auctionToken).then(d=>{
                            //                 devlog(d.result)
                                            
                            //                 res.status(400).json({
                            //                     success: false,
                            //                     comment: userLang(locals.errors.notEnoughStars,user.language_code),
                            //                     invoice:  d.result
                            //                 })
                            //             })
                            //         })
                                    
    
                                    
                            //     }
                            // }
                            
                        }).catch(err=>{
                            handleError(err,res)
                        })
                    }
                    case `users`:{
                        if(+req.params.id != +user.id) return res.sendStatus(403)
                        return res.json(user)
                    }
                    default:{
                        res.sendStatus(404)
                    }
                }
            
        })
    })
    
})

function score(user, delta, iteration, comment, ton){

    if(iteration) transactions.add({
        auctionsIteration:  iteration.id,
        user:               +user.id,
        createdAt:          new Date(),
        amount:             delta,
        ton:                iteration.ton ? true : false,
        comment:            comment || null
    })

    if(iteration.ton || ton){
        userIncrement(user,`curScoreTon`,delta)
        // userIncrement(user,`totalScoreTon`,delta)
        
    } else {
        userIncrement(user,`score`,delta)
        // userIncrement(user,`totalScore`,delta)
    }    
}


function log(o) {

    o.createdAt = new Date()

    logs.add(o).then(r => {

        if (!o.silent) {
            alertAdmins({
                text: o.text
            })
        }
    })
}

function registerUser(u, body) {

    u.createdAt = new Date();
    u.active = true;
    u.blocked = false;
    u.score = 0;
    u.curScoreTon = 0;

    

    if(!u.photo_url) u.photo_url = `/images/${host}/avatars/${Math.floor(Math.random()*11)}.png`
    u[u.language_code] = true;

    udb.doc(u.id.toString()).set(u).then(() => {

        // TBD приветствие

        if(body.message && body.message.text){
            if(body.message.text.indexOf(`ref_`)>-1){
                ref = body.message.text.split(`ref_`)[1]
                getUser(ref,udb).then(refUser=>{
                    
                    if(refUser) {
                        
                        udb.doc(u.id.toString()).update({
                            ref: +ref
                        })

                        userIncrement(refUser,`refs`,1)
                    }
                })
            }
        }

        log({
            silent: true,
            user:   +u.id,
            text:   `${uname(u,u.id)} регистрируется в боте.`
        })

        hashes.add({
            createdAt:  new Date(),
            active:     true,
            user:       +u.id
        }).then(rec=>{
            udb.doc(u.id.toString()).update({
                hash: rec.id
            })
        })


    })
}


function alertAdmins(mess) {
    let message = {
        text: mess.text,
        isReply: true
    }

    udb.where(`admin`, '==', true).get().then(admins => {
        admins.docs.forEach(a => {
            message.chat_id = a.id
            if (mess.type != 'stopLog' || !a.data().stopLog) sendMessage2(message, false, token, messages)
        })
    })
}






router.post(`/authWebApp`,(req,res)=>{
    authWebApp(req,res,token,adminTokens,udb)  
})


function recievePayment(user, payment){
    transactions.add({

        createdAt:  new Date(),
        createdBy:  +user.id,
        active:     true,

        user:       +user.id,
        amount:     payment.total_amount,
        paymentId:  payment.telegram_payment_charge_id,

        comment:    userLang(locals.termsAndButtons.scoreUpdate,user.language_code)
    }).then(p=>{
        
        udb.doc(user.id.toString()).update({
            score: FieldValue.increment(payment.total_amount)
        }).then(upd=>{
            getUser(user.id,udb).then(u=>{
                rtb.ref(`auction/users/${u.hash}`).update({
                    score: u.score
                })
            })
        })

        sendMessage2({
            chat_id: user.id,
            text: userLang(locals.users.scoreUpdated(payment),user.language_code)
        },false,token,messages)

    })
}

function storiesAdd(req,res,admin){
    if(consistencyCheck({
        name:           `Название`,
        description:    `Текст`,
        pic:            `Картинка`,
        lang:           `Язык`
    },req,res)){
        stories.add({
            active:         true,
            createdAt:      new Date(),
            createdBy:      +admin.id,
            name:           req.body.name,
            description:    req.body.description,
            lang:           req.body.lang,
            pic:            req.body.pic
        }).then(rec=>{
            
            log({
                text:       `${uname(admin,admin.id)} создает новую сторис «${req.body.name}»`,
                admin:      +admin.id,
                stories:    rec.id
            })

            res.redirect(`/${host}/web?page=stories_${rec.id}`)

        }).catch(err=>{
            res.status(500).send(err.message)
        })
    }
}

function faqAdd(req,res,admin){
    if(consistencyCheck({
        name:           `Название`,
        description:    `Текст`,
    },req,res)){
        faqs.add({
            active:         true,
            createdAt:      new Date(),
            createdBy:      +admin.id,

            name:           req.body.name,
            description:    req.body.description,
            timing:         +req.body.timing || null,
            icon:           req.body.icon || null,
            ref:            req.body.ref ? true : false,
        }).then(rec=>{
            
            log({
                text: `${uname(admin,admin.id)} создает новый фак «${req.body.name}»`,
                admin: +admin.id,
                faq: rec.id
            })

            res.redirect(`/${host}/web?page=faqs_${rec.id}`)
        }).catch(err=>{
            res.status(500).send(err.message)
        })
    }
}




function transactionsAdd(req,res,admin){
    let required = {
        user:   `Название`,
        amount: `Сумма`
    }
    let missed = Object.keys(required).filter(k=>!req.body[k])
    
    if(missed.length) return res.status(400).send(`${missed.join(', ')} missing`)

    getUser(req.body.user,udb)
        .then(u=>{
            if(!u) return res.status(400).send(`такого пользователя нет`)
                transactions.add({
                    createdAt:  new Date(),
                    createdBy:  +admin.id,
                    active:     true,
                    ton:        req.body.ton ? true : false,
                    user:       +req.body.user,
                    amount:     +req.body.amount
                }).then(rec=>{
            
                    udb.doc(req.body.user.toString()).update({
                        [req.body.ton? `curScoreTon` : `score`]: FieldValue.increment(+req.body.amount)
                    }).then(()=>{

                        transactions.doc(rec.id).update({
                            charged: new Date()
                        })

                        if(req.body.ton){
                            getDoc(udb,u.id).then(updated=>{
                                rtb.ref(`auction/users/${u.hash}`).update({
                                    curScoreTon: updated.curScoreTon
                                })
                            })
                        } else {
                            getDoc(udb,u.id).then(updated=>{
                                rtb.ref(`auction/users/${u.hash}`).update({
                                    score: updated.score
                                })
                            })
                        }
                    })
                    
                    res.redirect(`/${host}/web?page=users_${req.body.user}&alert=${encodeURIComponent(`перевод зачислен`)}`)
            
                    log({
                        transaction:    rec.id,
                        admin:          +admin.id,
                        user:           +req.body.user,
                        text:           `${uname(admin,admin.id)} обновляет счет пользователя ${req.body.user} на ${req.body.amount}`
                    })

                    if(+req.body.amount > 0){
                        sendMessage2({
                            chat_id:    u.id,
                            photo:      `${ngrok}/images/auction/stars${Math.floor(Math.random()*4)}.webp`,
                            caption:    lang(u,locals.accountCharged(+req.body.amount))
                        },`sendPhoto`,token,messages)
                    }
                })
        })
    
}

function lang(user,text){
    return text[user.language_code] || text.en;
}

function auctionsAdd(req,res,admin){
    let required = {
        name: `Название`,
        base: `Ставка`
    }
    let missed = Object.keys(required).filter(k=>!req.body[k])

    if(missed.length) return res.status(400).send(`${missed.join(', ')} missing`)
    
    auctions.add({

        createdAt:  new Date(),
        createdBy:  +admin.id,
        active:     true,
        ton:        req.body.ton || false,
        name:       req.body.name,
        base:       +req.body.base,
        start:      +req.body.start

    }).then(rec=>{
        res.redirect(`/${host}/web?page=auctions_${rec.id}`)
        log({
            auction: rec.id,
            admin: +admin.id,
            text: `${uname(admin,admin.id)} создает аукцион «${req.body.name}».`
        })
    }).catch(err=>handleError(err,res))
}

function auctionsBetsAdd(req,res,admin){

}

function auctionsIterationsAdd(req,res,admin){
    let required = {
        auction:    `аукцион`,
        till:       `Срок окончания`
    }
    let missed = Object.keys(required).filter(k=>!req.body[k])
    
    if(missed.length) return res.status(400).send(`${missed.join(', ')} missing`)

    getDoc(auctions, req.body.auction).then(a=>{
        if(!a || !a.active) {
            if(res) return res.status(400).send(`аукцион недоступен`)
            return false;
        }

        auctionsIterations.add({
            createdAt:      new Date(),
            createdBy:      admin ? +admin.id : null,
            active:         true,

            ton:            a.ton || false,
            
            auction:        req.body.auction,
            auctionName:    a.name,
            base:           a.base,
            stake:          a.start,
            timer:          new Date(req.body.till)
        }).then(s=>{

            rtb.ref(`/${host}/iterations/${s.id}`).set({
                id:             s.id,
                active:         true,  
                ton:            a.ton || false,  
                auctionName:    a.name,
                base:           a.base,
                stake:          a.start,
                timer:          +new Date(req.body.till)
            })

            iterations[s.id] = setTimeout(()=>{
                getDoc(auctionsIterations,s.id).then(i=>{
                    if(i.active) {
                        clearTimeout(iterations[s.id])
                        stopIteration(i,admin)
                    }
                })
            },+new Date(req.body.till) - +new Date())

            if(res) res.redirect(`/${host}/web?page=auctionsIterations_${s.id}`)
            
            // TBD уведомления пользователям

        }).catch(err=>handleError(err,res))
    })
}

function sendMessage(req, res, admin) {
    let t = {
        chat_id: req.body.user,
        text: req.body.text
    }

    sendMessage2(t, false, token, messages, {
        admin: +admin.id
    })

    if (res) res.sendStatus(200);
}

router.get(`/auth`, (req, res) => {
    res.render(`${host}/auth`)
})

router.get(`/userAuth`, (req, res) => {
    res.render(`${host}/userAuth`, {
        ep: req.query.ep
    })
})

router.get(`/`,(req,res)=>{
    res.render(`${host}/landing.pug`)
})


router.get(`/test`,(req,res)=>{
    res.sendStatus(200)

    // withDraw()
    
    // sendMessage2({
    //     "chat_id": dimazvali,
    //     "title": `1 звезда`,
    //     "description": `Столько не хватает для следующей ставки`,
    //     "payload": +new Date(),
    //     "currency": "XTR",
    //     "prices": [{
    //         "label": "Оплата",
    //         "amount": 1
    //     }]
    // }, 'createInvoiceLink', token).then(d=>{

    //     console.log(d.result)

    //     sendMessage2({
    //         "chat_id": dimazvali,
    //         "title": `1 звезда`,
    //         "description": `Столько не хватает для следующей ставки`,
    //         "payload": +new Date(),
    //         "currency": "XTR",
    //         "prices": [{
    //             "label": "Оплата",
    //             "amount": 1
    //         }]
    //     }, 'sendInvoice', token)

    // }).catch(err=>{
    //     console.log(err)
    // })

    // sendMessage2({
    //     offset: 0
    // },`getStarTransactions`,token).then(d=>{
    //     console.log(JSON.stringify(d.result.transactions))
    // })
})

router.post(`/userAuth`, (req, res) => {
    authTG(req, res, token, adminTokens, udb, registerUser, `userToken`)
})

router.post(`/auth`, (req, res) => {
    console.log(`запрос авторизации`)
    authTG(req, res, token, adminTokens, udb, registerUser)
})

router.post(`/hook`, async (req, res) => {
    res.sendStatus(200)

    devlog(JSON.stringify(req.body, null, 2))

    let user = {};

    if (req.body.my_chat_member) {
        if (req.body.my_chat_member.new_chat_member.status == 'kicked') {

            udb.doc(req.body.my_chat_member.chat.id.toString()).update({
                active: false,
                stopped: true
            }).then(s => {
                udb.doc(req.body.my_chat_member.chat.id.toString()).get().then(u => {

                    u = handleDoc(u)

                    log({
                        silent: true,
                        text: `${uname(u,u.id)} блочит бот`,
                        user: +u.id
                    })
                })

            }).catch(err => {
                console.log(err)
            })
        }
    }


    if (req.body.message && req.body.message.from) {
        user = req.body.message.from;

        getUser(user.id, udb).then(u => {
            if (req.body.message.text) {
                messages.add({
                    user: user.id,
                    text: req.body.message.text || null,
                    createdAt: new Date(),
                    isReply: false
                })
            }
            if (!u) return registerUser(user, req.body)
            
            if (!u.active) return udb.doc(user.id.toString()).update({
                active: true,
                stopped: null
            }).then(s => {
                log({
                    silent: true,
                    user: +user.id,
                    text: `Пользователь id ${user.id} возвращается`
                })
            })

            if (req.body.message.text) {

                if (req.body.message.text == `/test`) {
                    return sendMessage2({
                        chat_id:    u.id,
                        text:       `devmode app`,
                        reply_markup:{
                            inline_keyboard:[[{
                                text: `${ngrok}`,
                                web_app:{
                                    url: `${ngrok}/${host}/app2?lang=en` 
                                }
                            }]]
                        }
                    },false,token,messages)
                } else if (req.body.message.text == `/start`) {
                    return sendMessage2({
                        chat_id: user.id,
                        text: userLang(locals.users.welcome,user.language_code)
                    }, false, token,messages)
                } else {
                    return alertAdmins({
                        text: `${uname(u,u.id)} пишет: ${req.body.message.text}`,
                        user: user.id
                    })

                    // if(req.body.message.text.indexOf(`ref_`)>-1){
                    //     ref = req.body.message.text.split(`ref_`)[1]

                    //     if(+ref == +u.id) return sendMessage2({
                    //         chat_id: user.id,
                    //         text: `Вы не можете быть рефералом самого себя.`
                    //     },false,token)

                    //     getUser(ref,udb).then(refUser=>{
                            
                    //         if(refUser) {
                    //             if(!u.ref){
                                    
                    //                 udb.doc(u.id.toString()).update({
                    //                     ref: +ref
                    //                 })
                
                    //                 udb.doc(ref).update({
                    //                     refs: FieldValue.increment(1)
                    //                 })

                    //                 sendMessage2({
                    //                     chat_id: user.id,
                    //                     text: `Ура! Вы — реферал ${ref}.`
                    //                 },false,token)

                    //                 sendMessage2({
                    //                     chat_id: ref,
                    //                     text: `Ура! Вы получили реферала — ${user.id}.`
                    //                 },false,token)

                    //             } else {
                    //                 sendMessage2({
                    //                     chat_id: user.id,
                    //                     text: `Вы уже реферал ${u.ref}.`
                    //                 },false,token)
                    //             }
                                
                    //         } else {
                    //             sendMessage2({
                    //                 chat_id: user.id,
                    //                 text: `Невалидный реферальный код.`
                    //             },false,token)
                    //         }
                    //     })
                    // } else {
                    //     return alertAdmins({
                    //         text: `${uname(u,u.id)} пишет: ${req.body.message.text}`,
                    //         user: user.id
                    //     })
                    // }
                    

                    
                }
            }
            if(req.body.message.successful_payment){
                recievePayment(u,req.body.message.successful_payment)
            }
        })
    }

    if (req.body.pre_checkout_query){
        sendMessage2({
            ok: true,
            pre_checkout_query_id: req.body.pre_checkout_query.id
        },'answerPreCheckoutQuery',token).then(s=>{
            console.log(s.data)
        }).catch(err=>{
            console.log(err)
        })
    }

    if(req.body.inline_query){
        
        let q = req.body.inline_query;

        let u = await getUser(q.from.id,udb);

        if(u){
            sendMessage2({
                cache_time:         0,
                inline_query_id:    q.id,
                results: [{
                    type:           `article`,
                    id:             `invite_${u.id}`,
                    title:          `Пригласить товарища`,
                    description:    u.totalRefScoreTon ? `Ваши рефералы уже принесли вам ${u.totalRefScoreTon.toFixed(2)} TON!` : `топовый доход по реферальной программе в этом месяце: ${topMonthRef} TON.`,
                    input_message_content: {
                        parse_mode:     `HTML`,
                        message_text:   `Эй, посмотри! Тут какие-то изи мани! Всего за пару монет можно сорвать неплохой банк, я попробовал, попробуй и ты!\n${botLink}?start=ref_${u.id}`,
                    }
                }]
            },`answerInlineQuery`,token)
        }

        
    }
})



router.all(`/api/:method`, (req, res) => {
    
    let token = req.signedCookies.userToken;
    
    if (!token) return accessError(res,`${req.method} ${req.params.method}`)

        adminTokens.doc(token).get().then(doc => {

            if (!doc.exists) return res.sendStatus(403)
    
            let token = handleDoc(doc)
    
            getUser(token.user, udb).then(user => {
    
                if (!user) return res.sendStatus(403)
    
                devlog(req.body)
    
                switch (req.params.method) {
                    case `lang`:{
                        devlog(req.body.lang)
                        if(languages.indexOf(req.body.lang)>-1){
                            sendMessage2({
                                chat_id: user.id,
                                menu_button:{
                                    "type": "web_app",
                                    "text": `App`,
                                    "web_app": {
                                        "url": "https://stars-auction-bot-0823eb8d3f85.herokuapp.com/auction/app2?lang="+req.body.lang
                                    }
                                }
                            },`setChatMenuButton`,process.env.auctionToken)
                            return res.sendStatus(200)
                        } else {
                            return res.sendStatus(404)
                        }
                    }
                    case `requests`:{
                        return ifBefore(requests,{active:true,user:+user.id}).then(col=>res.json(col))
                    }
                    case `withdraw`:{

                        let types = {
                            ref:    `curRefScoreTon`,
                            score:  `curScoreTon`
                        }
                        
                        if(!req.body.type) return res.status(400).send(`no type provided`);
                        if(!types[req.body.type]) return res.status(400).send(`incorrect account type`);
                        
                        let account = user[types[req.body.type]];

                        if(req.body.type == `ref`){

                            if(!account || account<0) return res.status(400).send(`insufficient funds`);

                            userIncrement(user, types.ref,     -account);
                            userIncrement(user, types.score,    account);
                            
                            transactions.add({
                                user:               +user.id,
                                createdAt:          new Date(),
                                amount:             account,
                                ton:                true,
                                comment:            `refs`
                            })

                            res.sendStatus(200);

                        } else {
                            if(!account || account < withdrawMin || +req.body.amount > account) return res.status(400).send(`insufficient funds`);

                            userIncrement(user, types[req.body.type], -req.body.amount)

                            

                            return requests.add({
                                user:       +user.id,
                                username:   uname(user,user.id),
                                type:       req.body.type,
                                createdAt:  new Date(),
                                wallet:     req.body.wallet || null,
                                memo:       req.body.memo || null,
                                active:     true,
                                status:     `new`,
                                amount:     +req.body.amount
                            }).then(rec=>{ 

                                res.sendStatus(200);

                                log({
                                    text:       `${uname(user,user.id)} запрашивает вывод средств по статье ${req.body.type} в размере ${+req.body.amount}.`,
                                    user:       +user.id,
                                    request:    rec.id
                                })

                            }).catch(err=>handleError(err,res))
                        }

                        break;

                    }
                    case `refill`:{
                        return sendMessage2({
                            "chat_id":      user.id,
                            "title":        `${req.body.amount} звезд`,
                            "description":  userLang(locals.users.toPayDesc,user.language_code),
                            "payload": new Date(),
                            "currency": "XTR",
                            "prices": [{
                                "label": userLang(locals.termsAndButtons.priceLabel,user.language_code),
                                "amount": req.body.amount
                            }]
                        }, 'createInvoiceLink', process.env.auctionToken).then(d=>{
                            
                            res.json({
                                success: false,
                                invoice:  d.result
                            })
                        })
                    }
                    case `transactions`:{
                        return ifBefore(transactions,{user: +user.id}).then(col=>res.json(col))
                    }
                    case `faqs`:{
                        return ifBefore(faqs).then(col=>{
                            res.json(col)
                        })
                    }
                    case `profile`:{
                        return ifBefore(udb,{ref:+user.id}).then(col=>{
                            user.tonPayload = tonPayload(user.hash)
                            user.refs = col.sort((a,b)=>(b.totalStakedTon||0)-(a.totalStakedTon||0)).map(u=>{
                                return {
                                    totalStakesTon:     u.totalStakesTon || 0,
                                    score:      (u.totalStakedTon||0)*refRevenue*casinoRevenue,
                                    username:   u.username,
                                    id:         mask(u.id)
                                }
                            })
                            return res.json(user)
                        })
                        
                    }
                    case `auctions`:{
                        return ifBefore(auctions).then(data=>res.json(data))
                    }
                    case `before`:{
                        return ifBefore(auctionsIterations,{active:false}).then(data=>res.json(data.slice(0,20)))
                    }
                    case `auctionsIterations`:{
                        return ifBefore(auctionsIterations).then(data=>res.json(data))
                    }

                    case `stories`:{
                        return ifBefore(stories,{
                            active: true,
                            lang: languages.indexOf(user.language_code) > -1 ? user.language_code : `en` 
                        }).then(d=>{

                            ifBefore(storiesViews,{user: +user.id}).then(col=>{
                                res.json(d.sort((a,b)=>a.createdAt._seconds-b.createdAt._seconds).map(s=>{
                                    let t = s;
                                    t.shown = col.filter(v=>v.story == s.id)[0] ? true : false;
                                    return t;
                                }))
                            })


                        })
                    }

                    default:{
                        res.sendStatus(404)
                    }
                }
            })
        })
})

router.all(`/admin/:method`, (req, res) => {

    let token = req.signedCookies.adminToken || req.signedCookies.userToken || (process.env.develop == `true`? process.env.adminToken : false);

    if (!token) return accessError(res, `${req.method} ${req.params.method}`)

    adminTokens.doc(token).get().then(doc => {

        if (!doc.exists) return res.sendStatus(403)

        let token = handleDoc(doc)

        getUser(token.user, udb).then(admin => {
            if (!admin) devlog(`нет такого юзера`)
            if (!admin) return res.sendStatus(403)

            devlog(req.body)

            switch (req.params.method) {

                case `lang`:{
                    return res.json([{
                        name:   `русский`,
                        id:     `ru`,
                        active: true
                    },{
                        name:   `английский`,
                        id:     `en`,
                        active: true
                    }])
                }

                case `userSearch`: {
                    if (!req.query.name) return res.sendStatus(400)

                    return udb.get().then(col => {
                        res.json(handleQuery(col).filter(u => u.username && !u.username.indexOf(req.query.name)))
                    })

                }

                default: {

                    if (!datatypes[req.params.method]) return res.sendStatus(404)

                    if (req.method == `GET`) return datatypes[req.params.method].col.get().then(col => {

                        let data = handleQuery(col, true);

                        Object.keys(req.query).forEach(q => {
                            data = data.filter(i => i[q] == (Number(req.query[q]) ? Number(req.query[q]) : req.query[q]))
                        })

                        if (!admin.admin && req.params.method == `users`) data = data.filter(i => i.createdBy == +admin.id)

                        res.json(data)
                    })

                    if (req.method == `POST`) return datatypes[req.params.method].newDoc(req, res, admin, datatypes[req.params.method].extras)

                    return res.sendStatus(404)
                }
            }
        })
    })
})

router.get(`/app`,(req,res)=>{
    res.render(`${host}/app`,{
        start:  req.query.startapp,
        translations: locals,
        lang:   `ru`,
        botLink: botLink
    })
})

router.get(`/app2`,(req,res)=>{
    res.render(`${host}/app/app2`,{
        start:          req.query.startapp,
        translations:   locals,
        lang:           req.query.lang || `en`,
        botLink:        botLink
    })
})

router.all(`/admin/:method/:id`, (req, res) => {
    
    let token = req.signedCookies.adminToken || (process.env.develop == `true`? process.env.adminToken : false);

    if (!token) return accessError(res,`${req.method} ${req.params.id}.`)

    adminTokens.doc(token).get().then(doc => {


        if (!doc.exists) return res.sendStatus(403)

        let token = handleDoc(doc)

        getUser(token.user, udb).then(admin => {
            switch (req.params.method) {

                case `requests`:{

                    let ref = requests.doc(req.params.id);
                    return getDoc(requests,req.params.id).then(r=>{
                        if(!r) return res.sendStatus(404);
                        getUser(r.user,udb).then(user=>{
                            switch(req.method){
                                case `GET`:{
                                    return res.json(r)
                                }
                                case `DELETE`:{

                                    if(r.active){

                                        ref.update({
                                            active:     false,
                                            status:     `cancelledByAdmin`,
                                            updatedBy:  +admin.id,
                                            updatedAt:  new Date()
                                        })

                                        log({
                                            text:       `${uname(admin,admin.id)} отменяет выплату в пользу ${uname(user,user.id)} в размере ${r.amount}.`,
                                            admin:      +admin.id,
                                            request:    req.params.id
                                        })

                                        userIncrement(user, `curRefScoreTon`, +req.body.amount)

                                        res.sendStatus(200)
                                        
                                    } else {
                                        res.status(400).send(`Запрос уже обработан (или отклонен).`)
                                    }
                                    
                                    break;
                                }
                                case `POST`:{

                                    if(r.active){
                                        ref.update({
                                            active:     false,
                                            status:     `executed`,
                                            updatedBy:  +admin.id,
                                            updatedAt:  new Date()
                                        })
    
                                        log({
                                            text: `${uname(admin,admin.id)} производит выплату в пользу ${uname(user,user.id)} в размере ${r.amount}.`,
                                            admin: +admin.id,
                                            request: req.params.id
                                        })
    
                                        sendMessage2({
                                            chat_id: user.id,
                                            text: locals.updates.withdrawsuccess(r.amount)[user.language_code] || locals.updates.withdrawsuccess(r.amount).en
                                        },false,process.env.auctionToken,messages)
    
                                        transactions.add({
                                            user:               +user.id,
                                            createdAt:          new Date(),
                                            amount:             -r.amount,
                                            ton:                true,
                                            comment:            locals.transactionTypes.withdrawal
                                        })
                                        res.sendStatus(200)
                                    } else {
                                        res.status(400).send(`Запрос уже обработан (или отклонен).`)
                                    }
                                    
                                    

                                    
                                    break;

                                }
                            }
                        })
                        
                    })
                }

                case `logs`: {

                    if (!admin.admin) return res.sendStatus(403)

                    let q = req.params.id.split('_')

                    return logs
                        .where(q[0], '==', Number(q[1]) ? +q[1] : q[1])
                        .get()
                        .then(col => {
                            res.json(handleQuery(col, true))
                        })
                }

                default: {

                    if (!datatypes[req.params.method]) return res.sendStatus(404)

                    let ref = datatypes[req.params.method].col.doc(req.params.id)

                    ref.get().then(d => {
                        d = handleDoc(d)

                        if (!admin.admin) {
                            if (d.createdBy != +admin.id) return res.sendStatus(403)
                        }

                        if (req.method == `GET`) return ref.get().then(d => {
                            d.exists ? res.json(handleDoc(d)) : res.sendStatus(404)
                        })

                        if (req.method == `PUT`) return updateEntity(req, res, ref, admin)
                        
                        if (req.method == `DELETE`) return deleteEntity(req, res, ref, admin, false, ()=>datatypes[req.params.method].callback(d,admin))

                        return res.sendStatus(404)

                    })


                }
            }
        })

    })
})

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }
  

function updateEntity(req, res, ref, admin) {
    ref.get().then(d => {

        d = handleDoc(d);

        if (req.params.method == `messages`) {
            let mess = d;

            if (mess.deleted || mess.edited) return res.status(400).send(`уже удалено`);
            if (!mess.messageId) return res.status(400).send(`нет id сообщения`);

            sendMessage2({
                chat_id: mess.user,
                message_id: mess.messageId,
                text: req.body.value
            }, `editMessageText`, token).then(resp => {
                if (resp.ok) {
                    res.json({
                        success: true,
                        comment: `Сообщение обновлено.`
                    })
                    ref.update({
                        text: req.body.value,
                        textInit: mess.text,
                        editedBy: admin ? +admin.id : null,
                        edited: new Date()
                    })
                } else {
                    res.sendStatus(500)
                }
            })
        } else {
            ref.update({
                [req.body.attr]: (req.body.type == `date` ? new Date(req.body.value) : (isNumeric(req.body.value)? +req.body.value : req.body.value )) || null,
                updatedAt: new Date(),
                updatedBy: admin ? +admin.id : null,
            }).then(s => {
                res.json({
                    success: true
                })

                if(req.params.method == `users`){
                    rtb.ref(`auction/users/${d.hash}`).update({
                        [req.body.attr]: req.body.value
                    })
                }

                log({
                    silent: true,
                    admin: admin ? +admin.id : null,
                    [req.params.method]: req.params.id,
                    text: `Обновлен ${req.params.method} / ${d.name || req.params.id}.\n${req.body.attr} стало ${req.body.value} (было ${d[req.body.attr || null]})`
                })

                if (req.params.method == `settings`) {
                    savedSettings[req.params.id].value = req.body.value
                }
            })
        }


    })

}


function deleteEntity(req, res, ref, admin, attr, callback) {
    try {
        return ref.get().then(e => {

            let data = handleDoc(e)
    
            if (req.params.method == `messages`) {
    
                mess = data;
    
                if (mess.deleted) return res.status(400).send(`уже удалено`);
                if (!mess.messageId) return res.status(400).send(`нет id сообщения`);
    
                sendMessage2({
                    chat_id: mess.user,
                    message_id: mess.messageId
                }, `deleteMessage`, token).then(resp => {
                    if (resp.ok) {
                        res.json({
                            success: true,
                            comment: `Сообщение удалено.`
                        })
                        ref.update({
                            deleted: new Date(),
                            deletedBy: +admin.id
                        })
                    } else {
                        res.sendStatus(500)
                    }
                })
            } else {
                if (!data[attr || 'active']) return res.json({
                    success: false,
                    comment: `Вы опоздали. Запись уже удалена.`
                })
    
    
                ref.update({
                    [attr || 'active']: false,
                    updatedBy: +admin.id
                }).then(s => {
    
                    log({
                        [req.params.data]: req.params.id,
                        admin: +admin.id,
                        text: `${uname(admin,admin.id)} архивирует ${req.params.method} ${e.name || e.id}.`
                    })
    
                    res.json({
                        success: true
                    })
    
                    if (typeof (callback) == 'function') {
                        console.log(`Запускаем коллбэк`)
                        callback()
                    }
                }).catch(err => {
    
                    console.log(err)
    
                    res.json({
                        success: false,
                        comment: err.message
                    })
                })
            }
    
    
        })    
    } catch (error) {
        console.log(error)
        return res.status(500).send(err.message)
    }
    
}

router.get(`/web`, (req, res) => {
    
    console.log(req.signedCookies.adminToken)

    if (!process.env.develop && !req.signedCookies.adminToken) return res.redirect(`${process.env.ngrok}/${host}/auth`)

    getDoc(adminTokens, (req.signedCookies.adminToken || process.env.adminToken)).then(t => {

        if (!t || !t.active) {
            devlog(`нет такого токена`)
            return res.sendStatus(403)
        }

        getUser(t.user, udb).then(u => {

            devlog(`пользватель получен`)

            if (u.blocked) return res.sendStatus(403)

            if (u.admin && !req.query.stopAdmin) return logs
                .orderBy(`createdAt`, 'desc')
                .limit(100)
                .get()
                .then(col => {

                    res.render(`${host}/web`, {
                        user:       u,
                        wysykey:    process.env.wysykey,
                        start:      req.query.page,
                        logs:       handleQuery(col),
                    })
                })
            return res.render(`${host}/error`,{
                error: 403,
                text: `Извините, но это закрытая часть сайта. Если вы уверены, что у вас должен быть доступ, напишите в телеграм @dimazvali.`
            })

        })

    })
})



module.exports = router;

function withDraw(){
    sendMessage2({},`getStarTransactions`,token).then(d=>{
        console.log(JSON.stringify(d.result.transactions))
        d.result.transactions.forEach(t=>{
            if(t.source) sendMessage2({
                user_id: t.source.user.id,
                telegram_payment_charge_id: t.id
            },`refundStarPayment`,token).then(r=>{
                console.log(r)
                // if(r.ok){
                //     score(t.source.user.id,t.amount,false,`возврат платежа`)
                // }
            })
        })

    })
}


function clearAll(){
    udb.get().then(users=>{
        handleQuery(users).forEach(u=>{
            devlog(u)
            udb.doc(u.id).update({
                tonScore: null,
                totalTonScore: null,
                totalStaked: null,
                stakes: null,
                refTonScore:  null,
                refTonScoreTotal: null,
                refTonStakes: null,

                score:              0,
                totalStakesTon:     0,
                curScoreTon:        0,
                totalStakedTon:     0,
                totalScoreTon:      0
            })

            rtb.ref(`${host}/users/${u.hash}`).set(null)
        })
    })
}

// clearAll()