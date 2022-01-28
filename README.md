# parcelLab API Proxy (Demo)

This is a sample demo app that acts as a proxy service between front-end app and parcelLab API service. 

Following scenarios are handled with this App:

* Fetch all orders of a Customer based on the Customer Email Address
* Fetch Order details based on Order Number
* Fetch CheckPoint data of an Order
* Get Tracking Data

The APIs used from parcelLab:

* /orders/bot?customerEmail=<email_address>
* /orders/bot?orderNo=<order_number>
* /v2/tracking-details/?courier=<courier>&tno=<trackingNumber>
  
# Sample Responses
  
  **All Orders of a Customer with Courier and Tracking data**
  ```
  {
    "root": [
        {
            "orderNo": "9000000395",
            "tracking_number": "40071267846048369",
            "courier": "purolator",
            "prettyname": "Purolator",
            "Deliverydate": "2021-09-22T22:12:23.428Z",
            "Deliverydate1": "Wed, 22 Sep 2021 22:12:23 GMT",
            "Deliverydate2": "2021-09-22T22:12:23.428Z",
            "brandedtrackingurl": "https://www.versand-status.de/?courier=purolator&trackingNo=40071267846048369&lang=en&banner_image=instagram&u=1615722&s=yRvpfdpW0f",
            "details": "https://prtl.parcellab.com/trackings/details?trackingNo=40071267846048369&courier=purolator"
        },
        {
            "orderNo": "9000000396",
            "tracking_number": "40047819480743048",
            "courier": "purolator",
            "prettyname": "Purolator",
            "Deliverydate": "2021-09-02T08:24:26.378Z",
            "Deliverydate1": "Thu, 02 Sep 2021 08:24:26 GMT",
            "Deliverydate2": "2021-09-02T08:24:26.378Z",
            "brandedtrackingurl": "https://www.versand-status.de/?courier=purolator&trackingNo=40047819480743048&lang=en&banner_image=instagram&u=1615722&s=tM5I08l0FQ",
            "details": "https://prtl.parcellab.com/trackings/details?trackingNo=40047819480743048&courier=purolator"
        }
    ]
}
  ```
  
  **Order CheckPoint details that's shown in Timeline**
  ```
  [
    {
        "location": "",
        "timestamp": "2022-01-23T19:11:47.994Z",
        "status": "OrderProcessed",
        "status_text": "Order processed",
        "status_details": "The order has been processed.",
        "shown": false,
        "full_courier_status": "If exists, date of order, else date of import to parcelLab"
    },
    {
        "shown": true,
        "location": "Granges",
        "timestamp": "2022-01-22T17:31:28.994Z",
        "status": "InboundScan",
        "status_text": "Dispatched",
        "status_details": "The goods have been sent.",
        "full_courier_status": "Shipment Pickup",
        "created": "2022-01-22T19:11:47.994Z"
    }
  ]
  ```
