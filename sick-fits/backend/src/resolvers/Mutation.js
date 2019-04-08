const bcrypt = require('bcryptjs');

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
	args.email = args.emil.toLowerCase();
	//hash the password
	}
};

module.exports = Mutations;
