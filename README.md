# Ph_Grapher Server side
### Technology used in this project
- node.js
- express.js
- cors
- dotenv
- jsonwebtoken - JWT
- mongodb 

### API Data used in this site
# Ph_Grapher Server OR API

### Get All Services Data with this api link - GET
- https://ph-grapher-backend.vercel.app/services?limit={}

### Get Only a user create services list - GET
- https://ph-grapher-backend.vercel.app/my-service?uid={uid}

### Get a single service by id - GET
- https://ph-grapher-backend.vercel.app/service/:id

### Get all reviews by service id - GET
- https://ph-grapher-backend.vercel.app/reviews?service_id={service_id}

### Get all reviews created by currentUser by uid - GET
- https://ph-grapher-backend.vercel.app/my-review?uid={uid}

### Get all blogs post - GET 
- https://ph-grapher-backend.vercel.app/blogs

### Get all testimonials - GET
- https://ph-grapher-backend.vercel.app/testimonials

### Create A Service Data - POST
- https://ph-grapher-backend.vercel.app/services?uid={uid}

### Post A Review - POST
- https://ph-grapher-backend.vercel.app/review?uid={uid}

### Delete a single review created by currentUser by uid and review id - DELETE
- https://ph-grapher-backend.vercel.app/my-review-delete?uid={uid}&id={id}

### Update a single review created by currentUser by uid and review id - PATCH
- https://ph-grapher-backend.vercel.app/my-review-update?uid={uid}&id={id}

### Get JWT TOKEN for user authorization - POST
- https://ph-grapher-backend.vercel.app/jwt