const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {

	async createItem(parent, args, ctx, info){
		

		const item = await ctx.db.mutation.createItem(
			{
				data: {
					...args,
				},
			},
			info

			);
		console.log(item);
		return item;
	},

	updateItem(parent, args, ctx, info) {
		//take a copy of the updates
		const updates = { ...args };
		//remove the ID from the updates
		delete updates.id;
		//run the update method
		return ctx.db.mutation.updateItem(
		{
			data: updates,
			where: {
				id: args.id,
			},
		},
		info 
		); 
	},


	async deleteItem(parent, args, ctx, info) {
		const where = { id: args.id };
		//find the items
		const item = await ctx.db.query.item({ where }, `{ id title}`);
		// check for authorization to delete

		//delete item
		return ctx.db.mutation.deleteItem({ where }, info);
	},

	async signup(parent, args, ctx, info){
	//lowercase their email
	args.email = args.email.toLowerCase();
	//hash the password
	const password = await bcrypt.hash(args.password, 10);
	//create the user in the database
	const user = await ctx.db.mutation.createUser(
		{
			data: {
				...args,
				password,
				permissions: { set: ['USER'] },
			},
		},
		info
		);
	// create the JWT token 
	const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
	//set jwt as a cookie on the response
	ctx.response.cookie('token', token, {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 365,
	});
	//return user to browser
	return user;
	},

	async signin(parent, {email, password}, ctx, info) {
		//check if there is a user with the email
		const user = await ctx.db.query.user({where: {email} });
		if (!user) {
			throw new Error(`No such user found for email ${email}`);
		}
		//check if the password match
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new Error('Invalid Password');
		}
		//generate the JWT token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		//set the cookie with the token
		ctx.response.cookie('token', token, {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 365,
	});
		//return the user
		return user;
	},
};

module.exports = Mutations;
