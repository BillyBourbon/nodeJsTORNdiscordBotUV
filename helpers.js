const formatterCurrency = (n) =>{
    return Intl.NumberFormat("en-US", {
        minimumFractionDigits:0,
        maximumFractionDigits:0,
        style:"currency",
        currency:"USD"
    }).format(n)
}
const formatterQuantity = (n) => {
    return Intl.NumberFormat("en-US", {
        minimumFractionDigits : 0,
        maximumFractionDigits : 0,
    }).format(n)
}

export { formatterCurrency, formatterQuantity}