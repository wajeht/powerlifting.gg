import { Model } from 'objection';
import { Tenant } from './Tenant.model.js';

export class Review extends Model {
	static get tableName() {
		return 'reviews';
	}

	static get relationMappings() {
		return {
			owner: {
				relation: Model.BelongsToOneRelation,
				modelClass: Tenant,
				join: {
					from: 'reviews.tenant_id',
					to: 'tenants.id',
				},
			},
		};
	}
}
