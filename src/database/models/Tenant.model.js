import { Model } from 'objection';
import { Review } from './Review.model.js';

export class Tenant extends Model {
	static get tableName() {
		return 'tenants';
	}

	static get relationMappings() {
		return {
			reviews: {
				relation: Model.HasManyRelation,
				modelClass: Review,
				join: {
					from: 'tenants.id',
					to: 'reviews.tenant_id',
				},
			},
		};
	}
}
