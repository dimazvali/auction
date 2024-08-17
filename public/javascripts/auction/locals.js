const locals = {
    you: {
        ru: `Вы`,
        en: `You`
    },
    about: {
        ru: `Часто задаваемые вопросы`,
        en: `FAQ`
    },
    bet: {
        ru: `Сделать ставку`,
        en: `Bet`
    },
    lead: {
        ru: `Вы ведете`,
        en: `You are winning`
    },
    auctions: {
        ru: `Аукционы`,
        en: `Auctions`
    },
    refill: {
        ru: `Пополнить счет`,
        en: `Top up`
    },
    toTheEnd:{
        ru: `До конца розыгрыша: `,
        en: `Time to end: `
    },
    transactionTypes:{
        ref: {
            ru: `Рефералы`,
            en: `Referals`
        },
        withdrawal:{
            en: `Withdrawal`,
            ru: `Вывод средств`
        },
    },
    headers:{
        winner:{
            ru: `Победитель`,
            en: `winner`
        },
        transactionsInProcess:{
            en: `Transactions in progress`,
            ru: `Переводы на рассмотрении`
        },
        minimum:{
            en: `Minimum`,
            ru: `Минимальная сумма`
        },
        yourWallet:{
            en: `Your wallet address`,
            ru: `Адрес вашего кошелька`
        },
        wSum:{
            en: `Sum`,
            ru: `Сумма вывода`
        },
        withdrawal:{
            en: `Withdrawal`,
            ru: `Вывод средств`
        },
        address:{
            en: `Wallet address`,
            ru: `Адрес для пополнения`
        },
        manual:{
            en: `Manual refill`,
            ru: `Ручное пополнение`
        },
        transactions:{
            en: `Transactions`,
            ru: `Транзакции`
        },
        withdraw:{
            en: `Withdraw`,
            ru: `Вывод`
        },
        deposit:{
            en: `Deposit`,
            ru: `Депозит`
        },
        totalEarned:{
            en: `Total earned`,
            ru: `Сумма выигрышей`
        },
        totalStaked:{
            en: `Total staked`,
            ru: `Сумма ставок`
        },
        totalStakes:{
            en: `Total stakes`,
            ru: `Количество ставок`
        }, 
        accessible:{
            en: `Can be withdrawn`,
            ru: `Доступно к выводу`
        }, 
        earnedSum:{
            en: `Earned`,
            ru: `Сумма выигрыша`
        }, 
        earned:{
            en: `Earned in total`,
            ru: `Всего заработано`
        }, 
        yourRefs:{
            en: `Your referrals`,
            ru: `Ваши рефералы`
        },
        ref:{
            en: `Referral`,
            ru: `Реферал`
        },
        refs:{
            en: `Referrals`,
            ru: `Рефералов`
        },
        refsBets:{
            en: `Their stakes`,
            ru: `Их ставок`
        },
        refLink:{
            en: `Referral link`,
            ru: `Реферальная ссылка`
        },
        action:{
            en: `Action`,
            ru: `Действие`
        },
        sum:{
            en: `Sum`,
            ru: `Сумма`
        },
        stakes:{
            en: `Stakes`,
            ru: `Ставки`
        },
        stake:{
            en: `Stake`,
            ru: `Ставка`
        },
        income:{
            en: `Income`,
            ru: `Доход`
        }, 
        time:{
            en: `Time`,
            ru: `Время`
        },
        date:{
            en: `Date`,
            ru: `Дата`
        },
        stats:{
            en: `Stats`,
            ru: `Статистика ставок`
        },
        history:{
            en: `History`,
            ru: `История`
        },
        length:{
            en: `Timing`,
            ru: `Длительность`
        },
    },
    termsAndButtons:{
        shareLink:{
            en: `Share the link via QR-code`,
            ru: `Поделитесь реферальной ссылкой с друзьями через QR-код`
        },
        hide:{
            en: `hide`,
            ru: `скрыть`
        },
        get: {
            en: `Get`,
            ru: `Получить`
        },
        close: {
            en: `close`,
            ru: `Закрыть`
        },
        win: {
            ru: `Выигрыш`,
            en: `Winning`
        },
        open:{
            ru: `Открыть аукцион`,
            en: `Open the auction`
        },
        stake: {
            ru: `Ставка`,
            en: `Bid`
        },
        staked:{
            ru: `ставка сделана`,
            en: `Bid placed`
        },
        priceLabel:{
            ru: `Оплата`,
            en: `Payment`
        },
        scoreUpdate:{
            ru: `пополнение счета` ,
            en: `top up balance`
        }
    },
    errors: {
        notEnoughBalance:{
            ru: `Ваш счет меньше, чем сумма вывода...`,
            en: `Not enough TON`,
        },
        amountMissing:{
            ru: `Укажите, сколько хотите вывести со счета.`,
            en: `Set an amount to withdraw`,
        },
        yourWallerData: {
            ru: `Введите данные своего кошелька.`,
            en: `Enter your waller data`
        },
        noSuchAuction: {
            ru: `Такого аукциона нет`,
            en: `There is no such auction`
        },
        notEnoughStars: {
            ru: `Вам не хватает звезд!`,
            en: `Not enough stars!`
        }
    },
    users:{
        welcome: {
            ru: `Добро пожаловать в Аукцион, тут вы можете легко выиграть Звезды от Телеграм`,
            en: `Welcome to the Auction, here you can easily win stars from Telegram`
        },
        scoreUpdated: (payment) => {
            return {
                ru: `Ваш счет пополнен на ${payment.total_amount} звезд.`,
                en: `Your account has been funded with ${payment.total_amount} stars.`
            }
        },
        toPayDesc:{
            ru: `Столько не хватает для следующей ставки`,
            en: `So much is missing for the next bid`
        },
        stakeHolderChanged:(i)=>{
            return {
                ru:  `Ваша ставка бита! Скорее! Вы еще можете выиграть ${(i.stake + Number(i.base)).toFixed(1)} звезд!`,
                en:  `Your bid is beaten! Hurry up! You can still win ${(i.stake + Number(i.base)).toFixed(1)} stars!`
            }
        },
        iterationOver:(iteration)=>{
            return {
                ru: `Розыгрыш аукциона ${iteration.auctionName} закончился.\nВ этот раз ваша ставка не сыграла. Попробуем снова?`,
                en: `The ${iteration.auctionName} auction has ended. Your bid failed this time. Shall we try again?`
            }
        },
        congrats: (iteration)=> {
            return {
                ru: `Поздравляем! Вы выиграли ${iteration.stake.toFixed(1)} звезд!`,
                en: `Congratulations! You have won ${iteration.stake.toFixed(1)} stars!`,
            }
        }
    },
    updates:{
        copied: {
            ru: `скопировано` ,
            en: `copied`
        },
        income: `зачисление TON`,
        withdrawsuccess:(v)=>{
            return {
                en: `${v} TON withdrawal completed.`,
                ru: `Выплата в размере ${v} TON произведена.`
            }
        }
    },
    accountCharged:(a)=>{
        return {
            ru: `Ура! Ваш баланс пополнен на ${a} звезд. Удачной игры!`,
            en: `Yay! Your balance has been replenished with ${a} stars. Good luck!`
        }
    }
}

export {
    locals
}
// export default locals;