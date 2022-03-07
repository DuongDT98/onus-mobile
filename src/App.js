import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import RowInfo from "./components/RowInfo/index";
import "./App.css";
import notifyAudio from "./assets/tien-ve4.mp3";

function getAllListCrypto() {
  return axios.get("https://exchange.vndc.io/exchange/api/v1/showup-prices");
}

// function getCryptoBySymbolAtlas(symbol) {
//   return axios.get(
//     `https://api.attlas.io/api/v1/exchange/depth?symbol=${symbol || "RACAUSDT"}`
//   );
// }

function getCryptoBySymbolMexc(symbol) {
  return axios.get(
    `https://www.mexc.com/api/platform/market/spot/deals?symbol=${symbol}`
  );
}

function getUsdtP2p(symbol, type) {
  return axios
    .get(
      `https://vndc.io/p2p?type=${type || "BUY"}&currency=${symbol || "USDT"}`
    )
    .then((res) => {
      const slideIndexFrom = res?.data.search("font-bold text-18px");
      const dataSlice = res?.data
        ?.slice(slideIndexFrom + 25, slideIndexFrom + 35)
        ?.replace("V", "")
        ?.replace("N", "")
        ?.replace(",", "");
      return dataSlice;
    });
}

const useAudio = (url) => {
  const audio = useMemo(() => new Audio(url), []);
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(true);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

function App() {
  const [listCoins, setListCoins] = useState([]);
  const [usdtVndcFixed, setUsdtVndcFixed] = useState(23450);
  const [usdtVndcFixedP2P, setUsdtVndcFixedP2P] = useState(0);
  const [inputUsdtVndcFixed, setInputUsdtVndcFixed] = useState(0);
  const [playing, alertNotify] = useAudio(notifyAudio);
  const [itamMexcUsdt, setItamMexcUsdt] = useState(0);
  const handleUsdt = async () => {
    const usdtBuy = await getUsdtP2p("USDT");
    const usdtSell = await getUsdtP2p("USDT", "SELL");
    const avg = (Number(usdtSell) + Number(usdtBuy)) / 2;

    if (avg) {
      setUsdtVndcFixedP2P(avg || 0);
    }
  };

  const handleGetAtlasCrypto = async () => {
    try {
      const resusdt = await getCryptoBySymbolMexc("ITAMCUBE_USDT");
      const dataUsdt = resusdt?.data?.data?.data[0]?.p;
      setItamMexcUsdt(dataUsdt);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      handleUsdt();
    }, 10000);
    setInterval(async () => {
      handleGetAtlasCrypto();
      const res = await getAllListCrypto();
      const data = res?.data;
      const usdtBuy = data["USDTVNDC"]?.bid;
      const usdtSell = data["USDTVNDC"]?.ask;
      const avg = (Number(usdtSell) + Number(usdtBuy)) / 2;

      if (avg) {
        setUsdtVndcFixed(avg || 0);
      }
      setListCoins(data);
    }, 2000);
  }, []);

  function handleALert() {
    if (playing) {
      return;
    }
    console.log("sound!!!");
    alertNotify();
  }

  const listCoinsWatch = [
    {
      name: "ONUS",
      vndcPrice: listCoins["ONUSVNDC"],
      usdtPrice: listCoins["ONUSUSDT"],
      usdtVndcFixed:
        inputUsdtVndcFixed > 23000
          ? inputUsdtVndcFixed
          : usdtVndcFixedP2P !== 0
          ? usdtVndcFixedP2P
          : usdtVndcFixed,
      pcAlert: 0.5,
      percentInlation: 0.01,
      handleALert: handleALert,
      percentShowWarning: 0.5,
    },
    {
      name: "RACA",
      vndcPrice: listCoins["RACAVNDC"],
      usdtPrice: listCoins["RACAUSDT"],
      usdtVndcFixed:
        inputUsdtVndcFixed > 23000
          ? inputUsdtVndcFixed
          : usdtVndcFixedP2P !== 0
          ? usdtVndcFixedP2P
          : usdtVndcFixed,
      pcAlert: 2,
      percentInlation: 0.02,
      handleALert: handleALert,
      percentShowWarning: 1,
    },
    {
      name: "ITAMCUBE",
      vndcPrice: listCoins["ITAMCUBEVNDC"],
      usdtPrice: listCoins["ITAMCUBEUSDT"],
      usdtVndcFixed:
        inputUsdtVndcFixed > 23000
          ? inputUsdtVndcFixed
          : usdtVndcFixedP2P !== 0
          ? usdtVndcFixedP2P
          : usdtVndcFixed,
      pcAlert: 2,
      percentInlation: 0.02,
      handleALert: handleALert,
      percentShowWarning: 1,
    },
  ];

  const listCoinsWatchMexc = [
    {
      name: "ITAMCUBE",
      mexcPrice: itamMexcUsdt,
      onusPrice: listCoins["ITAMCUBEUSDT"],
      usdtVndcFixed:
        inputUsdtVndcFixed > 23000
          ? inputUsdtVndcFixed
          : usdtVndcFixedP2P !== 0
          ? usdtVndcFixedP2P
          : usdtVndcFixed,
      pcAlert: 2,
      percentInlation: 0.02,
      handleALert: handleALert,
      percentShowWarning: 1,
    },
  ];
  return (
    <div className="App">
      <div className="p2p-usdt">
        <span>INPUT USDT : </span>
        <input
          onChange={(e) => {
            setInputUsdtVndcFixed(e.target.value);
          }}
          style={{ padding: "5px", width: "50px" }}
          value={inputUsdtVndcFixed}
        />{" "}
        USDT: 1/
        {inputUsdtVndcFixed > 23000
          ? inputUsdtVndcFixed
          : usdtVndcFixedP2P !== 0
          ? usdtVndcFixedP2P
          : usdtVndcFixed}
      </div>
      <br />
      <table border="1">
        <thead>
          <tr>
            <th>NAME</th>
            <th>USDT</th>
            <th>VND</th>
            <th>USDT*COIN = VNDC</th>
          </tr>
        </thead>
        <tbody>
          {listCoinsWatch.map((item, index) => (
            <RowInfo
              key={index}
              name={item.name}
              vndcPrice={item.vndcPrice}
              usdtPrice={item.usdtPrice}
              usdtVndcFixed={item.usdtVndcFixed}
              pcAlert={item.pcAlert}
              percentInlation={item.percentInlation}
              handleALert={item.handleALert}
              percentShowWarning={item.percentShowWarning}
            />
          ))}
        </tbody>
      </table>
      <br />
      <span> PRICE MEXC </span>
      <table border="1">
        <thead>
          <tr>
            <th>NAME</th>
            <th>USDT_MEXC</th>
            <th>USDT_ONUS</th>
            <th>MEXC/ONUS</th>
          </tr>
        </thead>
        <tbody>
          {listCoinsWatchMexc.map((item, index) => (
            <tr>
              <td>{item.name}</td>
              <td>
                <div className="price usdt">
                  Buy: {Number(item.mexcPrice).toFixed(4)}
                  <br />
                  Sell:{Number(item.mexcPrice).toFixed(4)}
                </div>
              </td>
              <td>
                <div className="price vndc">
                  Buy: {Number(item.onusPrice?.bid).toFixed(4)}
                  <br />
                  Sell: {Number(item.onusPrice?.ask).toFixed(4)}
                </div>
                <div>
                  <input
                    onChange={(e) => {
                      this.setPercentAlert(e.target.value);
                    }}
                    value={item.percentAlert}
                  />
                  <button
                    onClick={() => {
                      this.setPercentAlertFixed(item.percentAlert);
                    }}
                  >
                    Set
                  </button>
                </div>
              </td>
              <td
                className={`${
                  item.percentFluctuating > 0 ? "up-price" : "down-price"
                }`}
              >
                {Number(
                  Number(item.mexcPrice) -
                    Number(item.onusPrice?.ask).toFixed(4)
                ).toFixed(4)}
                <br />
                {Number(
                  (Number(item.mexcPrice) -
                    Number(item.onusPrice?.ask).toFixed(4)) /
                    Number(item.onusPrice?.ask).toFixed(4)
                ).toFixed(2)}
                %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
