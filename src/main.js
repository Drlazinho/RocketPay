import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69347"],
    american_express: ["#2d57f2", "#fff"],
    unionpay: ["#007B84", "#E21836"],
    maestro: ["#cc2131", "#3a9bd9"],
    discover: ["#fff", "#dd873e"],
    jcb: ["#cc2131", "#40A737"],
    diners: ["#fff", "#006095"],
    default: ["#000", "#808080"]
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securitCodePattern = {
  mask: "0000"
}

const securitCodeMasked = IMask(securityCode, securitCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
        mask: '0000 000000 00000',
        regex: /^3[47]\d{0,13}/,
        cardtype: 'american_express'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
        cardtype: 'discover'
    },
    {
        mask: '0000 000000 0000',
        regex: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
        cardtype: 'diners'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
        cardtype: 'mastercard'
    },
    {
        mask: '0000 000000 00000',
        regex: /^(?:2131|1800)\d{0,11}/,
        cardtype: 'jcb'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^(?:35\d{0,2})\d{0,12}/,
        cardtype: 'jcb'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
        cardtype: 'maestro'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^4\d{0,15}/,
        cardtype: 'visa'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^62\d{0,14}/,
        cardtype: 'unionpay'
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", e => {
  e.preventDefault()
  alert("Cartão adicionado")
})

document
  .querySelector("form")
  .addEventListener("submit", e => e.preventDefault())

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerHTML =
    cardHolder.value.length === 0 ? "FULANDO DA SILVA" : cardHolder.value
})

securitCodeMasked.on("accept", () => {
  updateSecurityCode(securitCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerHTML = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerHTML = number.length === 0 ? "1234 5678 9101 2134" : number
}

expirationDateMasked.on("accept", () => {
updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerHTML = date.length === 0 ? "12/23" : date
}