import React, {useEffect, useRef, useState} from 'react';
import {Block} from './Block';
import './index.scss';

function App() {
    const [base, setBase] = useState("RUB");
    const [toCurr, setToCurr] = useState("USD");
    const [fromPrice, setFromPrice] = useState(0);
    const [toPrice, setToPrice] = useState(1);

    const ratesRef = useRef({});

    useEffect(() => {
        fetch("https://www.cbr-xml-daily.ru/latest.js")
            .then(res => res.json())
            .then(json => {
                json.rates.RUB = 1;
                ratesRef.current = json.rates;
                onChangeToPrice(1);
            })
            .catch(err => {
                console.warn(err);
                alert("Ошибка получения курсов!");
            });
    }, []);

    const onChangeFromPrice = (value) => {
        const price = value / ratesRef.current[base];
        const result = price * ratesRef.current[toCurr];
        setFromPrice(value);
        setToPrice(result.toFixed(2));
    };

    const onChangeToPrice = (value) => {
        const result = (ratesRef.current[base] / ratesRef.current[toCurr]) * value;
        setFromPrice(result.toFixed(2));
        setToPrice(value);
    };

    useEffect(() => {
        onChangeFromPrice(fromPrice);
    }, [base]);

    useEffect(() => {
        onChangeToPrice(toPrice);
    }, [toCurr]);


    return (
        <div className="App">
            <Block value={fromPrice}
                   currency={base}
                   onChangeCurrency={setBase}
                   onChangeValue={onChangeFromPrice} />
            <Block value={toPrice}
                   currency={toCurr}
                   onChangeCurrency={setToCurr}
                   onChangeValue={onChangeToPrice} />
        </div>
    );
}

export default App;
