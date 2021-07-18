const converter = (fromRate, toRate, amount) => {
    let rate = fromRate / toRate;
    let figure = amount / rate;

    console.log(figure)
    // return figure;
}

module.exports = converter;