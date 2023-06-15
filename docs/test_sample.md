```
$ curl -X POST http://localhost:3500/shorten -d '{"originalUrl":"https://www.lucidchart.com/pages/landing?utm_source=google&utm_medium=cpc&utm_campaign=_chart_en_tier1_mixed_search_brand_exact_&km_CPC_CampaignId=1490375427&km_CPC_AdGroupID=55688909257&km_CPC_Keyword=lucid%20chart&km_CPC_MatchType=e&km_CPC_ExtensionID=&km_CPC_Network=g&km_CPC_AdPosition=&km_CPC_Creative=442433236004&km_CPC_TargetID=aud-1888659850681:kwd-55720648523&km_CPC_Country=9000893&km_CPC_Device=c&km_CPC_placement=&km_CPC_target=&gclid=CjwKCAjw9J2iBhBPEiwAErwpeZ2hLNc3sfrB5TVAIoSVPEvZcVfkjXnbSznA_7UEuAMFYoNl3h3BQBoCz_YQAvD_BwE"}'
```

```
$ curl -X POST http://localhost:3500/users/register -d '{"email":"hello@gmail.com", "password":"1234"}'
```

```
$ curl -X POST http://localhost:3500/users/login -d '{"email":"hello@gmail.com", "password":"1234"}'
```

```
$ curl -X GET http://localhost:3500/users/me/profile
```

urlSchema

```js
const UrlSchema = new mongoose.Schema({
  type: mongoose.Schema.Types.ObjectId,
  shortUrl: String, // unique
  original: String,
  expiredAt: Date,
  createdAt: Date,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
```
