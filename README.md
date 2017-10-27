# MyReads Project

This is the the final assessment project for Udacity's React Fundamentals course.


HELP:
when calling api: https://reactnd-books-api.udacity.com/search.  I am getting :
{"error":"Please provide an Authorization header to identify yourself (can be whatever you want)"}


but in the Books API, we have this :

export const search = (query, maxResults) =>
  fetch(`${api}/search`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, maxResults })
  }).then(res => res.json())
    .then(data => data.books)


Looks like 'it is ready to go' ? right .

plz give some suggestion how to fix this.

thanks.
