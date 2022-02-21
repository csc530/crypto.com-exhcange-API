class Instrument {
    /**Instrument's name */
    name;
    /**The currency of the quote */
    quoteCur;
    /**the base price currency */
    baseCur;
    /**The number of decimal places in shown in the price */
    priceDec;
    /**The number of decimal places to shown in the quantity */
    qtyDec;
    /** If margin trading is enabled on the instrument*/
    margTrade;

    constructor(name, quoteCurrency, baseCurrency, priceDecimals, quantityDecimals, enableMarginTrading) {
        this.name = name;
        this.qtyDec = quantityDecimals;
        this.baseCur = baseCurrency;
        this.priceDec = priceDecimals;
        this.margTrade = enableMarginTrading;
        this.quoteCur = quoteCurrency;
    }

}

function createInstrument(instrument) {
    let name = instrument.instrument_name;
    let qtyDec = instrument.quantity_decimals;
    let baseCur = instrument.base_currency;
    let priceDec = instrument.price_decimals;
    let margTrade = instrument.margin_trading_enabled;
    let quoteCur = instrument.quote_currency;
    return new Instrument(name, quoteCur, baseCur, priceDec, qtyDec, margTrade);
}

module.exports = {
    Instrument,
    createInstrument,
}