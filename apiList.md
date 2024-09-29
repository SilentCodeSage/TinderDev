authRouter
 - POST /signup
 - POST /login
 - POST /logout

profileRouter
 - GET /profile
 - PATCH /profile/edit
 - PATCH /profile/password => Change Password


connectionRequestRouter
 - POST /request/send/interested/:userId
 - POST /request/send/ignore/:userId
 - POST /request/review/accepted/:requestId
 - POST /request/review/rejected/:requestId

userRouter
 - GET /user/connections
 - GET /user/requests/received
 - GET /user/feed

Status options: ignore, interested, accepted, rejected
