## Use of metrics and alerts

1. The basic system metrics: basic server metrics like CPU, memory, disk I/O, network, etc.
2. The basic API metrics: number of requests, number of errors, average response time, etc.
With the alerts being the typical system alerts, like CPUs being too high, or number of requests dropping to 0.

### Weather specific metrics
With weather data I can imagine plenty of metrics which could be useful, of the top of my head:

1. Statistics over longer periods of time
2. Comparisons with historical data
3. Seasonality
4. Prediction and trends

As for alerts, I see two branches:

1. Alerts based on current data: this would not work with the few updates per day, but in a hypothetical world where we had more frequent updates we could trigger alerts based on current data.
2. Alerts based on forecast data: this would work better with the few updates per day, and could trigger alerts based on forecasts of things like temperature or precipitation.

## How to avoid unnecessary requests from data consumers if data updates happen a few times per day?

Here are a few options:

1. Client side caching: an example of this would be caching in the browser like many popular query libraries allow for.
2. Server side caching: introducing a cache layer between the API and the consumers. This way, the API would only be hit a few times per day.
3. Client side storage: similar to client side caching, but for clients with persistent storage, like mobile apps. In this case, the app could have its own database, with the data updating a couple of times per day.
4. Conditional requests: with headers like Etag or Last-Modified, we could allow consumers to make requests, but avoid sending the data if it has not changed.
5. Notifications: we could offer a notification service, like webhooks, so that consumers can subscribe to notifications when the data changes.

## Find ways to improve the handling of the income request of the users

1. Rate limiting: implement some kind of rate limiting with a sliding window that roughtly matches update frequency of the data.
2. Performance: there is probably room for improvement in database code, particulary around datetimes.

## What other things we could expand the service to provide more value to the user?

1. Full history: offer a way to retrieve the full history as a file.
2. More fields: the API currently offers a few fields. We could expand this offering with more fields.
3. More stations accross different areas

## How should we do AuthZ/AuthN? What trade-offs do you see?

1. If we want to enable machine to machine communication we could implement an API key system. Its easier to build and mantain than OAuth. However, API keys are not ideal if we want to offer a web interface where queries happen on the client.

2. If we want individual users to have direct access, say through a web interface, we should implement some sort of OAuth system. If it is only used by company users we could link it to our internal authentication system. If we want to offer it to external users then we should could implement it through thrid party authorities like Google, or if password based login is required then through something like Auth0 or AWS Cognito.

For now I see little value in having Authorization control. Imagining a future where the API grows, I would probably go for some kind of role based system. Is hard to imagine a weather data API needing to have fine grained access control, so heavier authentication systems would be overkill. A simple Role based system would be enough.