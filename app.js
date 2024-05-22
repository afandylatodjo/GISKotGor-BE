const express = require("express");
const cors = require("cors");
const Browser = require("zombie");

const app = express();

const corsopt = {
    origin: "*"
}

app.use(cors(corsopt));
app.use(express.json())
app.use(express.urlencoded({extended: true}))


const priceType = {
    "pasarTradisional": 1,
    "pasarModern": 2,
    "pedagangBesar": 3,
    "produsen": 4
}

function setDate(date){
    return new Date(Date.now() +  (date * 24 * 60 * 60 * 1000) );
}

function dateLinkFormater(date){
    const format = date.toISOString().slice(0, 10);

    return format;
}

function setUrl(type){

    let startDate = dateLinkFormater(setDate(-7)), endDate = dateLinkFormater(setDate(0));
    let url = `https://www.bi.go.id/hargapangan/WebSite/TabelHarga/GetGridDataDaerah?price_type_id=${type}&comcat_id=cat_1&province_id=25&regency_id=66&market_id=&tipe_laporan=1&start_date=${startDate}&end_date=${endDate}&_=${(new Date()).getTime()}`
    return url;
}


app.get("/getPasarTradisional", async (req, res)=>{
    try{
        const browser = new Browser();
        await browser.visit(setUrl(priceType.pasarTradisional), ()=>{
            let resp = browser.querySelector("body").innerHTML;
            resp = JSON.parse(resp.toString());
            console.log(resp);
            res.json(resp.data);
        })
    }catch(err){
        res.json({"msg": err})
    }
    
})

app.get("/getPasarModern", async (req, res) => {
    try{
        const browser = new Browser();
        await browser.visit(setUrl(priceType.pasarModern), ()=>{
            let resp = browser.querySelector("body").innerHTML;
            resp = JSON.parse(resp.toString());
            res.json(resp.data);
        })
        
    }catch(err){
        res.json({"msg": err});
    }
    
})

app.get("/getPedagangBesar", async (req, res) => {
    try{
        const browser = new Browser();
        await browser.visit(setUrl(priceType.pedagangBesar), ()=>{
            let resp = browser.querySelector("body").innerHTML;
            resp = JSON.parse(resp.toString());
            res.json(resp.data);
        })
        
    }catch(err){
        res.json({"msg": err});
    }
    
})

app.get("/getProdusen", async (req, res) => {
    try{
        const browser = new Browser();
        await browser.visit(setUrl(priceType.produsen), ()=>{
            let resp = browser.querySelector("body").innerHTML;
            resp = JSON.parse(resp.toString());
            res.json(resp.data);
        })
        
    }catch(err){
        res.json({"msg": err});
    }
    
})

const PORT = 8080;
app.listen(PORT, () => {
console.clear()
console.log("Listening on port:"+PORT);
})