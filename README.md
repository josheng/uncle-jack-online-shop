# Online Store MVP for Uncle Jack
<b>Prepared by: Joshua Eng</b>

## Tech Stack:
Backend: Flask with SQLAlchemy
DB: Postgres
Frontend: ReactJS with React Bootstrap
## Instruction to Run Application

For Backend:
- Install dependency from requirements.txt
- Run the code below:
```
flask run
```

For Frontend:
- Ensure ReactJS is set up
- Install the following dependency
```
npm install react-router-dom
npm install react-bootstrap bootstrap
npm install dompurify
```
- Run the code below to start locally:
```
npm start
```

## Objectives Attempted
- Create backend API to do the following:
  - Create a new product
  - Retrieve all product
  - Update an product
  - Delete an product
- For frontend webpage:
  - User view to browse the store, with items being displayed.
  - Admin view to manage item (create, update, edit, delete)
- Addtional Objective Attempted:
  - Backend API was also able to do the following:
    - CRUD actions with Database wrapper
    - Retrieve all users
    - Create activity log
    - Retrieve activity log
  - Whenever admin perform an activity, their actions are logged into the table.
  - Web page view with a table to see all user activity
  - All inputs on web page are sanitized before sending to API.
  - Products can be filtered by their category

## Hosting
Backend Flask API is hosted on:
- DB was changed from PSQL to MySQL as postgres requires a paid subscription
<strike>

```
engch28.pythonanywhere.com
```

</strike>

React App is hosted on:
<strike>
  
```
https://moonlit-kitten-862a7c.netlify.app/
```
  
</strike>

## Things to improve on
Due to time constraints, some function was not implemented which i will do so at my own time at a later date.
- Authentication using Flask JWT
- Login and Signup on frontend
- An actual shopping cart
- Product quantity
- Sort product by price
- Better overall frontend design.

## Additional
The API endpoint details can be found here:
```
https://documenter.getpostman.com/view/19186591/2s93eYTWxE
```
