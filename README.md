# price-averager (with express/node server version ) 


This version of the extension will use a Express server backend to scrape amazon prices for a product's average price. 

Since if we only use browser to directly request prices from Amazon we will encounter a CORS problem. 

The Express/Node server which is under our full control will request prices from amazon and have CORS enabled for our extension(front-end) 

**See NO express/node server version [here](https://github.com/niccololampa/price-averager/tree/feature/price-averager-no-node-server).**


## Setup 

### Installing Extension on Chrome 

Create a zip file of the build (based on the requirement of the project) 

```
cd app
npm run zip
```

Go to the root of the project unzip the produced file. 

![Screen Shot 2022-10-24 at 3 05 39 PM](https://user-images.githubusercontent.com/37615906/197467214-1de68c1d-83b6-4ba3-bc97-7104eefaf5d3.png)


Go to Chrome > Manage Extensions 

![Screen Shot 2022-10-24 at 3 02 39 PM](https://user-images.githubusercontent.com/37615906/197466724-e3dfab62-2794-490d-9a26-cb9b1a06201e.png)

Activate Developer Mode 

![Screen Shot 2022-10-24 at 3 03 29 PM](https://user-images.githubusercontent.com/37615906/197466837-6a99d2b0-5780-4838-920b-6c3990884307.png)

Go to Load unpacked 

![Screen Shot 2022-10-24 at 3 06 31 PM](https://user-images.githubusercontent.com/37615906/197467351-c71e2baf-8bb6-4f0f-98ea-4fcf016d33f5.png)

Then select the unzipped price averager build folder: 

![Screen Shot 2022-10-24 at 3 06 18 PM](https://user-images.githubusercontent.com/37615906/197467451-f1a09b2d-9f16-4517-9d93-411fca47e498.png)

![Screen Shot 2022-10-24 at 3 07 59 PM](https://user-images.githubusercontent.com/37615906/197467570-5443857c-f70c-4af7-a51a-4d7d8c507255.png)

Pin the extension 

![Screen Shot 2022-10-24 at 3 09 03 PM](https://user-images.githubusercontent.com/37615906/197467751-38d362aa-74e3-43eb-a6dc-e5cfc41f2473.png)


### Running our Express/ Node server 

To run the Express back-end server

```
cd server 
npm start
```


## Searching for average price 

Once the Express server is running at port 8000 we can do a search. 
![Screen Shot 2022-10-24 at 3 39 58 PM](https://user-images.githubusercontent.com/37615906/197472988-f48d07f0-15f6-4f67-b33d-691205bde365.png)


Click on the Average Price extension, then type the item name you want scrape. 

Also insert the number of pages you want to scrape (default: 1 page - top results) 

Examples: 

`pencil` (sold as a pack)

![Screen Shot 2022-10-24 at 3 13 56 PM](https://user-images.githubusercontent.com/37615906/197468506-02d8596c-fc8f-479c-a0cc-58f452da2242.png)

`shoes`

![Screen Shot 2022-10-24 at 3 23 26 PM](https://user-images.githubusercontent.com/37615906/197470080-f9f1427f-038a-439b-908b-e08b2f3ee556.png)


## Notes: 

1. The extension removes the price outliers before computing the average (see [helpers.ts](https://github.com/niccololampa/price-averager/blob/feature/price-averager-with-node-server/server/helper.ts#L50-L68) file). This is to have a more accurate price average. 
2. **As much as possible do not spam Amazon with requests. Wait for a little bit rather than doing consecutive requests.  Amazon tends to block search page requests if it detects abnormal usage. Spamming will result in the extension not being able to request prices for hours.**










