import path from 'path';
import dayjs from 'dayjs';
import { db } from '../../database/db.js';
import { getLog, getLogs } from './admin.util.js';
const logsDirPath = path.resolve(path.join(process.cwd(), 'src', 'logs'));

export function getAdminHandler() {
	return async (req, res) => {
		const startOfCurrentMonth = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
		const endOfCurrentMonth = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');

		const startOfPreviousMonth = dayjs()
			.subtract(1, 'month')
			.startOf('month')
			.format('YYYY-MM-DD HH:mm:ss');

		const { count: currentUserCount } = await db('users')
			.whereRaw('created_at >= ?', startOfCurrentMonth)
			.count('* as count')
			.first();

		const { count: previousUserCount } = await db('users')
			.whereRaw('created_at >= ?', startOfPreviousMonth)
			.andWhereRaw('created_at < ?', startOfCurrentMonth)
			.count('* as count')
			.first();

		let percentChange;
		if (previousUserCount === 0) {
			percentChange = currentUserCount === 0 ? 0 : 100;
		} else {
			percentChange = ((currentUserCount - previousUserCount) / previousUserCount) * 100;
		}

		let changeDescription;
		if (percentChange > 0) {
			changeDescription = `↗︎ ${currentUserCount} (${percentChange.toFixed(2)}%)`;
		} else if (percentChange < 0) {
			changeDescription = `↘︎ ${currentUserCount} (${Math.abs(percentChange).toFixed(2)}%)`;
		} else {
			changeDescription = `${currentUserCount} (No change)`;
		}

		const { count: currentTenantCount } = await db('tenants')
			.whereRaw('created_at >= ?', startOfCurrentMonth)
			.andWhereRaw('created_at <= ?', endOfCurrentMonth)
			.count('* as count')
			.first();

		const { count: currentReviewCount } = await db('reviews')
			.whereRaw('created_at >= ?', startOfCurrentMonth)
			.andWhereRaw('created_at <= ?', endOfCurrentMonth)
			.count('* as count')
			.first();

		const formattedDndOfCurrentMonth = dayjs(startOfCurrentMonth).format('MMMM D');
		const formattedEndOfCurrentMonth = dayjs(endOfCurrentMonth).format('MMMM D');

		let logs;
		let date = req.query.date?.split('.log')[0];

		if (date) {
			date = dayjs(date).format('YYYY-MM-DD');
			logs = await getLog({ date, dirPath: logsDirPath });
		} else {
			date = dayjs().format('YYYY-MM-DD');
			logs = await getLog({ date, dirPath: logsDirPath });
		}

		logs = logs.sort((a, b) => b.time.localeCompare(a.time));

		const dates = (await getLogs(logsDirPath))
			.map((l) => l.date)
			.filter((d) => d !== `${date}.log`);

		return res.status(200).render('./admin/admin.html', {
			user: {
				count: currentUserCount,
				percentChange: changeDescription,
			},
			tenant: {
				count: currentTenantCount,
				startOfCurrentMonth: formattedDndOfCurrentMonth,
				endOfCurrentMonth: formattedEndOfCurrentMonth,
			},
			review: {
				count: currentReviewCount,
				startOfCurrentMonth: formattedDndOfCurrentMonth,
				endOfCurrentMonth: formattedEndOfCurrentMonth,
			},
			date: date + '.log',
			logs,
			dates,
			flashMessages: req.flash(),
			title: 'Admin',
			path: '/admin',
			layout: '../layouts/admin.html',
		});
	};
}
