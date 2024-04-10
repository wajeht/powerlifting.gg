import autocannon from 'autocannon';

function main() {
	const url = `http://localhost:80/tenants`;

	const instance = autocannon(
		{
			url,
			connections: 1000,
			duration: 10,
			maxConnectionRequests: 1000,
			headers: {
				'content-type': 'text/html',
			},
		},
		finishedBench,
	);

	autocannon.track(instance);

	function finishedBench(err, res) {
		if (err) {
			console.error('Error during benchmark:', err);
		} else {
			console.log('Benchmark finished:', res);
		}
	}
}

main();
