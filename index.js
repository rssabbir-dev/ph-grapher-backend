//Importing Package and Library
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

//Use Middleware
app.use(cors());
app.use(express.json());

//Default or Home path of server
app.get('/', (req, res) => {
	res.send('Ph_Grapher server is running');
});

//MongoDB Client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z9hjm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});
//Verify JWT Token
const verifyTwtToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader.split(' ')[1];
	if (!authHeader) {
		return res.status(401).send({ message: 'Unauthorized Access' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
		req.decoded = decoded;
	} catch (err) {
		return res.status(403).send({ message: 'Access Forbidden' });
	}
	next();
};
//JWT verify path
app.post('/jwt', (req, res) => {
	const user = req.body;
	const token = jwt.sign(
		user,
		process.env.JWT_ACCESS_TOKEN,
		{ algorithm: 'RS256' }
	);
	res.json({ token });
});
//Client Start Function
const run = async () => {
	const database = client.db('phGrapherDB');
	const serviceCollection = database.collection('services');
	const reviewCollection = database.collection('reviews');
	const blogCollection = database.collection('blogs');
	const testimonialCollection = database.collection('testimonials');
	const userCollection = database.collection('users');

	//Get All Services
	app.get('/services', async (req, res) => {
		const limit = parseInt(req.query.limit);
		const page = parseInt(req.query.page);
		const size = parseInt(req.query.size);
		const query = {};
		const count = await serviceCollection.estimatedDocumentCount();
		if (limit) {
			const services = await serviceCollection
				.find(query)
				.sort({ createAt: -1 })
				.limit(limit)
				.toArray();
			res.send(services);
		} else {
			const services = await serviceCollection
				.find(query)
				.sort({ createAt: -1 })
				.skip(page * size)
				.limit(size)
				.toArray();
			res.send({ count, services });
		}
	});

	//Create A Service
	app.post('/services', verifyTwtToken, async (req, res) => {
		const decoded = req.decoded;
		const service = req.body;
		const uid = req.query.uid;
		if (decoded.uid !== uid) {
			return res.status(403).send({ message: 'Access Forbidden' });
		}
		const result = await serviceCollection.insertOne(service);
		res.send(result);
	});

	//Get Only User Create Service
	app.get('/my-service', verifyTwtToken, async (req, res) => {
		const decoded = req.decoded;
		const uid = req.query.uid;
		const query = { createBy: uid };
		if (decoded.uid !== uid) {
			return res.status(403).send({ message: 'Access Forbidden' });
		}
		const services = await serviceCollection
			.find(query)
			.sort({ createAt: -1 })
			.toArray();
		const count = await serviceCollection.countDocuments(query);
		res.send({ count, services });
	});

	//Get a Single Service
	app.get('/service/:id', async (req, res) => {
		const id = req.params.id;
		const query = { _id: ObjectId(id) };
		const service = await serviceCollection.findOne(query);
		res.send(service);
	});

	//Post A review
	app.post('/review', verifyTwtToken, async (req, res) => {
		const decoded = req.decoded;
		const review = req.body;
		const uid = req.query.uid;
		if (decoded.uid !== uid) {
			return res.status(403).send({ message: 'Access Forbidden' });
		}
		const result = await reviewCollection.insertOne(review);
		res.send(result);
	});
	
	//Get all Reviews
	app.get('/reviews', async (req, res) => {
		const service_id = req.query.service_id;
		const page = parseInt(req.query.page);
		const size = parseInt(req.query.size);
		const query = { service_id: service_id };
		const reviews = await reviewCollection
			.find(query)
			.sort({ createAt: -1 })
			.skip(page * size)
			.limit(size)
			.toArray();
		const reviewsRating = await reviewCollection.find(query).toArray();
		const count = await reviewCollection.countDocuments(query);
		const sum = reviewsRating.reduce(
			(pre, cur) => pre + cur.user_rating,
			0
		);
		let average = 0;
		if (!isNaN(sum / count)) {
			average = sum / count;
		}
		res.send({ count, reviews, average });
	});

	//Get Single User Review
	app.get('/my-review', verifyTwtToken, async (req, res) => {
		const decoded = req.decoded;
		const uid = req.query.uid;
		const query = { user_uid: uid };
		if (decoded.uid !== uid) {
			return res.status(403).send({ message: 'Access Forbidden' });
		} else {
			const reviews = await reviewCollection
				.find(query)
				.sort({ createAt: -1 })
				.toArray();
			const count = await reviewCollection.countDocuments(query);
			res.send({ count, reviews });
		}
	});

	//Delete A My Review
	app.delete('/my-review-delete/', verifyTwtToken, async (req, res) => {
		const decoded = req.decoded;
		const id = req.query.id;
		const uid = req.query.uid;
		const query = { _id: ObjectId(id) };
		if (decoded.uid !== uid) {
			return res.status(403).send({ message: 'Access Forbidden' });
		} else {
			const result = await reviewCollection.deleteOne(query);
			res.send(result);
		}
	});

	//Update Review Item
	app.patch('/my-review-update', verifyTwtToken, async (req, res) => {
		const decoded = req.decoded;
		const id = req.query.id;
		const uid = req.query.uid;
		const review = req.body;
		const filter = { _id: ObjectId(id) };
		const updatedReview = {
			$set: review,
		};
		if (decoded.uid !== uid) {
			return res.status(403).send({ message: 'Access Forbidden' });
		} else {
			const result = await reviewCollection.updateOne(
				filter,
				updatedReview
			);
			res.send(result);
		}
	});

	//Get all Blogs
	app.get('/blogs', async (req, res) => {
		const query = {};
		const blogs = await blogCollection.find(query).toArray();
		res.send(blogs);
	});

	//Get all Testimonial
	app.get('/testimonials', async (req, res) => {
		const query = {};
		const testimonials = await reviewCollection.find(query).sort({createAt: -1}).limit(4).toArray();
		res.send(testimonials);
	});
	//Get all user
	app.get('/users', async (req, res) => {
		const query = {};
		const users = await userCollection.find(query).toArray();
		res.send(users);
	});
	// //Add New User To Database
	// app.post('/users', async (req, res) => {
	// 	const user = req.body;
	// 	const option = { upsert: true };
	// 	const query = { uid: user.uid };
	// 	const userInDb = await userCollection.findOne(query);
	// 	if (userInDb?.uid) {
	// 		return;
	// 	}
	// 	const result = userCollection.insertOne(user, option);
	// 	res.send(result);
	// });

	// //Check User isAdmin?
	// app.get('/user/admin/:uid', async (req, res) => {
	// 	const uid = req.params.uid;
	// 	const query = { uid };
	// 	const userInDb = await userCollection.findOne(query);
	// 	// if (userInDb?.role === 'admin') {
	// 	// 	return res.send(true);
	// 	// } else {
	// 	// 	return res.send(false);
	// 	// }
	// 	res.send({ isAdmin: userInDb?.role === 'admin' ? true : false });
	// });
	// //make admin
	// app.patch('/user/admin/:id', async (req, res) => {
	// 	const uid = req.body;
	// 	const id = req.params.id;
	// 	const queryAdmin = { uid: uid.uid };
	// 	const queryUser = { _id: ObjectId(id) };
	// 	const isAdmin = await userCollection.findOne(queryAdmin);
	// 	if (isAdmin?.role !== 'admin') {
	// 		return;
	// 	}
	// 	const updatedDoc = {
	// 		$set: {
	// 			role: 'admin',
	// 		},
	// 	};
	// 	const option = { upsert: true };
	// 	const result = userCollection.updateOne(queryUser, updatedDoc, option);
	// 	res.send(result);
	// });
};
//Client Start
run().catch((err) => console.log(err));

//Listen server on PORT
app.listen(port, () => {
	console.log(`Ph_Grapher server is running on ${port}`);
});
