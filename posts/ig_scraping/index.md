# Scraping Instagram Followers In 2025

> Posted 09/07/25

In 2025, Meta attempts to close the door behind scraping the information from its platforms. And yet, there are still ways to do it.


## Selenium Approach

This common approach is the most robust, but the most elegant these days, and that is why it is only mentioned.


## API Approach

Instagram has its API `/api/v1` available, where the endpoint `/api/v1/friendships/{user_id}/followers/` provides that information. However, there is a catch. Meta does NOT allow getting all of the followers with a single request. An iteration is necessary, where the parameters `count` and `max_id` have to be set properly to provide the maximum efficiency of the scraping.

There is a note that needs to be taken. The Instagram API has its rate limiting. That means that only a given number of requests within one period of time can be sent without Meta closing the functioning API. This makes scraping a larger number of followers very inefficient.

The following Python script can be used to gather all the followers' usernames.

```
import requests
import json
import time

FOLLOWERS_COUNT = SET FOLLOWERS COUNT TO BE SCRAPED
USER_ID = # Set the user ID (the one with the followers)

# Base URL and headers
BASE_URL="https://www.instagram.com/api/v1/friendships/"+USER_ID+"/followers/"

# Static cookies and headers
COOKIES = # Set the cookies
HEADERS = # Set the request headers

# Initialize a session
session = requests.session()

# Initialize an empty set for unique usernames
unique_usernames = set()

# Loop to increment max_id in multiples of 12
for max_id in range(0, FOLLOWERS_COUNT, 1):

    params = {
        "count": 12,
        "max_id": max_id,
        "search_surface": "follow_list_page",
 }
    response = session.get(BASE_URL, headers=HEADERS, params=params, cookies=COOKIES)

    if response.status_code == 200:
        data = response.json()
        users = data.get("users", [])
        
        # Extract usernames and add them to the set
        for user in users:
            username = user.get("username")
            if username:
                unique_usernames.add(username)

        print(f"Processed max_id={max_id}, total unique usernames: {len(unique_usernames)}")
    else:
        print(f"Error: {response.status_code} for max_id={max_id}")
        break

    if len(unique_usernames) == FOLLOWERS_COUNT:
        break

# Define the file path
file_path = "followers.txt"

# Open the file in write mode and save each username to a new line
with open(file_path, 'w') as file:
    for username in unique_usernames:
        file.write(f"{username}\n")

print(f"Usernames have been saved to {file_path}. Total count is {len(unique_usernames)}.")
``` 

Be sure to edit the needed variables `FOLLOWERS_COUNT`,  `USER_ID`, `COOKIES`, and `HEADERS`. The `FOLLOWERS_COUNT` is the total number of followers that user `USER_ID` has. `COOKIES` and `HEADERS` can be obtained via developer tools or various browser extensions. Make sure that the `COOKIES` and `HEADERS` variables are Python `dict`, key -> value mappings of strings.

This approach works even for scraping other Instagram profiles' information.