import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./onus.png";
import logo_onus from "./logo_onus.png";
import logo_vndc from "./logo_vndc.png";
import logo_usdt from "./logo_usdt.png";

function App() {
  const [vndc] = useState(2500000);
  const [dataPrice, setDataPrice] = useState([]);
  const [pay, setPay] = useState(0);
  const [buy, setBuy] = useState(0);

  useEffect(() => {
    setInterval(() => {
      axios
        .get(
          "https://exchange.vndc.io/exchange/api/v1/showup-prices?fbclid=IwAR1H2haR3YBV6D88n3je7X64_1-6aJvjQ81mQAZLZCBK-jNAYKm2hj1JuvY"
        )
        .then((res) => {
          setDataPrice(res.data);
        })
        .catch((error) => console.log(error));
    }, 1000);
  }, []);

  useEffect(() => {
    const Pay =
      (vndc / dataPrice?.ONUSVNDC?.bid) *
        Number(dataPrice?.ONUSUSDT?.ask) *
        dataPrice?.USDTVNDC?.ask -
      vndc;
    const Buy =
      (vndc / dataPrice?.USDTVNDC?.bid / Number(dataPrice?.ONUSUSDT?.bid)) *
        dataPrice?.ONUSVNDC?.ask -
      vndc;
    setPay(Pay.toFixed(4));
    setBuy(Buy.toFixed(4));
  }, [dataPrice, vndc, setPay, setBuy]);

  useEffect(() => {
    if (pay > 10000) {
      showNotificationWin1();
    } else if (buy > 10000) {
      showNotificationWin2();
    }
  }, [pay, buy]);

  const showNotificationWin1 = () => {
    // const notification = new Notification("New message from dcode!", {
    //   : `Trade Onus Có Lãi ${parseFloat(pay).toFixed(0)} Kìa `,
    // });
    // return notification;
    alert(`Trade Onus Có Lãi ${parseFloat(pay).toFixed(0)} Kìa`);
  };
  const showNotificationWin2 = () => {
    // const notification = new Notification("New message from dcode!", {
    //   body: `Trade Onus Có Lãi ${parseFloat(buy).toFixed(0)} Kìa `,
    // });
    // return notification;
    alert(`Trade Onus Có Lãi ${parseFloat(pay).toFixed(0)} Kìa`);
  };

  const moneyFormat = (price) => {
    const pieces = parseFloat(price).toFixed(0).split("");
    let ii = pieces.length;
    while ((ii -= 3) > 0) {
      pieces.splice(ii, 0, ",");
    }
    return pieces.join("");
  };

  return (
    <div className="body">
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="Onus Logo"></img>
      </div>
      <div className="vndc">
        <h1>VNDC : {moneyFormat(vndc)}</h1>
      </div>
      <div className="App">
        <div className="pay">
          <h1 style={{ color: "blue", display: "inline-flex" }}>
            <img src={logo_vndc} alt="Onus Logo" className="image_logo"></img>=
            {">"}
            <img src={logo_onus} alt="Onus Logo" className="image_logo"></img>=
            {">"}
            <img src={logo_usdt} alt="Onus Logo" className="image_logo"></img>=
            {">"}
            <img src={logo_vndc} alt="Onus Logo" className="image_logo"></img>
          </h1>
          <h2 className={pay > 0 ? "win" : "lose"}>{pay}</h2>
        </div>
        <div className="buy">
          <h1 style={{ color: "blue", display: "inline-flex" }}>
            <img src={logo_vndc} alt="Onus Logo" className="image_logo"></img>=
            {">"}
            <img src={logo_usdt} alt="Onus Logo" className="image_logo"></img>=
            {">"}
            <img src={logo_onus} alt="Onus Logo" className="image_logo"></img>=
            {">"}
            <img src={logo_vndc} alt="Onus Logo" className="image_logo"></img>
          </h1>
          <h2 className={buy > 0 ? "win" : "lose"}>{buy}</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
