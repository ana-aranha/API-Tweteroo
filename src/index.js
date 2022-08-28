import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const users = [
	{
		username: "bobesponja",
		avatar:
			"https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?quality=70&strip=info",
	},
];

const tweets = [
	{
		username: "bobesponja",
		tweet: "eu amo o hub",
	},
	{
		username: "bobesponja",
		tweet: "eu amo o hub",
	},
];

app.post("/sign-up", (req, res) => {
	const { username, avatar } = req.body;

	if (!username || !avatar) {
		return res.status(400).send("Todos os campos são obrigatórios!");
	}

	users.push({ username, avatar });

	console.log(users);
	res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
	const { tweet } = req.body;
	const username = req.headers.user;

	if (!username || !tweet) {
		return res.status(400).send("Todos os campos são obrigatórios!");
	}

	for (let i in users) {
		if (users[i].username === username) {
			tweets.push({ username, tweet });

			console.log(tweets);
			return res.status(201).send("OK");
		}
	}

	res.status(400).send("Usuário inválido");
});

app.get("/tweets/:user", (req, res) => {
	const { user } = req.params;
	const LastTweets = [];

	for (let i in users) {
		if (users[i].username.toLowerCase() === user.toLowerCase()) {
			const userTweets = tweets.filter((tweet) => tweet.username === user);
			const userAvatar = users[i].avatar;

			if (userTweets.length < 10) {
				for (let i = userTweets.length - 1; i >= 0; i--) {
					const el = { ...userTweets[i] };
					el.avatar = userAvatar;
					LastTweets.push(el);
				}

				console.log(LastTweets);
				return res.send(LastTweets);
			}

			for (let i = tweets.length - 1; i >= tweets.length - 10; i--) {
				const el = { ...tweets[i] };
				for (let j in users) {
					if (users[j].username === tweets[i].username) {
						el.avatar = users[j].avatar;
						LastTweets.push(el);
					}
				}
			}
			return res.send(LastTweets);
		}
	}

	return res.sendStatus(400);
});

app.get("/tweets", (req, res) => {
	const LastTweets = [];

	if (tweets.length < 10) {
		for (let i = tweets.length - 1; i >= 0; i--) {
			const el = { ...tweets[i] };
			for (let j in users) {
				if (users[j].username === tweets[i].username) {
					el.avatar = users[j].avatar;
					LastTweets.push(el);
				}
			}
		}

		console.log(LastTweets);
		return res.send(LastTweets);
	}

	for (let i = tweets.length - 1; i >= tweets.length - 10; i--) {
		const el = { ...tweets[i] };
		for (let j in users) {
			if (users[j].username === tweets[i].username) {
				el.avatar = users[j].avatar;
				LastTweets.push(el);
			}
		}
	}

	/* 	if (tweets.length > (req.query.page-1)*10){
		for (
			let i = tweets.length - (req.query.page - 1) * 10 - 1;
			i >= tweets.length - (req.query.page - 1) * 10 - 10;
			i--
		) {
			const el = { ...tweets[i] };
			for (let j in users) {
				if (users[j].username === tweets[i].username) {
					el.avatar = users[j].avatar;
					LastTweets.push(el);
				}
			}
		}
	} */

	res.send(LastTweets);
});

app.listen(5000, () => {
	console.log("Listening on port 5000");
});
