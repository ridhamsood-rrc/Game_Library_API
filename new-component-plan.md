# New Component Plan: Subscription-Based Rate Limiting
 
## 1. Overview
This component implements **rate limiting based on user subscription status**.  
The main goal is to control API usage by applying different request limits to free and premium users.
We use the external middleware **express-rate-limit** to enforce request limits, and a new field
`isPremium` in the User model to determine which limit applies.
 
## 2. Why This Component
 
- Focuses on **rate limiting as the main feature**
- Uses an **external module (express-rate-limit)** not covered in class
- Adds **real-world API protection**
- Creates a clear difference between free and premium users
 
## 3. Data Model Update
 
### User Model
 
```json
{
  "userId": "user00001",
  "username": "exampleUser",
  "isPremium": false
}
 
 