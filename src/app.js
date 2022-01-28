var express = require("express");
var axios = require("axios");
var cors = require("cors");     //to allow CORS requests from AppGyver app
var randomDate = require('random-datetime');

var app = express();
app.use(cors()); //to allow CORS requests from AppGyver

const port = process.env.port || 8080;

/* Server setup */
app.use(express.json());


app.listen(port, () => {
    console.log("Server is running on port 8080");
});


/* 
parcelLab API Credentials 
Demo App - Do not hardcode the credentials for PRD scenarios
Update these values according to your tenant
*/

var parcelLabToken = "a6drj9EYikQsMb2Yp3WGSlvDvSC1MtsF2KAa38bih6OfB1iT";    //example Token
var parcelLabUserId = "1627282"; //example UserId


//.. gets the order details based on Order Number
//.. this handle is for requests coming from Mendix App
app.post("/Parcel", async (request, response) => {

    var orderCheckPoints = await getOrderCheckPoints(getSafe(() => request["body"]["OrderID"]));

    var order = getSafe(() => orderCheckPoints["orders"]["0"]["checkpoints"]);
    if (order) {
        response.send(order);
    } else {
        response.send({ status: 500, error: "checkpoints not found" });
    }
});

//.. gets the order details based on Order Number
//.. this handle is for requests coming from AppGyver App
app.get("/Parcel", async (request, response) => {

    var orderCheckPoints = await getOrderCheckPoints(getSafe(() => request["query"]["orderNo"]));

    var order = getSafe(() => orderCheckPoints["orders"]["0"]["parcels"][0]["checkpoints"]);
    if (order) {
        response.send(order);
    } else {
        response.send({ status: 500, error: "checkpoints not found" });
    }
});

//.. gets all the Orders of a Customer based on email address
//.. this handle is for requests coming from both Mendix and AppGyver App
app.get("/ParcelEmail", async (request, response) => {

    var custOrders = await getOrders(request.query.Email); 

    var orders = getSafe(() => custOrders["orders"]);

    if (orders) {   
        var order = {};
        var orderCollection = [];

        //.. Prepare the response for Order Collection 
        for (i = 0; i <= orders.length - 1; i++) {
            order.orderNo = orders[i].orderNo;

            var datetime = randomDate({
                year: new Date().getFullYear(),
                month: new Date().getMonth()
            }); //for demo sake, adding some random dates

            order.tracking_number = orders[i].parcels[0].tracking_number;

            order.courier = orders[i].parcels[0].courier.name;
            order.prettyname = orders[i].parcels[0].courier.prettyname;
            order.Deliverydate = datetime;
            order.Deliverydate1 = datetime.toUTCString();
            order.Deliverydate2 = datetime.toISOString();

            //to get courier details
            var courierDetails = await getCourierDetails(order.courier, order.tracking_number);
            var securityHash = getSafe(() => courierDetails["securityHash"]);

            order.brandedtrackingurl = `https://www.versand-status.de/?courier=${order.courier}&trackingNo=${order.tracking_number}&lang=en&banner_image=instagram&u=1615722&s=${securityHash}`;
            order.details = `https://prtl.parcellab.com/trackings/details?trackingNo=${order.tracking_number}&courier=${order.courier}`;

            orderCollection.push(JSON.parse(JSON.stringify(order)));
        }
        response.send({ root: orderCollection });
    } else {
        response.send({ root: [] });    //sending empty list as Orders not found
    }
});

//To safely access JSON keys
function getSafe(fn) {
    try {
        return fn();
    } catch (e) {
        return undefined;
    }
}

//.. To get the Courier Data from parcelLab
async function getCourierDetails(courier, trackingNumber) {
    try {
        var res = await axios({
            method: "get",
            url: `https://api.parcellab.com/v2/tracking-details/?courier=${courier}&tno=${trackingNumber}`,
            headers: {
                token: parcelLabToken,
                user: parcelLabUserId,
            },
            json: true,
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return res;
    }
}

//.. To get the Order Data from parcelLab using email address
async function getOrders(email) {
    try {
        var res = await axios({
            method: "get",
            url: `https://api.parcellab.com/orders/bot?customerEmail=${email}`,
            headers: {
                token: parcelLabToken,
                user: parcelLabUserId,
            },
            json: true,
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return res;
    }
}

//.. To get the CheckPoint Data from parcelLab for an Order
async function getOrderCheckPoints(OrderID) {
    console.log(OrderID);
    try {
        var res = await axios({
            method: "get",
            url: `https://api.parcellab.com/orders/bot?orderNo=${OrderID}`,
            headers: {
                token: parcelLabToken,
                user: parcelLabUserId,
            },
            json: true,
        });
        console.log(res.data);
        return res.data;
    } catch (e) {
        console.log(e);
        return res;
    }
}